from fastapi import HTTPException, WebSocket

import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from db import SessionLocal
import asyncio
from prompts.alternative import get_alternate
from prompts.hair_care import get_hair_care_checker_prompt
from prompts.makeup import get_makeup_checker_prompt
from prompts.nutrition import get_nutrition_checker_prompt
from prompts.styling import get_styling_checker_prompt
from prompts.wellness import get_wellness_checker_prompt
from services.db_service import save_chat_message, get_user_session_data
from concurrent.futures import ThreadPoolExecutor
from prompts.ingredients import get_ingredient_checker_prompt
from prompts.skin_care import get_skincare_prompt
from prompts.trend_analysis import get_trend_analysis_prompt
from prompts.treatment import get_treatment_plan_prompt


def format_title(text: str) -> str:
    return text.replace("_", " ").title()


# SAFE OPENCV IMPORT - Replace line 19
def safe_import_cv2():
    """Safely import OpenCV with proper error handling"""
    try:
        import cv2

        print(f"✅ OpenCV loaded successfully: {cv2.__version__}")
        return cv2
    except ImportError as e:
        print(f"❌ OpenCV import failed: {e}")
        if "libGL" in str(e):
            print("🔧 Trying to use opencv-python-headless...")
            try:
                # Force uninstall regular opencv and install headless
                import subprocess
                import sys

                subprocess.run(
                    [sys.executable, "-m", "pip", "uninstall", "opencv-python", "-y"],
                    capture_output=True,
                )
                subprocess.run(
                    [
                        sys.executable,
                        "-m",
                        "pip",
                        "install",
                        "opencv-python-headless==4.12.0.88",
                    ],
                    capture_output=True,
                )

                import cv2

                print("✅ Successfully switched to opencv-python-headless")
                return cv2
            except Exception as install_error:
                print(f"❌ Failed to install headless version: {install_error}")

        # Fallback: Return None and handle gracefully
        print("⚠️ OpenCV not available - image analysis will be disabled")
        return None


# Initialize OpenCV safely
cv2 = safe_import_cv2()

import numpy as np
from PIL import Image
from io import BytesIO

executor = ThreadPoolExecutor()

load_dotenv()
chat_gpt = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

import json


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, dict[str, WebSocket]] = {}

    async def connect(self, user_id: str, feature_type: str, websocket: WebSocket):
        """Store connections by user_id and feature_type"""
        if user_id not in self.active_connections:
            self.active_connections[user_id] = {}
        self.active_connections[user_id][feature_type] = websocket

    def disconnect(self, user_id: str, feature_type: str):
        """Remove specific feature connection for user"""
        if user_id in self.active_connections:
            self.active_connections[user_id].pop(feature_type, None)
            # Clean up if no more connections for this user
            if not self.active_connections[user_id]:
                self.active_connections.pop(user_id)

    async def send_message(self, message: dict, user_id: str, feature_type: str):
        """Send message to specific feature connection"""
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id].get(feature_type)
            if websocket:
                try:
                    await websocket.send_text(json.dumps(message))
                    return True
                except Exception as e:
                    print(
                        f"[send_message] Error sending to {user_id}/{feature_type}: {e}"
                    )
                    self.disconnect(user_id, feature_type)
        return False


manager = ConnectionManager()


# Main function to get the appropriate prompt based on feature
def get_feature_prompt(feature_type: str, user_metrics: dict):
    try:
        if feature_type == "trend_analysis":
            return get_trend_analysis_prompt(user_metrics)
        elif feature_type == "ingredient_checker":
            return get_ingredient_checker_prompt(user_metrics)
        elif feature_type == "treatment_planning":
            return get_treatment_plan_prompt(user_metrics)
        elif feature_type == "product_alternative":
            return get_alternate()
        elif (
            feature_type == "meal_muse"
            or feature_type == "nutri_guide"
            or feature_type == "supp_smart"
        ):
            chat_title = format_title(feature_type)
            return get_nutrition_checker_prompt(user_metrics, chat_title)
        elif (
            feature_type == "fit_flow"
            or feature_type == "manifest_mode"
            or feature_type == "positivity_pulse"
            or feature_type == "self_spark"
            or feature_type == "stress_reset"
            or feature_type == "wellness_whisper"
            or feature_type == "zen_zone"
        ):
            chat_title = format_title(feature_type)
            return get_wellness_checker_prompt(user_metrics, chat_title)
        elif (
            feature_type == "formula_focus"
            or feature_type == "hair_decode"
            or feature_type == "style_spark"
            or feature_type == "tress_therapy"
        ):
            chat_title = format_title(feature_type)
            return get_hair_care_checker_prompt(user_metrics, chat_title)
        elif (
            feature_type == "event_edit"
            or feature_type == "fashion_fix"
            or feature_type == "shop_smart"
        ):
            chat_title = format_title(feature_type)
            return get_styling_checker_prompt(user_metrics, chat_title)
        elif (
            feature_type == "beauty_breakdown"
            or feature_type == "beauty_brief"
            or feature_type == "event_glam"
            or feature_type == "flawless_factor"
            or feature_type == "perfect_pair"
            or feature_type == "true_tone"
        ):
            chat_title = format_title(feature_type)
            return get_makeup_checker_prompt(user_metrics, chat_title)
        else:
            return get_skincare_prompt(user_metrics)
    except Exception as e:
        print(f"[get_feature_prompt] Error: {e}")
        return get_skincare_prompt({})


