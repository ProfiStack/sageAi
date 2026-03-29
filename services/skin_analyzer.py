import numpy as np
import cv2
import warnings
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
from io import BytesIO
from typing import Dict, List, Tuple, Optional, Union
from mediapipe.tasks.python import vision
from mediapipe.tasks.python.core import base_options
from mediapipe.tasks.python.vision import RunningMode
from mediapipe import Image as MPImage, ImageFormat
import mediapipe as mp

from schemas.analysis import SkinAnalysisResult

warnings.filterwarnings("ignore")

executor = ThreadPoolExecutor()

class EnhancedFacialSkinAnalyzer:
    """Enhanced deterministic skin analysis pipeline with expanded features"""

    def __init__(
        self,
        model_path: str = "models/face_landmarker.task",
        min_detection_confidence: float = 0.7,
    ):
        self._init_landmarker(model_path, min_detection_confidence)

        # Determinism
        np.random.seed(42)

    # -------------------------------------------------------------------------
    # MediaPipe initialization (thread-safe)
    # -------------------------------------------------------------------------

    def _init_landmarker(self, model_path: str, min_detection_confidence: float):
        options = vision.FaceLandmarkerOptions(
            base_options=base_options.BaseOptions(model_asset_path=model_path),
            running_mode=RunningMode.IMAGE,
            num_faces=1,
            # refine_landmarks=True,
            min_face_detection_confidence=min_detection_confidence,
            min_face_presence_confidence=min_detection_confidence,
        )
        self.face_landmarker = vision.FaceLandmarker.create_from_options(options)

    def analyze(self, image_input: Union[str, bytes]) -> SkinAnalysisResult:
        """
        Main analysis pipeline

        Args:
            image_path: Path to face image

        Returns:
            SkinAnalysisResult with all attributes
        """
        # Load and validate image
      
        pil_image = self._load_image(image_input)
        img_rgb = np.asarray(pil_image)

        # Convert to RGB for MediaPipe
        # img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Step 1: Face detection and landmark extraction
        face_landmarks, face_bbox = self._detect_face(img_rgb)
        if face_landmarks is None:
            raise ValueError("No face detected in image")

        # Step 2: Region segmentation
        regions = self._segment_regions(img_rgb, face_landmarks)

        # Step 3: Color normalization (gray-world white balance)
        img_normalized = self._normalize_color(img_rgb)

        # Step 4: Extract normalized region colors and textures
        normalized_regions = self._extract_region_features(
            img_normalized, img_rgb, regions
        )

        # Step 5: Analyze lighting quality (affects confidence)
        lighting_quality = self._assess_lighting(img_rgb)

        # Step 6: Attribute extraction
        skin_type, skin_type_conf = self._classify_skin_type(
            normalized_regions["cheek"],
            lighting_quality,
            forehead_data=normalized_regions.get("forehead"),
        )

        concerns = self._detect_concerns_comprehensive(
            img_rgb,
            img_normalized,
            normalized_regions,
            face_landmarks,
            lighting_quality,
        )

        tone, tone_conf = self._classify_tone(
            normalized_regions["cheek"], lighting_quality
        )

        undertone, undertone_conf = self._classify_undertone(
            normalized_regions["cheek"], lighting_quality
        )

        texture, texture_conf = self._classify_texture(
            img_rgb, normalized_regions["cheek"], lighting_quality
        )

        under_eye, under_eye_conf = self._analyze_under_eye(
            normalized_regions["under_eye"],
            normalized_regions["cheek"],
            lighting_quality,
        )

        lip_color, lip_conf = self._analyze_lip_color_expanded(
            normalized_regions["lips"], lighting_quality
        )
        severe_concerns = [c["concern"] for c in concerns if c["severity"] == "severe"]

        # Build final result
        result = {
            "skin_type": skin_type,
            "concerns": severe_concerns,
            "tone": tone,
            "undertone": undertone,
            "texture": texture,
            "under_eye": under_eye,
            "lip_color": lip_color,
        }

        return result

    def _load_image(self, image_input: Union[str, bytes]) -> Image:
       if isinstance(image_input, bytes):
           return Image.open(BytesIO(image_input)).convert("RGB")
       return Image.open(image_input).convert("RGB")
    
    def _detect_face(
        self, img_rgb: np.ndarray
    ) -> Tuple[Optional[List[List[int]]], Optional[List[int]]]:

        mp_image = MPImage(
            image_format=ImageFormat.SRGB,
            data=img_rgb,
        )

        result = self.face_landmarker.detect(mp_image)

        if not result.face_landmarks:
            return None, None

        h, w = img_rgb.shape[:2]
        landmarks = result.face_landmarks[0]

        points = [
            [int(lm.x * w), int(lm.y * h)]
            for lm in landmarks
        ]

        pts = np.array(points)
        x_min, y_min = pts.min(axis=0)
        x_max, y_max = pts.max(axis=0)

        return points, [int(x_min), int(y_min), int(x_max), int(y_max)]


    def _segment_regions(
        self, img_rgb: np.ndarray, landmarks: List
    ) -> Dict[str, np.ndarray]:
        """
        Segment facial regions using landmark-based masks
        Regions: cheek (left/right), forehead, under_eye, lips, nose, chin, t_zone
        """
        h, w = img_rgb.shape[:2]
        masks = {}

        # MediaPipe landmark indices (fixed for consistency)
        # Right cheek area
        right_cheek_indices = [50, 101, 118, 100, 47, 126, 209, 194]
        # Left cheek area
        left_cheek_indices = [280, 330, 347, 329, 277, 355, 429, 420]
        # Forehead: upper face region
        forehead_indices = [
            10,
            338,
            297,
            332,
            284,
            251,
            389,
            356,
            454,
            323,
            361,
            288,
            397,
            365,
            379,
            378,
            400,
            377,
            152,
            148,
            176,
            149,
            150,
            136,
            172,
            58,
            132,
            93,
            234,
            127,
            162,
            21,
            54,
            103,
            67,
            109,
        ]
        # Under eye: lower eyelid area
        under_eye_left = [33, 7, 163, 144, 145, 153, 154, 155, 133]
        under_eye_right = [362, 382, 381, 380, 374, 373, 390, 249, 263]
        # Lips - outer and inner
        lips_outer = [
            61,
            146,
            91,
            181,
            84,
            17,
            314,
            405,
            321,
            375,
            291,
            308,
            324,
            318,
            402,
            317,
            14,
            87,
            178,
            88,
            95,
        ]
        # Nose bridge
        nose_indices = [6, 168, 197, 195, 5, 4, 1, 19, 94, 2]
        # Chin area
        chin_indices = [
            152,
            377,
            400,
            378,
            379,
            365,
            397,
            288,
            361,
            323,
            454,
            356,
            389,
            251,
            284,
            332,
            297,
            338,
        ]
        # T-zone (forehead + nose)
        t_zone_indices = [168, 6, 197, 195, 5, 4] + forehead_indices[:10]

        def create_region_mask(indices):
            mask = np.zeros((h, w), dtype=np.uint8)
            pts = np.array([landmarks[i] for i in indices], dtype=np.int32)
            cv2.fillPoly(mask, [pts], 255)
            return mask

        # Create masks
        masks["right_cheek"] = create_region_mask(right_cheek_indices)
        masks["left_cheek"] = create_region_mask(left_cheek_indices)

        # Combine cheeks for overall analysis
        masks["cheek"] = cv2.bitwise_or(masks["right_cheek"], masks["left_cheek"])

        masks["forehead"] = create_region_mask(forehead_indices)
        masks["under_eye_left"] = create_region_mask(under_eye_left)
        masks["under_eye_right"] = create_region_mask(under_eye_right)
        masks["under_eye"] = cv2.bitwise_or(
            masks["under_eye_left"], masks["under_eye_right"]
        )
        masks["lips"] = create_region_mask(lips_outer)
        masks["nose"] = create_region_mask(nose_indices)
        masks["chin"] = create_region_mask(chin_indices)
        masks["t_zone"] = create_region_mask(t_zone_indices)

        return masks

    def _normalize_color(self, img_rgb: np.ndarray) -> np.ndarray:
        """
        Normalize color using gray-world assumption
        Ensures consistent color representation across different lighting
        """
        img_float = img_rgb.astype(np.float32)

        # Gray-world white balance (deterministic)
        avg_r = np.mean(img_float[:, :, 0])
        avg_g = np.mean(img_float[:, :, 1])
        avg_b = np.mean(img_float[:, :, 2])

        avg_gray = (avg_r + avg_g + avg_b) / 3

        # Scale factors
        scale_r = avg_gray / (avg_r + 1e-6)
        scale_g = avg_gray / (avg_g + 1e-6)
        scale_b = avg_gray / (avg_b + 1e-6)

        # Apply correction
        img_float[:, :, 0] *= scale_r
        img_float[:, :, 1] *= scale_g
        img_float[:, :, 2] *= scale_b

        # Clip and convert back
        img_normalized = np.clip(img_float, 0, 255).astype(np.uint8)

        return img_normalized

    def _extract_region_features(
        self,
        img_normalized: np.ndarray,
        img_original: np.ndarray,
        masks: Dict[str, np.ndarray],
    ) -> Dict[str, Dict]:
        """
        Extract statistical color and texture features from each region
        Returns mean, std, median in RGB and LAB color spaces + texture metrics
        """
        region_features = {}

        img_lab = cv2.cvtColor(img_normalized, cv2.COLOR_RGB2LAB)
        img_hsv = cv2.cvtColor(img_normalized, cv2.COLOR_RGB2HSV)
        img_gray = cv2.cvtColor(img_original, cv2.COLOR_RGB2GRAY)

        for region_name, mask in masks.items():
            # Extract pixels in region
            rgb_pixels = img_normalized[mask > 0]
            lab_pixels = img_lab[mask > 0]
            hsv_pixels = img_hsv[mask > 0]

            if len(rgb_pixels) == 0:
                region_features[region_name] = None
                continue

            # ----------------------------------------------------------------
            # SKIN PIXEL FILTERING
            # Facial region masks (especially cheek, forehead) can inadvertently
            # include non-skin pixels: beard/stubble (very dark), specular
            # highlights (very bright), eyelashes, clothing edges, etc.
            # We filter to pixels whose L-channel falls in a plausible skin range
            # (L 30–240 in OpenCV 0–255 scale) and HSV saturation > 10 to exclude
            # near-grey/near-black artefacts.
            # Under-eye and lips are allowed a wider L range since they can be
            # naturally darker.
            # ----------------------------------------------------------------
            l_values = lab_pixels[:, 0].astype(np.float32)
            s_values = hsv_pixels[:, 1].astype(np.float32)

            if region_name in ("under_eye", "under_eye_left", "under_eye_right", "lips"):
                # Lips can be deeply pigmented; under-eye is naturally darker
                skin_mask = (l_values > 20) & (l_values < 245)
            else:
                # Skin regions: reject very dark (beard/shadow/hair) and blown-out pixels
                skin_mask = (l_values > 35) & (l_values < 242) & (s_values > 8)

            if np.sum(skin_mask) < 20:
                # Not enough clean skin pixels — fall back to raw (better than None)
                skin_mask = np.ones(len(rgb_pixels), dtype=bool)

            rgb_pixels = rgb_pixels[skin_mask]
            lab_pixels = lab_pixels[skin_mask]
            hsv_pixels = hsv_pixels[skin_mask]

            # Extract gray values for texture (from original non-normalised image)
            gray_region = img_gray * (mask > 0).astype(np.uint8)
            gray_pixels_all = gray_region[mask > 0]
            gray_pixels = gray_pixels_all[skin_mask]

            # Build a refined mask image for downstream use
            refined_mask = np.zeros_like(mask)
            mask_coords = np.column_stack(np.where(mask > 0))
            refined_mask[mask_coords[skin_mask, 0], mask_coords[skin_mask, 1]] = 255

            region_features[region_name] = {
                # RGB statistics
                "rgb_mean": np.mean(rgb_pixels, axis=0),
                "rgb_std": np.std(rgb_pixels, axis=0),
                "rgb_median": np.median(rgb_pixels, axis=0),
                # LAB statistics
                "lab_mean": np.mean(lab_pixels, axis=0),
                "lab_std": np.std(lab_pixels, axis=0),
                "lab_median": np.median(lab_pixels, axis=0),
                # HSV statistics
                "hsv_mean": np.mean(hsv_pixels, axis=0),
                "hsv_std": np.std(hsv_pixels, axis=0),
                # Texture metrics
                "gray_std": np.std(gray_pixels),
                "gray_range": np.ptp(gray_pixels),  # Peak-to-peak
                # Pixel data
                "pixel_count": len(rgb_pixels),
                "mask": refined_mask,
                "rgb_pixels": rgb_pixels,
                "lab_pixels": lab_pixels,
                "gray_pixels": gray_pixels,
            }

        return region_features

    def _assess_lighting(self, img_rgb: np.ndarray) -> float:
        """
        Assess lighting quality (0-1 scale)
        Higher score = better, more even lighting
        Affects confidence scores
        """
        # Convert to grayscale
        gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)

        # Check dynamic range
        hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
        hist_norm = hist.ravel() / hist.sum()

        # Entropy (higher = better distribution)
        entropy = -np.sum(hist_norm * np.log2(hist_norm + 1e-7))
        entropy_score = np.clip(entropy / 8.0, 0, 1)  # Normalize by max theoretical

        # Check for over/underexposure
        overexposed = np.sum(gray > 240) / gray.size
        underexposed = np.sum(gray < 20) / gray.size
        exposure_penalty = overexposed + underexposed
        exposure_score = 1.0 - np.clip(exposure_penalty * 10, 0, 1)

        # Combined score
        quality = 0.6 * entropy_score + 0.4 * exposure_score

        return quality

    def _classify_skin_type(
        self,
        cheek_data: Dict,
        lighting_quality: float,
        forehead_data: Dict = None,
    ) -> Tuple[str, float]:
        """
        Classify skin type based on texture proxies and colour variance.
        Types: oily, dry, combination, normal, sensitive

        NOTE: OpenCV HSV saturation is scaled 0–255 (not 0–100).
        Calibrated thresholds:
            oily skin:       saturation > 105  (~41 %)
            dry skin:        saturation <  70  (~27 %)
            combination:     forehead significantly oilier than cheeks (diff > 25)
            sensitive:       high redness variance in a-channel
            normal:          everything else

        T-zone detection: compare forehead saturation vs cheek saturation.
        A meaningful difference (forehead oilier) indicates combination skin.
        """
        if cheek_data is None:
            return "unknown", 0.0

        # Texture proxy: mean of per-channel RGB std
        texture_score = float(np.mean(cheek_data["rgb_std"]))

        # Lightness variance in LAB L channel
        l_std = float(cheek_data["lab_std"][0])

        # OpenCV HSV saturation: 0–255
        saturation = float(cheek_data["hsv_mean"][1])
        brightness = float(cheek_data["hsv_mean"][2])

        # T-zone vs cheek comparison (key for combination detection)
        t_zone_sat_diff = 0.0
        if forehead_data is not None:
            t_zone_sat_diff = float(forehead_data["hsv_mean"][1]) - saturation

        # ---- Classification ----
        if texture_score > 18 and saturation > 105 and l_std > 10:
            # Uniformly high saturation + texture → oily
            skin_type = "oily"
        elif saturation < 70 and brightness > 80:
            # Low colour saturation, not too dark → dry
            skin_type = "dry"
        elif t_zone_sat_diff > 25:
            # Forehead notably oilier than cheeks → combination
            skin_type = "combination"
        elif l_std > 14 or cheek_data["lab_std"][1] > 10:
            # High lightness or redness variance → reactive/sensitive
            skin_type = "sensitive"
        else:
            skin_type = "normal"

        base_confidence = 0.74
        confidence = base_confidence * lighting_quality

        return skin_type, confidence

    def _detect_concerns_comprehensive(
        self,
        img_original: np.ndarray,
        img_normalized: np.ndarray,
        regions: Dict,
        landmarks: List,
        lighting_quality: float,
    ) -> List[Dict]:
        """
        Comprehensive skin concerns detection with severity levels
        Concerns: acne, redness, dark_circles, hyperpigmentation, dark_spots,
                 scars, uneven_tone, enlarged_pores, fine_lines, wrinkles, dullness
        """
        concerns = []

        # Convert to different color spaces
        img_lab = cv2.cvtColor(img_normalized, cv2.COLOR_RGB2LAB)
        img_gray = cv2.cvtColor(img_original, cv2.COLOR_RGB2GRAY)

        # ============ ACNE DETECTION ============
        acne_concern = self._detect_acne(img_gray, img_lab, regions, lighting_quality)
        if acne_concern:
            concerns.append(acne_concern)

        # ============ REDNESS DETECTION ============
        redness_concern = self._detect_redness(img_lab, regions, lighting_quality)
        if redness_concern:
            concerns.append(redness_concern)

        # ============ DARK CIRCLES ============
        # OpenCV LAB L is 0–255.  A difference of 6 L-units is a ~2 % change —
        # far too small to be a visible dark circle.  Calibrated thresholds:
        #   mild    : diff > 15  (~6 % darker)
        #   moderate: diff > 25  (~10 % darker)
        #   severe  : diff > 38  (~15 % darker)
        if regions["under_eye"] is not None and regions["cheek"] is not None:
            under_eye_l = float(regions["under_eye"]["lab_mean"][0])
            cheek_l = float(regions["cheek"]["lab_mean"][0])

            darkness_diff = cheek_l - under_eye_l
            if darkness_diff > 15:
                if darkness_diff > 38:
                    severity = "severe"
                elif darkness_diff > 25:
                    severity = "moderate"
                else:
                    severity = "mild"

                confidence = min(0.88, (darkness_diff / 50) * lighting_quality)
                concerns.append(
                    {
                        "concern": "dark_circles",
                        "severity": severity,
                        "confidence": round(confidence, 3),
                    }
                )

        # ============ HYPERPIGMENTATION & DARK SPOTS ============
        pigmentation_concerns = self._detect_pigmentation(
            img_lab, regions, lighting_quality
        )
        concerns.extend(pigmentation_concerns)

        # ============ SCARRING DETECTION ============
        scar_concern = self._detect_scars(img_gray, img_lab, regions, lighting_quality)
        if scar_concern:
            concerns.append(scar_concern)

        # ============ UNEVEN TONE ============
        # l_std is the within-region standard deviation of the L channel.
        # Even perfectly smooth skin has natural variance ~5–12 units in 0–255 scale.
        # Calibrated thresholds for genuinely uneven tone:
        #   mild    : l_std > 18
        #   moderate: l_std > 26
        #   severe  : l_std > 35
        if regions["cheek"] is not None:
            l_std = float(regions["cheek"]["lab_std"][0])
            if l_std > 18:
                if l_std > 35:
                    severity = "severe"
                elif l_std > 26:
                    severity = "moderate"
                else:
                    severity = "mild"

                confidence = min(0.85, (l_std / 45) * lighting_quality)
                concerns.append(
                    {
                        "concern": "uneven_tone",
                        "severity": severity,
                        "confidence": round(confidence, 3),
                    }
                )

        # ============ ENLARGED PORES ============
        pore_concern = self._detect_enlarged_pores(img_gray, regions, lighting_quality)
        if pore_concern:
            concerns.append(pore_concern)

        # ============ FINE LINES & WRINKLES ============
        line_concerns = self._detect_lines_wrinkles(img_gray, regions, lighting_quality)
        concerns.extend(line_concerns)

        # ============ DULLNESS ============
        # OpenCV HSV saturation and value are both 0–255.
        # Dull skin = low colour saturation + moderately low brightness.
        # Typical healthy skin: saturation 70–150, value 120–200.
        # Dull thresholds:
        #   mild    : saturation < 65  and brightness < 160
        #   moderate: saturation < 50  and brightness < 140
        #   severe  : saturation < 35  and brightness < 120
        if regions["cheek"] is not None:
            saturation = float(regions["cheek"]["hsv_mean"][1])
            brightness = float(regions["cheek"]["hsv_mean"][2])

            if saturation < 65 and brightness < 160:
                if saturation < 35 and brightness < 120:
                    severity = "severe"
                elif saturation < 50 and brightness < 140:
                    severity = "moderate"
                else:
                    severity = "mild"

                confidence = 0.73 * lighting_quality
                concerns.append(
                    {
                        "concern": "dullness",
                        "severity": severity,
                        "confidence": round(confidence, 3),
                    }
                )

        return (
            concerns
            if concerns
            else [{"concern": "none_detected", "severity": "none", "confidence": 0.9}]
        )

    def _detect_acne(
        self,
        img_gray: np.ndarray,
        img_lab: np.ndarray,
        regions: Dict,
        lighting_quality: float,
    ) -> Optional[Dict]:
        """
        Detect acne using redness + texture anomalies.
        Acne shows as localised red bumps with texture variation.

        Key calibration decisions:
        - Threshold at a_mean + 2.0 * std (catches ~2.3% of pixels, not 16%).
        - Absolute floor: spots must have a > 148 (genuinely red, not just warm skin).
        - Spot pixel-area window widened to 5–120 px to handle image resolution variance.
        - Spot counts raised significantly to avoid false mild classifications.
        - Texture correlation required: gray_std must also be elevated.
        - Spot ratio guard: spots must cover a meaningful fraction of the face area.
        """
        if regions["cheek"] is None or regions["forehead"] is None:
            return None

        # Combine cheek + forehead as the primary acne-prone zone
        face_mask = cv2.bitwise_or(
            regions["cheek"]["mask"], regions["forehead"]["mask"]
        )

        # Include chin if available (also acne-prone)
        if regions.get("chin") is not None:
            face_mask = cv2.bitwise_or(face_mask, regions["chin"]["mask"])

        # Extract a-channel (red-green axis) for the face region
        a_channel = img_lab[:, :, 1].copy().astype(np.float32)
        face_a = a_channel[face_mask > 0]

        if len(face_a) == 0:
            return None

        a_mean = float(np.mean(face_a))
        a_std = float(np.std(face_a))

        # Threshold: 2 standard deviations above the local mean, AND
        # must be above an absolute redness floor (a > 148 in OpenCV LAB 0–255).
        # This prevents warm-toned skin (high average a) from being misclassified.
        red_threshold = max(a_mean + 2.0 * a_std, 148.0)

        # Create binary mask of genuinely red spots
        red_spots_mask = (
            (a_channel > red_threshold) & (face_mask > 0)
        ).astype(np.uint8)

        # Morphological close to merge nearby pixels into coherent spots
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        red_spots_mask = cv2.morphologyEx(red_spots_mask, cv2.MORPH_CLOSE, kernel)

        # Count connected components
        num_labels, _labels, stats, _ = cv2.connectedComponentsWithStats(
            red_spots_mask, connectivity=8
        )

        # Only count components whose area falls in the acne-spot range
        total_face_px = int(np.sum(face_mask > 0))
        valid_spots = 0
        spot_area_total = 0
        for i in range(1, num_labels):
            area = int(stats[i, cv2.CC_STAT_AREA])
            # Acne spots: 5–120 pixels (avoids counting noise or large flush areas)
            if 5 <= area <= 120:
                valid_spots += 1
                spot_area_total += area

        # Spot coverage ratio (guard against flagging a few tiny specks)
        spot_ratio = spot_area_total / (total_face_px + 1e-6)

        # Texture check: genuine acne raises the overall surface roughness
        gray_face = img_gray[face_mask > 0]
        gray_std = float(np.std(gray_face))

        # ---- Classification (conservative thresholds) ----
        # Mild:     ≥12 spots  AND  coverage ≥ 0.3%  AND  texture elevated
        # Moderate: ≥20 spots  OR  (≥12 spots + high texture)
        # Severe:   ≥35 spots  OR  (≥20 spots + very high texture)
        if valid_spots >= 35 or (valid_spots >= 20 and gray_std > 28):
            severity = "severe"
            confidence = 0.78
        elif valid_spots >= 20 or (valid_spots >= 12 and gray_std > 24):
            severity = "moderate"
            confidence = 0.74
        elif valid_spots >= 12 and spot_ratio >= 0.003 and gray_std > 18:
            severity = "mild"
            confidence = 0.68
        else:
            return None

        return {
            "concern": "acne",
            "severity": severity,
            "confidence": round(confidence * lighting_quality, 3),
        }

    def _detect_redness(
        self, img_lab: np.ndarray, regions: Dict, lighting_quality: float
    ) -> Optional[Dict]:
        """
        Detect generalised facial redness (rosacea-like, not acne spots).
        Different from acne: redness is diffuse (low a-channel std) rather than spotty.

        OpenCV LAB neutral a = 128.  Typical warm skin a ≈ 132–140.
        Clinical redness starts at a ≈ 143 when accompanied by low std
        (low std = even flush, not acne spots).
        Calibrated thresholds:
            mild    : a > 143  and a_std < 12
            moderate: a > 150
            severe  : a > 158
        """
        if regions["cheek"] is None:
            return None

        a_channel = float(regions["cheek"]["lab_mean"][1])
        a_std = float(regions["cheek"]["lab_std"][1])

        # Require diffuse (low std) redness — spotty high-a is handled by acne detector
        if a_channel > 143 and a_std < 12:
            if a_channel > 158:
                severity = "severe"
                confidence = 0.82
            elif a_channel > 150:
                severity = "moderate"
                confidence = 0.79
            else:
                severity = "mild"
                confidence = 0.74

            return {
                "concern": "redness",
                "severity": severity,
                "confidence": round(confidence * lighting_quality, 3),
            }

        return None

    def _detect_pigmentation(
        self, img_lab: np.ndarray, regions: Dict, lighting_quality: float
    ) -> List[Dict]:
        """
        Detect hyperpigmentation and dark spots
        """
        concerns = []

        if regions["cheek"] is None and regions["forehead"] is None:
            return concerns

        # Get combined face region
        face_regions = ["cheek", "forehead", "chin"]
        l_values = []

        for region_name in face_regions:
            if regions.get(region_name) is not None:
                l_values.extend(regions[region_name]["lab_pixels"][:, 0])

        if len(l_values) == 0:
            return concerns

        l_values = np.array(l_values)
        l_mean = np.mean(l_values)
        l_std = np.std(l_values)

        # Detect dark spots (localized darker areas)
        # Calculate how many pixels are significantly darker
        dark_threshold = l_mean - 1.5 * l_std
        very_dark_threshold = l_mean - 2.0 * l_std

        dark_pixels = np.sum(l_values < dark_threshold)
        very_dark_pixels = np.sum(l_values < very_dark_threshold)
        total_pixels = len(l_values)

        dark_ratio = dark_pixels / total_pixels
        very_dark_ratio = very_dark_pixels / total_pixels

        # Dark spots (small isolated areas)
        if very_dark_ratio > 0.03:  # >3% significantly darker
            severity = "severe"
            confidence = 0.80
            concerns.append(
                {
                    "concern": "dark_spots",
                    "severity": severity,
                    "confidence": confidence * lighting_quality,
                }
            )
        elif dark_ratio > 0.08:  # >8% moderately darker
            severity = "moderate"
            confidence = 0.75
            concerns.append(
                {
                    "concern": "dark_spots",
                    "severity": severity,
                    "confidence": confidence * lighting_quality,
                }
            )

        # General hyperpigmentation (overall uneven lightness across face regions).
        # l_std here is pooled across cheek + forehead + chin pixels, so natural
        # variation between regions is included.  Meaningful hyper-pigmentation
        # shows as a much larger spread. Calibrated thresholds for 0–255 scale:
        #   mild    : l_std > 22
        #   moderate: l_std > 30
        #   severe  : l_std > 40
        if l_std > 22:
            if l_std > 40:
                severity = "severe"
                confidence = 0.78
            elif l_std > 30:
                severity = "moderate"
                confidence = 0.75
            else:
                severity = "mild"
                confidence = 0.71

            concerns.append(
                {
                    "concern": "hyperpigmentation",
                    "severity": severity,
                    "confidence": round(confidence * lighting_quality, 3),
                }
            )

        return concerns

    def _detect_scars(
        self,
        img_gray: np.ndarray,
        img_lab: np.ndarray,
        regions: Dict,
        lighting_quality: float,
    ) -> Optional[Dict]:
        """
        Detect scarring using texture and color discontinuities
        Scars show as areas with different texture and often different lightness
        """
        if regions["cheek"] is None:
            return None

        # Get cheek region
        mask = regions["cheek"]["mask"]

        # Compute Laplacian only inside the cheek mask (avoids global inflation)
        laplacian = cv2.Laplacian(img_gray, cv2.CV_64F)
        laplacian_abs = np.abs(laplacian)

        # Get texture in cheek region only
        texture_region = laplacian_abs[mask > 0]

        if len(texture_region) == 0:
            return None

        # Use std of local Laplacian (more stable than variance for varying image sizes)
        texture_std = float(np.std(texture_region))

        # Also check for lightness discontinuities inside cheek region
        l_channel = img_lab[:, :, 0]
        l_region = l_channel[mask > 0]
        l_std = float(np.std(l_region))

        # Scars: high within-region Laplacian std + lightness irregularity
        # Smooth skin:   texture_std 5–15,  l_std  5–15  → scar_score 0.5–2.5
        # Visible scars: texture_std 20–40, l_std 18–30  → scar_score 3.5–6+
        scar_score = (texture_std / 10.0) + (l_std / 12.0)

        if scar_score > 5.0:
            severity = "moderate"
            confidence = 0.66  # Lower confidence — scars are hard to detect reliably
        elif scar_score > 3.5:
            severity = "mild"
            confidence = 0.62
        else:
            return None

        return {
            "concern": "scars",
            "severity": severity,
            "confidence": confidence * lighting_quality,
        }

    def _detect_enlarged_pores(
        self, img_gray: np.ndarray, regions: Dict, lighting_quality: float
    ) -> Optional[Dict]:
        """
        Detect enlarged pores using local texture variance.
        Pores show as small dark spots with regular patterns.

        IMPORTANT: Laplacian variance must be computed only inside the skin mask,
        NOT over the whole image (which includes hair/background and inflates the score).
        Typical Laplacian std values inside a smooth face region: 5–15.
        Enlarged pores / rough skin: 20–40+.
        """
        if regions["nose"] is None and regions["cheek"] is None:
            return None

        # Build pore mask from nose + cheek
        pore_mask = np.zeros_like(img_gray)
        if regions["nose"] is not None:
            pore_mask = cv2.bitwise_or(pore_mask, regions["nose"]["mask"])
        if regions["cheek"] is not None:
            pore_mask = cv2.bitwise_or(pore_mask, regions["cheek"]["mask"])

        # Compute Laplacian ONLY inside the masked region
        laplacian = cv2.Laplacian(img_gray, cv2.CV_64F)
        lap_region = laplacian[pore_mask > 0]
        gray_region = img_gray[pore_mask > 0]

        if len(lap_region) == 0:
            return None

        # Use std of Laplacian inside region (not global var which is unreliable)
        lap_std = float(np.std(lap_region))
        local_std = float(np.std(gray_region))

        # Combined pore score: Laplacian std is the primary signal
        # Smooth skin:       lap_std  5–15,  local_std  5–15  → score 1–3
        # Textured/porous:   lap_std 20–40,  local_std 15–25  → score 4–8
        pore_score = (lap_std / 8.0) + (local_std / 15.0)

        if pore_score > 6.5:
            severity = "severe"
            confidence = 0.68
        elif pore_score > 4.5:
            severity = "moderate"
            confidence = 0.66
        elif pore_score > 3.0:
            severity = "mild"
            confidence = 0.62
        else:
            return None

        return {
            "concern": "enlarged_pores",
            "severity": severity,
            "confidence": round(confidence * lighting_quality, 3),
        }

    def _detect_lines_wrinkles(
        self, img_gray: np.ndarray, regions: Dict, lighting_quality: float
    ) -> List[Dict]:
        """
        Detect fine lines and wrinkles using edge detection
        """
        concerns = []

        if regions["forehead"] is None and regions["under_eye"] is None:
            return concerns

        # Raise Canny thresholds to reduce noise/hair/pore edges being counted as lines
        edges = cv2.Canny(img_gray, threshold1=50, threshold2=120)

        # Analyze forehead (common wrinkle area).
        # Edge density > 0.12 = genuinely wrinkled forehead (old threshold 0.08 was too low)
        if regions["forehead"] is not None:
            forehead_edges = edges[regions["forehead"]["mask"] > 0]
            if len(forehead_edges) > 0:
                edge_density = np.sum(forehead_edges > 0) / len(forehead_edges)

                if edge_density > 0.14:
                    concerns.append(
                        {
                            "concern": "wrinkles",
                            "severity": "moderate",
                            "confidence": round(0.70 * lighting_quality, 3),
                        }
                    )
                elif edge_density > 0.09:
                    concerns.append(
                        {
                            "concern": "fine_lines",
                            "severity": "mild",
                            "confidence": round(0.65 * lighting_quality, 3),
                        }
                    )

        # Analyze under-eye (fine lines common)
        if regions["under_eye"] is not None:
            under_eye_edges = edges[regions["under_eye"]["mask"] > 0]
            if len(under_eye_edges) > 0:
                edge_density = np.sum(under_eye_edges > 0) / len(under_eye_edges)

                if edge_density > 0.10 and not any(
                    c["concern"] == "fine_lines" for c in concerns
                ):
                    concerns.append(
                        {
                            "concern": "fine_lines",
                            "severity": "mild",
                            "confidence": round(0.62 * lighting_quality, 3),
                        }
                    )

        return concerns

    def _classify_tone(
        self, cheek_data: Dict, lighting_quality: float
    ) -> Tuple[str, float]:
        """
        Classify skin tone using L channel (lightness) from LAB.
        Scale: very_light, light, medium_light, medium, medium_deep, deep, very_deep

        NOTE: OpenCV converts 8-bit RGB → LAB with L scaled to [0, 255], not [0, 100].
        Thresholds are calibrated for this range:
            L > 195  → very_light  (Fitzpatrick I)
            L > 168  → light       (Fitzpatrick II)
            L > 142  → medium_light (Fitzpatrick III)
            L > 115  → medium       (Fitzpatrick IV)
            L > 88   → medium_deep  (Fitzpatrick IV–V)
            L > 62   → deep         (Fitzpatrick V)
            else     → very_deep    (Fitzpatrick VI)
        """
        if cheek_data is None:
            return "unknown", 0.0

        l_value = cheek_data["lab_mean"][0]

        # Calibrated for OpenCV LAB L channel (0–255 scale)
        if l_value > 195:
            tone = "very_light"
        elif l_value > 168:
            tone = "light"
        elif l_value > 142:
            tone = "medium_light"
        elif l_value > 115:
            tone = "medium"
        elif l_value > 88:
            tone = "medium_deep"
        elif l_value > 62:
            tone = "deep"
        else:
            tone = "very_deep"

        # High confidence for tone (relatively stable measurement)
        confidence = 0.88 * lighting_quality

        return tone, confidence

    def _classify_undertone(
        self, cheek_data: Dict, lighting_quality: float
    ) -> Tuple[str, float]:
        """
        Classify undertone using 'a' and 'b' channels from LAB.
        Types: warm, warm_golden, cool, cool_pink, neutral, neutral_warm, neutral_cool

        OpenCV LAB (8-bit): neutral point is 128 for both a and b.
          a > 128 → reddish/pink  |  b > 128 → yellowish/warm
          a < 128 → greenish      |  b < 128 → bluish/cool

        Typical skin a_diff range: +3 to +20 (almost always slightly red)
        Typical skin b_diff range: +5 to +30 (warm) or −5 to +5 (cool)

        Scoring approach:
          - b_diff dominates undertone (yellow vs blue is the clearest signal)
          - a_diff is secondary (distinguishes peachy-warm from pink-cool)
          - Require a score gap of ≥2 to commit; otherwise neutral sub-type
        """
        if cheek_data is None:
            return "unknown", 0.0

        a_channel = float(cheek_data["lab_mean"][1])
        b_channel = float(cheek_data["lab_mean"][2])

        # Offset from neutral midpoint
        a_diff = a_channel - 128.0
        b_diff = b_channel - 128.0

        warm_score = 0
        cool_score = 0

        # ---- Yellow/blue axis (b) — primary signal ----
        if b_diff > 18:
            warm_score += 4       # Strongly golden/warm
        elif b_diff > 10:
            warm_score += 3       # Warm
        elif b_diff > 4:
            warm_score += 1       # Slightly warm
        elif b_diff < -6:
            cool_score += 4       # Blue-ish / cool
        elif b_diff < -2:
            cool_score += 2       # Slightly cool

        # ---- Red/pink axis (a) — secondary signal ----
        if a_diff > 12:
            if b_diff > 5:
                warm_score += 2   # Peachy red → warm
            else:
                cool_score += 2   # Pink red → cool
        elif a_diff > 6:
            if b_diff <= 2:
                cool_score += 1   # Leaning pink

        # ---- Determine undertone ----
        if warm_score >= cool_score + 2:
            undertone = "warm_golden" if b_diff > 18 else "warm"
        elif cool_score >= warm_score + 2:
            undertone = "cool_pink" if a_diff > 8 else "cool"
        else:
            # Neutral: use the residual lean
            if abs(b_diff) < 5 and abs(a_diff) < 5:
                undertone = "neutral"
            elif b_diff >= 0:
                undertone = "neutral_warm"
            else:
                undertone = "neutral_cool"

        # Undertone is a subtler measurement → slightly lower confidence
        confidence = 0.72 * lighting_quality

        return undertone, round(confidence, 3)

    def _classify_texture(
        self, img_rgb: np.ndarray, cheek_data: Dict, lighting_quality: float
    ) -> Tuple[str, float]:
        """
        Classify texture using local variance and edge density
        Types: very_smooth, smooth, moderate, textured, rough
        """
        if cheek_data is None:
            return "unknown", 0.0

        # Use Laplacian variance as texture proxy
        gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
        laplacian = cv2.Laplacian(gray, cv2.CV_64F)
        texture_variance = laplacian.var()

        # Also use standard deviation from region
        gray_std = cheek_data["gray_std"]

        # Combined texture score
        texture_score = (texture_variance / 50) + (gray_std / 5)

        # Thresholds
        if texture_score < 2.5:
            texture = "very_smooth"
        elif texture_score < 4.5:
            texture = "smooth"
        elif texture_score < 6.5:
            texture = "moderate"
        elif texture_score < 9:
            texture = "textured"
        else:
            texture = "rough"

        # Confidence depends on lighting
        confidence = 0.73 * lighting_quality

        return texture, confidence

    def _analyze_under_eye(
        self, under_eye_data: Dict, cheek_data: Dict, lighting_quality: float
    ) -> Tuple[str, float]:
        """
        Analyze under-eye area darkness relative to cheek
        States: none, mild, moderate, severe
        """
        if under_eye_data is None or cheek_data is None:
            return "unknown", 0.0

        under_eye_l = float(under_eye_data["lab_mean"][0])
        cheek_l = float(cheek_data["lab_mean"][0])

        # Relative darkness (OpenCV LAB L: 0–255 scale).
        # Match thresholds to the dark_circles concern detector:
        #   none    : diff < 12
        #   mild    : diff 12–22
        #   moderate: diff 22–35
        #   severe  : diff > 35
        darkness_diff = cheek_l - under_eye_l

        if darkness_diff < 12:
            state = "none"
        elif darkness_diff < 22:
            state = "mild"
        elif darkness_diff < 35:
            state = "moderate"
        else:
            state = "severe"

        confidence = 0.78 * lighting_quality

        return state, round(confidence, 3)

    def _analyze_lip_color_expanded(
        self, lips_data: Dict, lighting_quality: float
    ) -> Tuple[str, float]:
        """
        Expanded lip color analysis with 8 categories
        Categories: pale, nude, natural, light_pink, pink, coral, rose, mauve, red, berry, brown
        """
        if lips_data is None:
            return "unknown", 0.0

        rgb_mean = lips_data["rgb_mean"]
        hsv_mean = lips_data["hsv_mean"]
        lab_mean = lips_data["lab_mean"]

        r, g, b = rgb_mean
        h, s, v = hsv_mean
        l, a_lab, b_lab = lab_mean

        # OpenCV HSV ranges: H 0–179, S 0–255, V 0–255
        # OpenCV LAB ranges: L 0–255, a 0–255 (neutral=128), b 0–255 (neutral=128)
        lightness = float(l)    # 0–255
        saturation = float(s)   # 0–255
        hue = float(h)          # 0–179  ← NOT 0–360

        # Convert OpenCV hue to 0–360 for easier reasoning
        hue360 = hue * 2.0      # 0–360

        a_diff = float(a_lab) - 128.0   # red-green offset
        b_diff = float(b_lab) - 128.0   # yellow-blue offset

        # Lip-specific LAB thresholds (0–255 L-scale):
        # very light lips: L > 170, medium: 120-170, dark: < 120
        # Low-saturation check: sat < 80 (31%) = desaturated/muted

        # Classification with corrected OpenCV scale
        # PALE: Very light, very low saturation
        if lightness > 175 and saturation < 80:
            lip_color = "pale"

        # NUDE: Light, peachy/beige (warm b_diff, low saturation)
        elif lightness > 145 and saturation < 110 and b_diff > 5:
            lip_color = "nude"

        # BROWN: Darker, warm, lower saturation
        elif lightness < 120 and saturation < 110 and b_diff > 0:
            lip_color = "brown"

        # RED: Vivid red hue — hue360 near 0° or 360°
        elif saturation > 150 and (hue360 < 30 or hue360 > 330):
            lip_color = "red"

        # CORAL: Orange-red — hue360 20–55°
        elif saturation > 100 and 20 < hue360 < 55:
            lip_color = "coral"

        # BERRY: Deep purple-red — hue360 300–345°, darker
        elif saturation > 120 and lightness < 140 and 300 < hue360 <= 360:
            lip_color = "berry"

        # MAUVE: Purple-pink, medium saturation — hue360 280–310°
        elif saturation > 70 and 280 < hue360 < 315:
            lip_color = "mauve"

        # ROSE: Bright pink-red — hue360 330–360° or high a_diff
        elif saturation > 90 and (hue360 > 330 or hue360 < 10):
            if a_diff > 15 or saturation > 140:
                lip_color = "rose"
            else:
                lip_color = "pink"

        # LIGHT_PINK: Soft pink, lighter
        elif saturation > 60 and 300 < hue360 <= 360 and lightness > 150:
            lip_color = "light_pink"

        # PINK: General pink range — hue360 300–360°
        elif saturation > 70 and hue360 > 300:
            lip_color = "pink"

        # NATURAL: Neutral / muted / everything else
        else:
            lip_color = "natural"

        confidence = 0.70 * lighting_quality

        return lip_color, round(confidence, 3)

    def save_result_json(self, result: SkinAnalysisResult, output_path: str):
        """Save analysis result as JSON"""
        with open(output_path, "w") as f:
            json.dump(asdict(result), f, indent=2, default=str)

    def visualize_analysis(
        self, image_path: str, result: SkinAnalysisResult, output_path: str
    ):
        """
        Create annotated visualization of analysis
        Shows detected regions and key attributes
        """
        img = cv2.imread(image_path)
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Create overlay with text
        overlay = img_rgb.copy()
        h, w = img_rgb.shape[:2]

        # Text parameters
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 0.5
        thickness = 1
        y_offset = 20
        line_height = 22

        # Draw results
        texts = [
            f"Skin Type: {result.skin_type} ({result.skin_type_confidence:.2f})",
            f"Tone: {result.tone} ({result.tone_confidence:.2f})",
            f"Undertone: {result.undertone} ({result.undertone_confidence:.2f})",
            f"Texture: {result.texture} ({result.texture_confidence:.2f})",
            f"Under Eye: {result.under_eye} ({result.under_eye_confidence:.2f})",
            f"Lip Color: {result.lip_color} ({result.lip_color_confidence:.2f})",
            "Concerns:",
        ]

        y_pos = y_offset
        for text in texts:
            cv2.putText(
                overlay, text, (10, y_pos), font, font_scale, (0, 255, 0), thickness
            )
            y_pos += line_height

        # Add concerns
        for concern in result.concerns[:5]:  # Limit to first 5
            concern_text = f"  - {concern['concern']}: {concern['severity']} ({concern['confidence']:.2f})"
            cv2.putText(
                overlay,
                concern_text,
                (10, y_pos),
                font,
                font_scale,
                (255, 200, 0),
                thickness,
            )
            y_pos += line_height

        # Save
        output_bgr = cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR)
        cv2.imwrite(output_path, output_bgr)


