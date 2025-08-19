from fastapi import HTTPException, WebSocket

import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from db import SessionLocal
import asyncio
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

        # Texture analysis using multiple methods
        laplacian_var = cv2.Laplacian(img_gray, cv2.CV_64F).var()

        # Sobel edge detection for texture
        sobel_x = cv2.Sobel(img_gray, cv2.CV_64F, 1, 0, ksize=3)
        sobel_y = cv2.Sobel(img_gray, cv2.CV_64F, 0, 1, ksize=3)
        sobel_magnitude = np.sqrt(sobel_x**2 + sobel_y**2)
        edge_density = np.mean(sobel_magnitude)

        # --- Enhanced Skin Type Detection ---
        skin_types = []

        # More sophisticated oily skin detection
        if brightness > 150 and overall_color_variation < 35 and saturation > 30:
            skin_types.append("oily")

        # Enhanced dry skin detection
        if brightness < 90 and overall_color_variation < 28 and saturation < 35:
            skin_types.append("dry")

        # Combination skin with T-zone analysis
        center_region = img_256[64:192, 64:192]  # Center T-zone area
        outer_regions = [
            img_256[0:64, :],  # top
            img_256[192:256, :],  # bottom
            img_256[:, 0:64],  # left
            img_256[:, 192:256],  # right
        ]

        center_brightness = np.mean(
            cv2.cvtColor(center_region, cv2.COLOR_RGB2HSV)[:, :, 2]
        )
        outer_brightness = np.mean(
            [
                np.mean(cv2.cvtColor(region, cv2.COLOR_RGB2HSV)[:, :, 2])
                for region in outer_regions
            ]
        )

        if abs(center_brightness - outer_brightness) > 15:
            skin_types.append("combination")

        # Sensitive skin indicators
        if laplacian_var < 80 and overall_color_variation > 25:
            skin_types.append("sensitive")

        # Normal skin
        if (
            80 <= brightness <= 150
            and 25 <= overall_color_variation <= 40
            and 30 <= saturation <= 60
            and not skin_types
        ):
            skin_types.append("normal")

        if not skin_types:
            skin_types.append("normal")

        # --- Enhanced Concerns Detection ---
        concerns = []

        # Acne/breakouts
        if laplacian_var > 180 and edge_density > 15:
            concerns.append("breakouts")

        # --- FIXED REDNESS ANALYSIS ---
        red_channel = img_256[:, :, 0].astype(np.float32)
        green_channel = img_256[:, :, 1].astype(np.float32)
        blue_channel = img_256[:, :, 2].astype(np.float32)

        # Method 1: Normalized redness index - more conservative
        total_intensity = red_channel + green_channel + blue_channel
        total_intensity = np.where(total_intensity == 0, 1, total_intensity)
        red_ratio = red_channel / total_intensity

        # Method 2: Red dominance over green/blue - stricter thresholds
        rg_diff = red_channel - green_channel
        rb_diff = red_channel - blue_channel

        # Method 3: HSV-based redness detection - more precise
        hue_channel = img_hsv[:, :, 0]
        red_hue_mask = (hue_channel <= 10) | (hue_channel >= 170)  # Narrower red range
        red_saturation = img_hsv[:, :, 1]

        # Calculate redness metrics
        avg_red_ratio = np.mean(red_ratio)
        avg_rg_diff = np.mean(rg_diff)
        avg_rb_diff = np.mean(rb_diff)

        # Red areas with HIGH saturation and proper hue (more selective)
        red_areas = red_hue_mask & (red_saturation > 60) & (img_hsv[:, :, 2] > 70)  # Higher thresholds
        red_area_percentage = np.sum(red_areas) / red_areas.size

        # Much more conservative redness detection
        redness_detected = False

        # All conditions must be met and thresholds are higher
        if (avg_red_ratio > 0.42 and  # Higher threshold
            avg_rg_diff > 15 and      # Much higher difference required
            avg_rb_diff > 12 and      # Higher blue difference
            red_area_percentage > 0.15):  # More red area required
            redness_detected = True

        # Very obvious redness only
        if (avg_rg_diff > 30 and 
            avg_rb_diff > 25 and 
            red_area_percentage > 0.12 and
            np.mean(red_saturation[red_hue_mask]) > 70):  # High saturation in red areas
            redness_detected = True

        if redness_detected:
            concerns.append("redness")

        # --- NEW: PIGMENTATION DETECTION ---
        # Convert to LAB for better pigmentation analysis
        l_channel = img_lab[:, :, 0].astype(np.float32)
        a_channel = img_lab[:, :, 1].astype(np.float32)
        b_channel = img_lab[:, :, 2].astype(np.float32)

        # Method 1: Lightness variation analysis
        l_std = np.std(l_channel)
        l_mean = np.mean(l_channel)
        
        # Method 2: Local contrast analysis for dark spots
        kernel = np.ones((5,5), np.float32) / 25
        l_smooth = cv2.filter2D(l_channel, -1, kernel)
        dark_spots = l_channel < (l_smooth - 8)  # Areas significantly darker than surroundings
        dark_spot_percentage = np.sum(dark_spots) / dark_spots.size

        # Method 3: Brown/melanin detection using a* and b* channels
        # Melanin typically shows up as positive a* (red-green axis toward red) and positive b* (blue-yellow toward yellow)
        melanin_areas = (a_channel > 135) & (b_channel > 135) & (l_channel < l_mean - 5)
        melanin_percentage = np.sum(melanin_areas) / melanin_areas.size

        # Method 4: Age spot detection (darker, warmer areas)
        age_spots = (l_channel < (l_mean - 12)) & (b_channel > 132)
        age_spot_percentage = np.sum(age_spots) / age_spots.size

        # Pigmentation detection logic
        pigmentation_detected = False
        
        if (l_std > 12 and dark_spot_percentage > 0.08) or \
           (melanin_percentage > 0.05) or \
           (age_spot_percentage > 0.03):
            pigmentation_detected = True
            
        # Additional check for post-inflammatory hyperpigmentation
        if laplacian_var > 100 and melanin_percentage > 0.03 and l_std > 10:
            pigmentation_detected = True

        if pigmentation_detected:
            concerns.append("hyperpigmentation")

        # --- NEW: SCARRING DETECTION ---
        # Method 1: Texture-based scar detection using Gabor filters
        def apply_gabor_filter(img, theta):
            kernel = cv2.getGaborKernel((21, 21), 3, theta, 10, 0.5, 0, ktype=cv2.CV_32F)
            return cv2.filter2D(img, cv2.CV_8UC3, kernel)

        # Apply Gabor filters at different orientations
        gabor_responses = []
        for angle in [0, 45, 90, 135]:
            gabor_resp = apply_gabor_filter(img_gray, np.radians(angle))
            gabor_responses.append(gabor_resp)
        
        gabor_magnitude = np.sqrt(sum(resp**2 for resp in gabor_responses))
        gabor_variance = np.var(gabor_magnitude)

        # Method 2: Local Binary Pattern for texture irregularities
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
                        if img[x, y] >= center:
                            code |= (1 << k)
                    lbp[i, j] = code
            return lbp

        lbp = local_binary_pattern(img_gray)
        lbp_variance = np.var(lbp)

        # Method 3: Detect linear/elongated structures (typical of scars)
        # Use morphological operations
        kernel_line_h = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 1))
        kernel_line_v = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 15))
        
        lines_h = cv2.morphologyEx(img_gray, cv2.MORPH_OPEN, kernel_line_h)
        lines_v = cv2.morphologyEx(img_gray, cv2.MORPH_OPEN, kernel_line_v)
        
        line_features = cv2.bitwise_or(lines_h, lines_v)
        line_intensity = np.mean(line_features)

        # Method 4: Detect circular/crater-like structures (acne scars)
        circles = cv2.HoughCircles(
            img_gray,
            cv2.HOUGH_GRADIENT,
            dp=1,
            minDist=10,
            param1=50,
            param2=15,
            minRadius=2,
            maxRadius=8
        )
        
        crater_count = 0 if circles is None else len(circles[0])
        crater_density = crater_count / (256 * 256) * 10000  # per 10k pixels

        # Method 5: Detect raised/depressed areas using gradient analysis
        grad_x = cv2.Sobel(img_gray, cv2.CV_64F, 1, 0, ksize=5)
        grad_y = cv2.Sobel(img_gray, cv2.CV_64F, 0, 1, ksize=5)
        gradient_magnitude = np.sqrt(grad_x**2 + grad_y**2)
        
        # Look for areas with consistent directional gradients (scar edges)
        gradient_consistency = np.std(gradient_magnitude)

        # Scarring detection logic
        scarring_detected = False
        scar_confidence = 0

        # Atrophic (depressed) scars
        if crater_density > 3 and laplacian_var > 150:
            scarring_detected = True
            scar_confidence += 1

        # Linear scars
        if line_intensity > 30 and gradient_consistency > 45:
            scarring_detected = True
            scar_confidence += 1

        # Textural irregularities suggesting scars
        if (gabor_variance > 2000 and lbp_variance > 150) or \
           (laplacian_var > 200 and edge_density > 25):
            scarring_detected = True
            scar_confidence += 1

        # Hypertrophic (raised) scars - look for very bright/dark linear features
        brightness_range = np.max(img_gray) - np.min(img_gray)
        if brightness_range > 180 and line_intensity > 25 and gradient_consistency > 50:
            scarring_detected = True
            scar_confidence += 1

        # Only add scarring if we have high confidence
        if scarring_detected and scar_confidence >= 2:
            concerns.append("scarring")

        # Fine lines/aging
        if laplacian_var > 120 and brightness < 100:
            concerns.append("fine lines")

        # Dullness
        if saturation < 35 and brightness < 110:
            concerns.append("dullness")

        # Large pores
        if edge_density > 20:
            concerns.append("enlarged pores")

        # --- Skin tone analysis (using LAB values calculated above) ---
        avg_l = np.mean(l_channel)
        avg_a = np.mean(a_channel)
        avg_b = np.mean(b_channel)

        # Determine depth
        if avg_l < 40:
            depth = "deep"
        elif avg_l < 55:
            depth = "medium-deep"
        elif avg_l < 70:
            depth = "medium"
        elif avg_l < 85:
            depth = "light"
        else:
            depth = "very light"

        # Determine undertone using both a* and b* channels
        # a* channel: negative = green undertones, positive = red undertones
        # b* channel: negative = blue undertones, positive = yellow undertones
        
        if avg_b > 130 and avg_a > 128:
            undertone = "warm"  # Yellow and red = warm
        elif avg_b < 120 and avg_a < 128:
            undertone = "cool"   # Blue and green = cool
        elif avg_b > 130 and avg_a < 128:
            undertone = "neutral-warm"  # Yellow but green = neutral-warm
        elif avg_b < 120 and avg_a > 128:
            undertone = "neutral-cool"  # Blue but red = neutral-cool
        else:
            undertone = "neutral"  # Balanced

        tone = f"{undertone}, {depth} complexion"

        # --- Enhanced texture analysis ---
        texture_score = (laplacian_var + edge_density) / 2

        if texture_score < 30:
            texture = "very smooth"
        elif texture_score < 60:
            texture = "smooth"
        elif texture_score < 100:
            texture = "slightly bumpy"
        elif texture_score < 150:
            texture = "bumpy"
        else:
            texture = "very rough"

        # --- Under-eye analysis ---
        height, width = img_gray.shape

        # Define under-eye regions more precisely
        left_eye_region = img_gray[
            int(height * 0.55) : int(height * 0.75),
            int(width * 0.25) : int(width * 0.45),
        ]
        right_eye_region = img_gray[
            int(height * 0.55) : int(height * 0.75),
            int(width * 0.55) : int(width * 0.75),
        ]

        if left_eye_region.size > 0 and right_eye_region.size > 0:
            under_eye_avg = (np.mean(left_eye_region) + np.mean(right_eye_region)) / 2
            face_avg = np.mean(img_gray)

            darkness_ratio = under_eye_avg / face_avg

            if darkness_ratio < 0.80:
                under_eye = "prominent dark circles"
            elif darkness_ratio < 0.88:
                under_eye = "visible dark circles"
            elif darkness_ratio < 0.94:
                under_eye = "mild dark circles"
            else:
                under_eye = "no visible dark circles"
        else:
            under_eye = "unable to detect"

        # Clean up concerns
        if not concerns:
            concerns = ["none detected"]

        result = {
            "skin_types": skin_types,
            "concerns": concerns,
            "tone": tone,
            "texture": texture,
            "under_eye": under_eye,
        }
        print(result)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to analyze image: {str(e)}"
        )