async def get_ai_response(feature_type: str, message: str, user_id: str):
    try:
        db = SessionLocal()
        try:
            user_data = get_user_session_data(db, user_id, feature_type)
        finally:
            db.close()

        system_prompt = get_feature_prompt(feature_type, user_data)
        messages = [{"role": "system", "content": system_prompt}]
        chat_history = user_data.get("chat_history", [])[-10:]
        messages.extend(chat_history)
        messages.append({"role": "user", "content": message})
        if "end chat" in message.lower():
            return "Thank you for chatting with us :)"

        try:
            # Assuming synchronous SDK call; consider async if available
            response = await asyncio.get_event_loop().run_in_executor(
                executor,
                lambda: chat_gpt.chat.completions.create(
                    model="gpt-4o",
                    messages=messages,
                    temperature=0.7,
                ),
            )
            ai_response = response.choices[0].message.content
        except Exception as e:
            print(f"[OpenAI] API call failed: {e}")
            return "Sorry! I had trouble generating a response. Please try again in a moment."

        db_message = messages.copy()
        db_message.append({"role": "system", "content": ai_response})
        save_chat_message(db, user_id, feature_type, message, db_message)
        db.close()
        return ai_response
    except Exception as outer_err:
        print(f"[get_ai_response] Fatal error: {outer_err}")
        return "Oops! Something went wrong. Please try again later."

# def detect_face(img_np):
#     """Detect faces using Haar cascades. Returns True if face found."""
#     gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)

#     # Load pre-trained frontal face classifier (comes with OpenCV)
#     face_cascade = cv2.CascadeClassifier(
#         cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
#     )

#     faces = face_cascade.detectMultiScale(
#         gray, scaleFactor=1.1, minNeighbors=5, minSize=(80, 80)
#     )

#     return len(faces) > 0