# ============================================================================
# EXAMPLE USAGE
# ============================================================================


def main():
    """Example usage of the enhanced skin analysis pipeline"""

    # Initialize analyzer
    analyzer = EnhancedFacialSkinAnalyzer(min_detection_confidence=0.7)

    # Analyze image
    image_path = "face_sample.jpg"  # Replace with your image path

    try:
        result = analyzer.analyze(image_path)

        # Print results
        print("=" * 70)
        print("ENHANCED FACIAL SKIN ANALYSIS RESULTS")
        print("=" * 70)
        print(
            f"\nSkin Type: {result.skin_type} (confidence: {result.skin_type_confidence:.2f})"
        )
        print(f"Tone: {result.tone} (confidence: {result.tone_confidence:.2f})")
        print(
            f"Undertone: {result.undertone} (confidence: {result.undertone_confidence:.2f})"
        )
        print(
            f"Texture: {result.texture} (confidence: {result.texture_confidence:.2f})"
        )
        print(
            f"Under Eye: {result.under_eye} (confidence: {result.under_eye_confidence:.2f})"
        )
        print(
            f"Lip Color: {result.lip_color} (confidence: {result.lip_color_confidence:.2f})"
        )

        print("\n" + "=" * 70)
        print("DETECTED CONCERNS:")
        print("=" * 70)
        if result.concerns:
            for i, concern in enumerate(result.concerns, 1):
                print(f"{i}. {concern['concern'].upper()}")
                print(f"   Severity: {concern['severity']}")
                print(f"   Confidence: {concern['confidence']:.2f}")
                print()

        print(f"Lighting Quality: {result.metadata['lighting_quality']:.2f}")
        print("=" * 70)

        # Save JSON output
        analyzer.save_result_json(result, "enhanced_skin_analysis_result.json")
        print("\n✓ Results saved to: enhanced_skin_analysis_result.json")

        # Create visualization
        analyzer.visualize_analysis(
            image_path, result, "enhanced_skin_analysis_visual.jpg"
        )
        print("✓ Visualization saved to: enhanced_skin_analysis_visual.jpg")

    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        import traceback

        traceback.print_exc()