async def analyze_skin_features(image_bytes: bytes):
    # Check if OpenCV is available
    if cv2 is None:
        raise HTTPException(
            status_code=503,
            detail="Image analysis temporarily unavailable. OpenCV not loaded.",
        )

    try:
        # Load and preprocess image
        img = Image.open(BytesIO(image_bytes)).convert("RGB")
        img_np = np.array(img)
        # if not detect_face(img_np):
        #     raise HTTPException(
        #         status_code=400,
        #         detail="No face detected. Please upload a clear face photo.",
        #     )
        
        # Multiple resolution analysis
        img_256 = cv2.resize(img_np, (256, 256))
        img_128 = cv2.resize(img_np, (128, 128))

        # Color space conversions
        img_hsv = cv2.cvtColor(img_256, cv2.COLOR_RGB2HSV)
        img_lab = cv2.cvtColor(img_256, cv2.COLOR_RGB2LAB)
        img_gray = cv2.cvtColor(img_256, cv2.COLOR_RGB2GRAY)

        # Advanced metrics
        brightness = np.mean(img_hsv[:, :, 2])
        saturation = np.mean(img_hsv[:, :, 1])
        hue = np.mean(img_hsv[:, :, 0])

        # Color distribution analysis
        color_std = np.std(img_256, axis=(0, 1))
        overall_color_variation = np.mean(color_std)

        # Texture analysis
        laplacian_var = cv2.Laplacian(img_gray, cv2.CV_64F).var()

        # Sobel edge detection
        sobel_x = cv2.Sobel(img_gray, cv2.CV_64F, 1, 0, ksize=3)
        sobel_y = cv2.Sobel(img_gray, cv2.CV_64F, 0, 1, ksize=3)
        sobel_magnitude = np.sqrt(sobel_x**2 + sobel_y**2)
        edge_density = np.mean(sobel_magnitude)

        # --- IMPROVED Skin Type Detection ---
        skin_types = []

        # Fixed: Oily skin detection - brightness threshold too high, added edge density check
        if brightness > 120 and overall_color_variation < 40 and saturation > 25 and edge_density > 12:
            skin_types.append("oily")

        # Fixed: Dry skin detection - improved thresholds and added texture consideration
        if brightness < 100 and overall_color_variation < 30 and saturation < 40 and laplacian_var < 100:
            skin_types.append("dry")

        # Fixed: Combination skin detection - improved region analysis
        center_region = img_256[80:176, 80:176]  # Smaller, more focused T-zone
        t_zone_regions = [
            img_256[64:128, 112:144],  # Forehead
            img_256[128:192, 112:144], # Nose area
        ]
        cheek_regions = [
            img_256[128:192, 64:112],  # Left cheek
            img_256[128:192, 144:192], # Right cheek
        ]

        if len(t_zone_regions) > 0 and len(cheek_regions) > 0:
            t_zone_brightness = np.mean([
                np.mean(cv2.cvtColor(r, cv2.COLOR_RGB2HSV)[:, :, 2])
                for r in t_zone_regions if r.size > 0
            ])
            cheek_brightness = np.mean([
                np.mean(cv2.cvtColor(r, cv2.COLOR_RGB2HSV)[:, :, 2])
                for r in cheek_regions if r.size > 0
            ])
            
            t_zone_saturation = np.mean([
                np.mean(cv2.cvtColor(r, cv2.COLOR_RGB2HSV)[:, :, 1])
                for r in t_zone_regions if r.size > 0
            ])
            cheek_saturation = np.mean([
                np.mean(cv2.cvtColor(r, cv2.COLOR_RGB2HSV)[:, :, 1])
                for r in cheek_regions if r.size > 0
            ])

            # More sophisticated combination detection
            brightness_diff = abs(t_zone_brightness - cheek_brightness)
            saturation_diff = abs(t_zone_saturation - cheek_saturation)
            
            if brightness_diff > 12 or saturation_diff > 15:
                skin_types.append("combination")

        # Fixed: Sensitive skin detection - improved criteria
        if laplacian_var < 90 and overall_color_variation > 30 and edge_density < 15:
            # Additional check for redness indicators which suggest sensitivity
            red_channel = img_256[:, :, 0].astype(np.float32)
            green_channel = img_256[:, :, 1].astype(np.float32)
            rg_diff = np.mean(red_channel - green_channel)
            
            if rg_diff > 8:  # Slight redness indication
                skin_types.append("sensitive")

        # Fixed: Normal skin detection - better balanced criteria
        if (
            90 <= brightness <= 140
            and 20 <= overall_color_variation <= 35
            and 25 <= saturation <= 55
            and 80 <= laplacian_var <= 140
            and not skin_types
        ):
            skin_types.append("normal")

        # Default fallback
        if not skin_types:
            skin_types.append("normal")

        # --- IMPROVED Concerns Detection ---
        concerns = []

        # Fixed: Breakouts detection - better thresholds
        if laplacian_var > 150 and edge_density > 18:
            concerns.append("breakouts")

        # --- IMPROVED Redness Detection ---
        red_channel = img_256[:, :, 0].astype(np.float32)
        green_channel = img_256[:, :, 1].astype(np.float32)
        blue_channel = img_256[:, :, 2].astype(np.float32)

        # Avoid division by zero
        total_intensity = red_channel + green_channel + blue_channel
        total_intensity = np.where(total_intensity == 0, 1, total_intensity)
        red_ratio = red_channel / total_intensity

        rg_diff = red_channel - green_channel
        rb_diff = red_channel - blue_channel

        hue_channel = img_hsv[:, :, 0]
        # Fixed: Better red hue detection (HSV hue is 0-179 in OpenCV)
        red_hue_mask = (hue_channel <= 8) | (hue_channel >= 172)
        red_saturation = img_hsv[:, :, 1]

        avg_red_ratio = np.mean(red_ratio)
        avg_rg_diff = np.mean(rg_diff)
        avg_rb_diff = np.mean(rb_diff)

        # Fixed: Improved red area calculation
        red_areas = red_hue_mask & (red_saturation > 50) & (img_hsv[:, :, 2] > 60)
        red_area_percentage = np.sum(red_areas) / red_areas.size

        redness_detected = False
        
        # Primary redness detection
        if (
            avg_red_ratio > 0.38  # Lowered threshold
            and avg_rg_diff > 12   # Lowered threshold
            and avg_rb_diff > 10   # Lowered threshold
            and red_area_percentage > 0.12
        ):
            redness_detected = True

        # Secondary redness detection for more obvious cases
        if (
            avg_rg_diff > 25
            and avg_rb_diff > 20
            and red_area_percentage > 0.10
            and np.mean(red_saturation[red_hue_mask]) > 60
        ):
            redness_detected = True

        if redness_detected:
            concerns.append("redness")

        # --- IMPROVED Pigmentation Detection ---
        l_channel = img_lab[:, :, 0].astype(np.float32)
        a_channel = img_lab[:, :, 1].astype(np.float32)
        b_channel = img_lab[:, :, 2].astype(np.float32)

        l_std = np.std(l_channel)
        l_mean = np.mean(l_channel)

        # Fixed: Better dark spot detection
        kernel = np.ones((7, 7), np.float32) / 49  # Larger kernel for better smoothing
        l_smooth = cv2.filter2D(l_channel, -1, kernel)
        dark_spots = l_channel < (l_smooth - 6)  # Less aggressive threshold
        dark_spot_percentage = np.sum(dark_spots) / dark_spots.size

        # Fixed: Better melanin detection (LAB values are typically 0-255)
        melanin_areas = (a_channel > 130) & (b_channel > 130) & (l_channel < l_mean - 3)
        melanin_percentage = np.sum(melanin_areas) / melanin_areas.size

        # Fixed: Age spot detection
        age_spots = (l_channel < (l_mean - 8)) & (b_channel > 128)
        age_spot_percentage = np.sum(age_spots) / age_spots.size

        pigmentation_detected = False
        pigment_confidence = 0

        # More lenient thresholds
        if l_std > 12 and dark_spot_percentage > 0.08:
            pigment_confidence += 1
        if melanin_percentage > 0.06:
            pigment_confidence += 1
        if age_spot_percentage > 0.03:
            pigment_confidence += 1

        if pigment_confidence >= 2:
            pigmentation_detected = True

        if pigmentation_detected:
            concerns.append("hyperpigmentation")

        # --- IMPROVED Scarring Detection ---
        def apply_gabor_filter(img, theta):
            kernel = cv2.getGaborKernel(
                (21, 21), 3, theta, 10, 0.5, 0, ktype=cv2.CV_32F
            )
            return cv2.filter2D(img, cv2.CV_8UC3, kernel)

        gabor_responses = [
            apply_gabor_filter(img_gray, np.radians(a)) for a in [0, 45, 90, 135]
        ]
        gabor_magnitude = np.sqrt(sum(resp**2 for resp in gabor_responses))
        gabor_variance = np.var(gabor_magnitude)

        def local_binary_pattern(img, radius=1, n_points=8):
            h, w = img.shape
            lbp = np.zeros((h, w), dtype=np.uint8)
            for i in range(radius, h - radius):
                for j in range(radius, w - radius):
                    center = img[i, j]
                    code = 0
                    for k in range(n_points):
                        angle = 2 * np.pi * k / n_points
                        x = int(np.round(i + radius * np.cos(angle)))
                        y = int(np.round(j + radius * np.sin(angle)))
                        if 0 <= x < h and 0 <= y < w:  # Added bounds checking
                            if img[x, y] >= center:
                                code |= 1 << k
                    lbp[i, j] = code
            return lbp

        lbp = local_binary_pattern(img_gray)
        lbp_variance = np.var(lbp)

        # Line detection for scars
        kernel_line_h = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 1))
        kernel_line_v = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 15))
        lines_h = cv2.morphologyEx(img_gray, cv2.MORPH_OPEN, kernel_line_h)
        lines_v = cv2.morphologyEx(img_gray, cv2.MORPH_OPEN, kernel_line_v)
        line_features = cv2.bitwise_or(lines_h, lines_v)
        line_intensity = np.mean(line_features)

        # Fixed: Crater detection with better parameters
        circles = cv2.HoughCircles(
            img_gray,
            cv2.HOUGH_GRADIENT,
            dp=1,
            minDist=8,   # Reduced for better detection
            param1=50,
            param2=12,   # Lowered threshold
            minRadius=1, # Smaller minimum
            maxRadius=6, # Smaller maximum
        )
        crater_count = 0 if circles is None else len(circles[0])
        crater_density = crater_count / (256 * 256) * 10000

        # Gradient analysis
        grad_x = cv2.Sobel(img_gray, cv2.CV_64F, 1, 0, ksize=5)
        grad_y = cv2.Sobel(img_gray, cv2.CV_64F, 0, 1, ksize=5)
        gradient_magnitude = np.sqrt(grad_x**2 + grad_y**2)
        gradient_consistency = np.std(gradient_magnitude)

        scarring_detected = False
        scar_confidence = 0

        # Fixed: More realistic scarring thresholds
        if crater_density > 3 and laplacian_var > 160:
            scar_confidence += 1
        if line_intensity > 35 and gradient_consistency > 50:
            scar_confidence += 1
        if gabor_variance > 2000 and lbp_variance > 180:
            scar_confidence += 1
        if (np.max(img_gray) - np.min(img_gray)) > 180 and line_intensity > 30:
            scar_confidence += 1

        if scar_confidence >= 2:
            scarring_detected = True

        if scarring_detected:
            concerns.append("scarring")

        # --- IMPROVED Other Concerns ---
        # Fine lines detection - improved
        if laplacian_var > 100 and brightness < 110 and edge_density > 10:
            concerns.append("fine lines")

        # Dullness detection - improved
        if saturation < 30 and brightness < 120 and overall_color_variation < 25:
            concerns.append("dullness")

        # Enlarged pores - more realistic threshold
        if edge_density > 25 and crater_density > 2:
            concerns.append("enlarged pores")

        # --- IMPROVED Skin Tone Analysis ---
        avg_l = np.mean(l_channel)
        avg_a = np.mean(a_channel)
        avg_b = np.mean(b_channel)

        # Fixed: Better depth categorization (L* ranges 0-100 in LAB)
        if avg_l < 35:
            depth = "deep"
        elif avg_l < 50:
            depth = "medium-deep"
        elif avg_l < 65:
            depth = "medium"
        elif avg_l < 80:
            depth = "light"
        else:
            depth = "very light"

        # Fixed: Better undertone detection (a* and b* typically range -128 to +127, but OpenCV uses 0-255)
        # OpenCV LAB: L=0-255, a=0-255, b=0-255 where 128 is neutral
        if avg_b > 135 and avg_a > 130:
            undertone = "warm"
        elif avg_b < 125 and avg_a < 125:
            undertone = "cool"
        elif avg_b > 132 and avg_a < 125:
            undertone = "neutral-warm"
        elif avg_b < 125 and avg_a > 130:
            undertone = "neutral-cool"
        else:
            undertone = "neutral"

        tone = f"{undertone}, {depth} complexion"

        # Fixed: Better texture scoring
        texture_score = (laplacian_var * 0.6 + edge_density * 0.4)  # Weighted combination
        if texture_score < 25:
            texture = "very smooth"
        elif texture_score < 50:
            texture = "smooth"
        elif texture_score < 80:
            texture = "slightly textured"
        elif texture_score < 120:
            texture = "textured"
        else:
            texture = "very textured"

        # --- IMPROVED Under-eye Analysis ---
        height, width = img_gray.shape
        # Fixed: Better under-eye region positioning
        left_eye_region = img_gray[
            int(height * 0.58) : int(height * 0.72),  # Slightly lower
            int(width * 0.28) : int(width * 0.42),    # More precise positioning
        ]
        right_eye_region = img_gray[
            int(height * 0.58) : int(height * 0.72),
            int(width * 0.58) : int(width * 0.72),
        ]

        if left_eye_region.size > 0 and right_eye_region.size > 0:
            under_eye_avg = (np.mean(left_eye_region) + np.mean(right_eye_region)) / 2
            
            # Compare with nearby facial areas instead of whole face
            nearby_regions = [
                img_gray[int(height * 0.45) : int(height * 0.58), int(width * 0.28) : int(width * 0.72)],  # Upper cheek
                img_gray[int(height * 0.72) : int(height * 0.85), int(width * 0.28) : int(width * 0.72)],  # Lower cheek
            ]
            nearby_avg = np.mean([np.mean(region) for region in nearby_regions if region.size > 0])
            
            darkness_ratio = under_eye_avg / nearby_avg if nearby_avg > 0 else 1.0

            # Fixed: More accurate thresholds
            if darkness_ratio < 0.85:
                under_eye = "prominent dark circles"
            elif darkness_ratio < 0.92:
                under_eye = "visible dark circles"
            elif darkness_ratio < 0.96:
                under_eye = "mild dark circles"
            else:
                under_eye = "no visible dark circles"
        else:
            under_eye = "unable to detect"

        # Default to no concerns if none detected
        if not concerns:
            concerns = ["none detected"]

        # ADDED: Include undertone separately in results
        result = {
            "skin_types": skin_types,
            "concerns": concerns,
            "tone": tone,
            "undertone": undertone,  # Added undertone as separate field
            "texture": texture,
            "under_eye": under_eye,
        }
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to analyze image: {str(e)}"
        )