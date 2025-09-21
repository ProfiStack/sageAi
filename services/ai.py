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


# async def analyze_skin_features(image_bytes: bytes):
#     # Check if OpenCV is available
#     if cv2 is None:
#         raise HTTPException(
#             status_code=503,
#             detail="Image analysis temporarily unavailable. OpenCV not loaded.",
#         )

#     try:
#         # Load and preprocess image
#         img = Image.open(BytesIO(image_bytes)).convert("RGB")
#         img_np = np.array(img)

#         # Multiple resolution analysis
#         img_256 = cv2.resize(img_np, (256, 256))
#         img_128 = cv2.resize(img_np, (128, 128))

#         # Color space conversions
#         img_hsv = cv2.cvtColor(img_256, cv2.COLOR_RGB2HSV)
#         img_lab = cv2.cvtColor(img_256, cv2.COLOR_RGB2LAB)
#         img_gray = cv2.cvtColor(img_256, cv2.COLOR_RGB2GRAY)

#         # Advanced metrics
#         brightness = np.mean(img_hsv[:, :, 2])
#         saturation = np.mean(img_hsv[:, :, 1])
#         hue = np.mean(img_hsv[:, :, 0])

#         # Color distribution analysis
#         color_std = np.std(img_256, axis=(0, 1))
#         overall_color_variation = np.mean(color_std)

#         # Texture analysis
#         laplacian_var = cv2.Laplacian(img_gray, cv2.CV_64F).var()

#         # Sobel edge detection
#         sobel_x = cv2.Sobel(img_gray, cv2.CV_64F, 1, 0, ksize=3)
#         sobel_y = cv2.Sobel(img_gray, cv2.CV_64F, 0, 1, ksize=3)
#         sobel_magnitude = np.sqrt(sobel_x**2 + sobel_y**2)
#         edge_density = np.mean(sobel_magnitude)

#         # --- IMPROVED Skin Type Detection ---
#         skin_types = []

#         # Oily skin detection - adjusted for darker skin tones
#         if (
#             brightness > 100
#             and overall_color_variation < 45
#             and saturation > 20
#             and edge_density > 12
#         ):
#             skin_types.append("oily")

#         # Dry skin detection - adjusted thresholds
#         if (
#             brightness < 110
#             and overall_color_variation < 35
#             and saturation < 45
#             and laplacian_var < 120
#         ):
#             skin_types.append("dry")

#         # Combination skin detection - improved region analysis
#         t_zone_regions = [
#             img_256[64:128, 112:144],  # Forehead
#             img_256[128:192, 112:144],  # Nose area
#         ]
#         cheek_regions = [
#             img_256[128:192, 64:112],  # Left cheek
#             img_256[128:192, 144:192],  # Right cheek
#         ]

#         if len(t_zone_regions) > 0 and len(cheek_regions) > 0:
#             t_zone_brightness = np.mean(
#                 [
#                     np.mean(cv2.cvtColor(r, cv2.COLOR_RGB2HSV)[:, :, 2])
#                     for r in t_zone_regions
#                     if r.size > 0
#                 ]
#             )
#             cheek_brightness = np.mean(
#                 [
#                     np.mean(cv2.cvtColor(r, cv2.COLOR_RGB2HSV)[:, :, 2])
#                     for r in cheek_regions
#                     if r.size > 0
#                 ]
#             )

#             t_zone_saturation = np.mean(
#                 [
#                     np.mean(cv2.cvtColor(r, cv2.COLOR_RGB2HSV)[:, :, 1])
#                     for r in t_zone_regions
#                     if r.size > 0
#                 ]
#             )
#             cheek_saturation = np.mean(
#                 [
#                     np.mean(cv2.cvtColor(r, cv2.COLOR_RGB2HSV)[:, :, 1])
#                     for r in cheek_regions
#                     if r.size > 0
#                 ]
#             )

#             brightness_diff = abs(t_zone_brightness - cheek_brightness)
#             saturation_diff = abs(t_zone_saturation - cheek_saturation)

#             if brightness_diff > 10 or saturation_diff > 12:
#                 skin_types.append("combination")

#         # Sensitive skin detection
#         if laplacian_var < 100 and overall_color_variation > 25 and edge_density < 18:
#             red_channel = img_256[:, :, 0].astype(np.float32)
#             green_channel = img_256[:, :, 1].astype(np.float32)
#             rg_diff = np.mean(red_channel - green_channel)

#             if rg_diff > 6:
#                 skin_types.append("sensitive")

#         # Normal skin detection - adjusted for wider range of skin tones
#         if (
#             80 <= brightness <= 160
#             and 15 <= overall_color_variation <= 40
#             and 20 <= saturation <= 65
#             and 70 <= laplacian_var <= 150
#             and not skin_types
#         ):
#             skin_types.append("normal")

#         # Default fallback
#         if not skin_types:
#             skin_types.append("normal")

#         # --- IMPROVED Concerns Detection ---
#         concerns = []

#         # Breakouts detection
#         if laplacian_var > 140 and edge_density > 16:
#             concerns.append("breakouts")

#         # --- FIXED Redness Detection for Darker Skin ---
#         red_channel = img_256[:, :, 0].astype(np.float32)
#         green_channel = img_256[:, :, 1].astype(np.float32)
#         blue_channel = img_256[:, :, 2].astype(np.float32)

#         # Calculate redness differently for darker skin tones
#         total_intensity = red_channel + green_channel + blue_channel
#         total_intensity = np.where(total_intensity == 0, 1, total_intensity)
#         red_ratio = red_channel / total_intensity

#         rg_diff = red_channel - green_channel
#         rb_diff = red_channel - blue_channel

#         # For darker skin, redness appears differently in HSV
#         hue_channel = img_hsv[:, :, 0]
#         # Expanded red hue range for darker skin tones
#         red_hue_mask = (hue_channel <= 15) | (hue_channel >= 165)
#         red_saturation = img_hsv[:, :, 1]

#         avg_red_ratio = np.mean(red_ratio)
#         avg_rg_diff = np.mean(rg_diff)
#         avg_rb_diff = np.mean(rb_diff)

#         # Adaptive thresholds based on overall brightness (darker skin needs different detection)
#         brightness_factor = brightness / 128.0  # Normalize brightness

#         red_areas = red_hue_mask & (red_saturation > 40) & (img_hsv[:, :, 2] > 40)
#         red_area_percentage = np.sum(red_areas) / red_areas.size

#         redness_detected = False

#         # Adaptive redness detection based on skin tone
#         if brightness_factor < 0.8:  # Darker skin
#             if (
#                 avg_red_ratio > 0.36
#                 and avg_rg_diff > 8
#                 and avg_rb_diff > 6
#                 and red_area_percentage > 0.08
#             ):
#                 redness_detected = True
#         else:  # Lighter skin
#             if (
#                 avg_red_ratio > 0.38
#                 and avg_rg_diff > 12
#                 and avg_rb_diff > 10
#                 and red_area_percentage > 0.12
#             ):
#                 redness_detected = True

#         if redness_detected:
#             concerns.append("redness")

#         # --- SIGNIFICANTLY IMPROVED Pigmentation Detection ---
#         l_channel = img_lab[:, :, 0].astype(np.float32)
#         a_channel = img_lab[:, :, 1].astype(np.float32)
#         b_channel = img_lab[:, :, 2].astype(np.float32)

#         l_std = np.std(l_channel)
#         l_mean = np.mean(l_channel)

#         # Better dark spot detection with adaptive thresholds
#         kernel = np.ones((5, 5), np.float32) / 25
#         l_smooth = cv2.filter2D(l_channel, -1, kernel)

#         # Adaptive threshold based on skin tone
#         threshold_factor = 4 if l_mean < 100 else 6
#         dark_spots = l_channel < (l_smooth - threshold_factor)
#         dark_spot_percentage = np.sum(dark_spots) / dark_spots.size

#         # Better melanin detection for darker skin
#         # In OpenCV LAB: a* and b* are 0-255, with 128 being neutral
#         melanin_areas = (a_channel > 132) & (b_channel > 132) & (l_channel < l_mean - 2)
#         melanin_percentage = np.sum(melanin_areas) / melanin_areas.size

#         # Age spot detection adjusted for skin tone
#         age_threshold = 5 if l_mean < 100 else 8
#         age_spots = (l_channel < (l_mean - age_threshold)) & (b_channel > 130)
#         age_spot_percentage = np.sum(age_spots) / age_spots.size

#         pigmentation_detected = False
#         pigment_confidence = 0

#         # Adaptive thresholds based on skin tone
#         if l_mean < 100:  # Darker skin
#             if l_std > 8 and dark_spot_percentage > 0.05:
#                 pigment_confidence += 1
#             if melanin_percentage > 0.04:
#                 pigment_confidence += 1
#             if age_spot_percentage > 0.02:
#                 pigment_confidence += 1
#         else:  # Lighter skin
#             if l_std > 12 and dark_spot_percentage > 0.08:
#                 pigment_confidence += 1
#             if melanin_percentage > 0.06:
#                 pigment_confidence += 1
#             if age_spot_percentage > 0.03:
#                 pigment_confidence += 1

#         if pigment_confidence >= 2:
#             pigmentation_detected = True

#         if pigmentation_detected:
#             concerns.append("hyperpigmentation")

#         # --- Scarring Detection (keeping existing logic) ---
#         def apply_gabor_filter(img, theta):
#             kernel = cv2.getGaborKernel(
#                 (21, 21), 3, theta, 10, 0.5, 0, ktype=cv2.CV_32F
#             )
#             return cv2.filter2D(img, cv2.CV_8UC3, kernel)

#         gabor_responses = [
#             apply_gabor_filter(img_gray, np.radians(a)) for a in [0, 45, 90, 135]
#         ]
#         gabor_magnitude = np.sqrt(sum(resp**2 for resp in gabor_responses))
#         gabor_variance = np.var(gabor_magnitude)

#         def local_binary_pattern(img, radius=1, n_points=8):
#             h, w = img.shape
#             lbp = np.zeros((h, w), dtype=np.uint8)
#             for i in range(radius, h - radius):
#                 for j in range(radius, w - radius):
#                     center = img[i, j]
#                     code = 0
#                     for k in range(n_points):
#                         angle = 2 * np.pi * k / n_points
#                         x = int(np.round(i + radius * np.cos(angle)))
#                         y = int(np.round(j + radius * np.sin(angle)))
#                         if 0 <= x < h and 0 <= y < w:
#                             if img[x, y] >= center:
#                                 code |= 1 << k
#                     lbp[i, j] = code
#             return lbp

#         lbp = local_binary_pattern(img_gray)
#         lbp_variance = np.var(lbp)

#         kernel_line_h = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 1))
#         kernel_line_v = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 15))
#         lines_h = cv2.morphologyEx(img_gray, cv2.MORPH_OPEN, kernel_line_h)
#         lines_v = cv2.morphologyEx(img_gray, cv2.MORPH_OPEN, kernel_line_v)
#         line_features = cv2.bitwise_or(lines_h, lines_v)
#         line_intensity = np.mean(line_features)

#         circles = cv2.HoughCircles(
#             img_gray,
#             cv2.HOUGH_GRADIENT,
#             dp=1,
#             minDist=8,
#             param1=50,
#             param2=12,
#             minRadius=1,
#             maxRadius=6,
#         )
#         crater_count = 0 if circles is None else len(circles[0])
#         crater_density = crater_count / (256 * 256) * 10000

#         grad_x = cv2.Sobel(img_gray, cv2.CV_64F, 1, 0, ksize=5)
#         grad_y = cv2.Sobel(img_gray, cv2.CV_64F, 0, 1, ksize=5)
#         gradient_magnitude = np.sqrt(grad_x**2 + grad_y**2)
#         gradient_consistency = np.std(gradient_magnitude)

#         scarring_detected = False
#         scar_confidence = 0

#         if crater_density > 3 and laplacian_var > 160:
#             scar_confidence += 1
#         if line_intensity > 35 and gradient_consistency > 50:
#             scar_confidence += 1
#         if gabor_variance > 2000 and lbp_variance > 180:
#             scar_confidence += 1
#         if (np.max(img_gray) - np.min(img_gray)) > 180 and line_intensity > 30:
#             scar_confidence += 1

#         if scar_confidence >= 2:
#             scarring_detected = True

#         if scarring_detected:
#             concerns.append("scarring")

#         # Other concerns (adjusted thresholds)
#         if laplacian_var > 90 and brightness < 120 and edge_density > 8:
#             concerns.append("fine lines")

#         if saturation < 35 and brightness < 130 and overall_color_variation < 30:
#             concerns.append("dullness")

#         if edge_density > 22 and crater_density > 2:
#             concerns.append("enlarged pores")

#         # --- SIGNIFICANTLY IMPROVED Skin Tone Analysis ---
#         avg_l = np.mean(l_channel)
#         avg_a = np.mean(a_channel)
#         avg_b = np.mean(b_channel)

#         # FIXED: Better depth categorization for wider range of skin tones
#         # OpenCV LAB L* channel is 0-255, not 0-100
#         if avg_l < 80:
#             depth = "very deep"
#         elif avg_l < 110:
#             depth = "deep"
#         elif avg_l < 140:
#             depth = "medium-deep"
#         elif avg_l < 170:
#             depth = "medium"
#         elif avg_l < 200:
#             depth = "light"
#         else:
#             depth = "very light"

#         # FIXED: Much better undertone detection
#         # OpenCV LAB: a* and b* are 0-255, with 128 being neutral
#         # a* < 128 = green, a* > 128 = red/magenta
#         # b* < 128 = blue, b* > 128 = yellow

#         a_deviation = avg_a - 128  # Positive = red/warm, Negative = green/cool
#         b_deviation = avg_b - 128  # Positive = yellow/warm, Negative = blue/cool

#         # Calculate undertone based on a* and b* deviations
#         warm_score = 0
#         cool_score = 0

#         # Yellow undertones (high b*, moderate a*)
#         if b_deviation > 8:  # Strong yellow
#             warm_score += 2
#             if b_deviation > 15:
#                 warm_score += 1
#         elif b_deviation < -5:  # Blue undertones
#             cool_score += 2

#         # Red/Pink undertones (high a*)
#         if a_deviation > 6:  # Red/pink
#             if b_deviation > 0:  # Red + yellow = warm
#                 warm_score += 1
#             else:  # Red + blue = cool pink
#                 cool_score += 1
#         elif a_deviation < -4:  # Green undertones
#             cool_score += 1

#         # Additional analysis using RGB ratios for warm tones
#         avg_r = np.mean(img_256[:, :, 0])
#         avg_g = np.mean(img_256[:, :, 1])
#         avg_b_rgb = np.mean(img_256[:, :, 2])

#         # Calculate color temperature indicators
#         rg_ratio = avg_r / avg_g if avg_g > 0 else 1
#         yb_ratio = (avg_r + avg_g) / (2 * avg_b_rgb) if avg_b_rgb > 0 else 1

#         # Warm skin typically has higher red/yellow content
#         if rg_ratio > 1.05 and yb_ratio > 1.1:
#             warm_score += 1
#         elif rg_ratio < 0.95 and yb_ratio < 0.9:
#             cool_score += 1

#         # Determine final undertone
#         if warm_score > cool_score + 1:
#             if b_deviation > 12:
#                 undertone = "warm (golden/yellow)"
#             elif a_deviation > 8:
#                 undertone = "warm (peachy/coral)"
#             else:
#                 undertone = "warm"
#         elif cool_score > warm_score + 1:
#             if a_deviation > 3:
#                 undertone = "cool (pink)"
#             elif b_deviation < -3:
#                 undertone = "cool (blue)"
#             else:
#                 undertone = "cool"
#         elif abs(warm_score - cool_score) <= 1:
#             if b_deviation > 5:
#                 undertone = "neutral-warm"
#             elif b_deviation < -2:
#                 undertone = "neutral-cool"
#             else:
#                 undertone = "neutral"
#         else:
#             undertone = "neutral"

#         tone = f"{undertone}, {depth} complexion"

#         # Texture scoring (keeping existing logic)
#         texture_score = laplacian_var * 0.6 + edge_density * 0.4
#         if texture_score < 25:
#             texture = "very smooth"
#         elif texture_score < 50:
#             texture = "smooth"
#         elif texture_score < 80:
#             texture = "slightly textured"
#         elif texture_score < 120:
#             texture = "textured"
#         else:
#             texture = "very textured"

#         # --- IMPROVED Under-eye Analysis for Darker Skin ---
#         height, width = img_gray.shape
#         left_eye_region = img_gray[
#             int(height * 0.58) : int(height * 0.72),
#             int(width * 0.28) : int(width * 0.42),
#         ]
#         right_eye_region = img_gray[
#             int(height * 0.58) : int(height * 0.72),
#             int(width * 0.58) : int(width * 0.72),
#         ]

#         if left_eye_region.size > 0 and right_eye_region.size > 0:
#             under_eye_avg = (np.mean(left_eye_region) + np.mean(right_eye_region)) / 2

#             nearby_regions = [
#                 img_gray[
#                     int(height * 0.45) : int(height * 0.58),
#                     int(width * 0.28) : int(width * 0.72),
#                 ],
#                 img_gray[
#                     int(height * 0.72) : int(height * 0.85),
#                     int(width * 0.28) : int(width * 0.72),
#                 ],
#             ]
#             nearby_avg = np.mean(
#                 [np.mean(region) for region in nearby_regions if region.size > 0]
#             )

#             darkness_ratio = under_eye_avg / nearby_avg if nearby_avg > 0 else 1.0

#             # Adjusted thresholds for darker skin tones
#             if avg_l < 100:  # Darker skin - different thresholds
#                 if darkness_ratio < 0.88:
#                     under_eye = "prominent dark circles"
#                 elif darkness_ratio < 0.94:
#                     under_eye = "visible dark circles"
#                 elif darkness_ratio < 0.97:
#                     under_eye = "mild dark circles"
#                 else:
#                     under_eye = "no visible dark circles"
#             else:  # Lighter skin - original thresholds
#                 if darkness_ratio < 0.85:
#                     under_eye = "prominent dark circles"
#                 elif darkness_ratio < 0.92:
#                     under_eye = "visible dark circles"
#                 elif darkness_ratio < 0.96:
#                     under_eye = "mild dark circles"
#                 else:
#                     under_eye = "no visible dark circles"
#         else:
#             under_eye = "unable to detect"

#         # Default to no concerns if none detected
#         if not concerns:
#             concerns = ["none detected"]

#         result = {
#             "skin_types": skin_types,
#             "concerns": concerns,
#             "tone": tone,
#             "undertone": undertone,
#             "texture": texture,
#             "under_eye": under_eye,
#         }
#         return result

#     except Exception as e:
#         raise HTTPException(
#             status_code=500, detail=f"Failed to analyze image: {str(e)}"
#         )


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

        # Texture analysis
        laplacian_var = cv2.Laplacian(img_gray, cv2.CV_64F).var()

        # Sobel edge detection
        sobel_x = cv2.Sobel(img_gray, cv2.CV_64F, 1, 0, ksize=3)
        sobel_y = cv2.Sobel(img_gray, cv2.CV_64F, 0, 1, ksize=3)
        sobel_magnitude = np.sqrt(sobel_x**2 + sobel_y**2)
        edge_density = np.mean(sobel_magnitude)

        # --- IMPROVED Skin Type Detection ---
        skin_types = []

        # Oily skin detection - adjusted for darker skin tones
        if (
            brightness > 100
            and overall_color_variation < 45
            and saturation > 20
            and edge_density > 12
        ):
            skin_types.append("oily")

        # Dry skin detection - adjusted thresholds
        if (
            brightness < 110
            and overall_color_variation < 35
            and saturation < 45
            and laplacian_var < 120
        ):
            skin_types.append("dry")

        # Combination skin detection - improved region analysis
        t_zone_regions = [
            img_256[64:128, 112:144],  # Forehead
            img_256[128:192, 112:144],  # Nose area
        ]
        cheek_regions = [
            img_256[128:192, 64:112],  # Left cheek
            img_256[128:192, 144:192],  # Right cheek
        ]

        if len(t_zone_regions) > 0 and len(cheek_regions) > 0:
            t_zone_brightness = np.mean(
                [
                    np.mean(cv2.cvtColor(r, cv2.COLOR_RGB2HSV)[:, :, 2])
                    for r in t_zone_regions
                    if r.size > 0
                ]
            )
            cheek_brightness = np.mean(
                [
                    np.mean(cv2.cvtColor(r, cv2.COLOR_RGB2HSV)[:, :, 2])
                    for r in cheek_regions
                    if r.size > 0
                ]
            )

            t_zone_saturation = np.mean(
                [
                    np.mean(cv2.cvtColor(r, cv2.COLOR_RGB2HSV)[:, :, 1])
                    for r in t_zone_regions
                    if r.size > 0
                ]
            )
            cheek_saturation = np.mean(
                [
                    np.mean(cv2.cvtColor(r, cv2.COLOR_RGB2HSV)[:, :, 1])
                    for r in cheek_regions
                    if r.size > 0
                ]
            )

            brightness_diff = abs(t_zone_brightness - cheek_brightness)
            saturation_diff = abs(t_zone_saturation - cheek_saturation)

            if brightness_diff > 10 or saturation_diff > 12:
                skin_types.append("combination")

        # Sensitive skin detection
        if laplacian_var < 100 and overall_color_variation > 25 and edge_density < 18:
            red_channel = img_256[:, :, 0].astype(np.float32)
            green_channel = img_256[:, :, 1].astype(np.float32)
            rg_diff = np.mean(red_channel - green_channel)

            if rg_diff > 6:
                skin_types.append("sensitive")

        # FIXED: Normal skin detection - expanded ranges and better logic
        if not skin_types:  # Only check if no other type detected
            if (
                70 <= brightness <= 180  # Wider brightness range
                and 10 <= overall_color_variation <= 50  # Wider variation range
                and 15 <= saturation <= 80  # Wider saturation range
                and 40 <= laplacian_var <= 200  # Wider texture range
            ):
                skin_types.append("normal")

        # Default fallback
        if not skin_types:
            skin_types.append("normal")

        # --- FIXED Redness Detection ---
        concerns = []

        # Get LAB values for better analysis
        l_channel = img_lab[:, :, 0].astype(np.float32)
        a_channel = img_lab[:, :, 1].astype(np.float32)
        b_channel = img_lab[:, :, 2].astype(np.float32)

        avg_l = np.mean(l_channel)
        avg_a = np.mean(a_channel)
        avg_b = np.mean(b_channel)

        # Multiple validation approach for redness
        redness_detected = False
        redness_confidence = 0

        # Method 1: LAB color space analysis (most reliable)
        # In LAB: a* > 128 indicates red/magenta tones
        a_deviation = avg_a - 128
        if a_deviation > 8:  # Significant red component
            redness_confidence += 1

        # Method 2: RGB ratio analysis with stricter thresholds
        red_channel = img_256[:, :, 0].astype(np.float32)
        green_channel = img_256[:, :, 1].astype(np.float32)
        blue_channel = img_256[:, :, 2].astype(np.float32)

        avg_r = np.mean(red_channel)
        avg_g = np.mean(green_channel)
        avg_b_rgb = np.mean(blue_channel)

        # Calculate normalized red dominance
        total_rgb = avg_r + avg_g + avg_b_rgb
        if total_rgb > 0:
            red_ratio = avg_r / total_rgb
            # Only flag if red is significantly dominant AND above threshold
            if red_ratio > 0.40 and avg_r > avg_g + 15 and avg_r > avg_b_rgb + 10:
                redness_confidence += 1

        # Method 3: HSV hue analysis - more restrictive
        hue_channel = img_hsv[:, :, 0]
        saturation_channel = img_hsv[:, :, 1]
        value_channel = img_hsv[:, :, 2]

        # Red hues in HSV (0-15 and 165-180 for OpenCV)
        red_hue_mask = (
            ((hue_channel <= 10) | (hue_channel >= 170))
            & (saturation_channel > 50)
            & (value_channel > 60)
        )
        red_pixel_percentage = np.sum(red_hue_mask) / red_hue_mask.size

        # Only flag if significant red area AND high saturation
        if (
            red_pixel_percentage > 0.15
            and np.mean(saturation_channel[red_hue_mask]) > 80
        ):
            redness_confidence += 1

        # Method 4: Skin tone adaptive analysis
        brightness_factor = brightness / 128.0

        # For darker skin (brightness_factor < 0.8), redness appears differently
        if brightness_factor < 0.8:
            # Darker skin: look for subtle red undertones
            if avg_a > 132 and (avg_r - avg_g) > 5 and red_pixel_percentage > 0.10:
                redness_confidence += 1
        else:
            # Lighter skin: standard redness detection
            if avg_a > 135 and (avg_r - avg_g) > 10 and red_pixel_percentage > 0.12:
                redness_confidence += 1

        # Only flag redness if multiple methods agree (confidence >= 3)
        if redness_confidence >= 3:
            redness_detected = True

        if redness_detected:
            concerns.append("redness")

        # Breakouts detection
        if laplacian_var > 140 and edge_density > 16:
            concerns.append("breakouts")

        # --- SIGNIFICANTLY IMPROVED Pigmentation Detection ---
        l_std = np.std(l_channel)
        l_mean = np.mean(l_channel)

        # Better dark spot detection with adaptive thresholds
        kernel = np.ones((5, 5), np.float32) / 25
        l_smooth = cv2.filter2D(l_channel, -1, kernel)

        # Adaptive threshold based on skin tone
        threshold_factor = 4 if l_mean < 100 else 6
        dark_spots = l_channel < (l_smooth - threshold_factor)
        dark_spot_percentage = np.sum(dark_spots) / dark_spots.size

        # Better melanin detection for darker skin
        # In OpenCV LAB: a* and b* are 0-255, with 128 being neutral
        melanin_areas = (a_channel > 132) & (b_channel > 132) & (l_channel < l_mean - 2)
        melanin_percentage = np.sum(melanin_areas) / melanin_areas.size

        # Age spot detection adjusted for skin tone
        age_threshold = 5 if l_mean < 100 else 8
        age_spots = (l_channel < (l_mean - age_threshold)) & (b_channel > 130)
        age_spot_percentage = np.sum(age_spots) / age_spots.size

        pigmentation_detected = False
        pigment_confidence = 0

        # Adaptive thresholds based on skin tone
        if l_mean < 100:  # Darker skin
            if l_std > 8 and dark_spot_percentage > 0.05:
                pigment_confidence += 1
            if melanin_percentage > 0.04:
                pigment_confidence += 1
            if age_spot_percentage > 0.02:
                pigment_confidence += 1
        else:  # Lighter skin
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

        # --- Scarring Detection (keeping existing logic) ---
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
                        if 0 <= x < h and 0 <= y < w:
                            if img[x, y] >= center:
                                code |= 1 << k
                    lbp[i, j] = code
            return lbp

        lbp = local_binary_pattern(img_gray)
        lbp_variance = np.var(lbp)

        kernel_line_h = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 1))
        kernel_line_v = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 15))
        lines_h = cv2.morphologyEx(img_gray, cv2.MORPH_OPEN, kernel_line_h)
        lines_v = cv2.morphologyEx(img_gray, cv2.MORPH_OPEN, kernel_line_v)
        line_features = cv2.bitwise_or(lines_h, lines_v)
        line_intensity = np.mean(line_features)

        circles = cv2.HoughCircles(
            img_gray,
            cv2.HOUGH_GRADIENT,
            dp=1,
            minDist=8,
            param1=50,
            param2=12,
            minRadius=1,
            maxRadius=6,
        )
        crater_count = 0 if circles is None else len(circles[0])
        crater_density = crater_count / (256 * 256) * 10000

        grad_x = cv2.Sobel(img_gray, cv2.CV_64F, 1, 0, ksize=5)
        grad_y = cv2.Sobel(img_gray, cv2.CV_64F, 0, 1, ksize=5)
        gradient_magnitude = np.sqrt(grad_x**2 + grad_y**2)
        gradient_consistency = np.std(gradient_magnitude)

        scarring_detected = False
        scar_confidence = 0

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

        # Other concerns (adjusted thresholds)
        if laplacian_var > 90 and brightness < 120 and edge_density > 8:
            concerns.append("fine lines")

        if saturation < 35 and brightness < 130 and overall_color_variation < 30:
            concerns.append("dullness")

        if edge_density > 22 and crater_density > 2:
            concerns.append("enlarged pores")

        # --- SIGNIFICANTLY IMPROVED Skin Tone Analysis ---
        # FIXED: Better depth categorization for wider range of skin tones
        # OpenCV LAB L* channel is 0-255, not 0-100
        if avg_l < 80:
            depth = "very deep"
        elif avg_l < 110:
            depth = "deep"
        elif avg_l < 140:
            depth = "medium-deep"
        elif avg_l < 170:
            depth = "medium"
        elif avg_l < 200:
            depth = "light"
        else:
            depth = "very light"

        # FIXED: Much better undertone detection
        # OpenCV LAB: a* and b* are 0-255, with 128 being neutral
        # a* < 128 = green, a* > 128 = red/magenta
        # b* < 128 = blue, b* > 128 = yellow

        a_deviation = avg_a - 128  # Positive = red/warm, Negative = green/cool
        b_deviation = avg_b - 128  # Positive = yellow/warm, Negative = blue/cool

        # Calculate undertone based on a* and b* deviations
        warm_score = 0
        cool_score = 0

        # Yellow undertones (high b*, moderate a*)
        if b_deviation > 8:  # Strong yellow
            warm_score += 2
            if b_deviation > 15:
                warm_score += 1
        elif b_deviation < -5:  # Blue undertones
            cool_score += 2

        # Red/Pink undertones (high a*)
        if a_deviation > 6:  # Red/pink
            if b_deviation > 0:  # Red + yellow = warm
                warm_score += 1
            else:  # Red + blue = cool pink
                cool_score += 1
        elif a_deviation < -4:  # Green undertones
            cool_score += 1

        # Additional analysis using RGB ratios for warm tones
        # Calculate color temperature indicators
        rg_ratio = avg_r / avg_g if avg_g > 0 else 1
        yb_ratio = (avg_r + avg_g) / (2 * avg_b_rgb) if avg_b_rgb > 0 else 1

        # Warm skin typically has higher red/yellow content
        if rg_ratio > 1.05 and yb_ratio > 1.1:
            warm_score += 1
        elif rg_ratio < 0.95 and yb_ratio < 0.9:
            cool_score += 1

        # Determine final undertone
        if warm_score > cool_score + 1:
            if b_deviation > 12:
                undertone = "warm (golden/yellow)"
            elif a_deviation > 8:
                undertone = "warm (peachy/coral)"
            else:
                undertone = "warm"
        elif cool_score > warm_score + 1:
            if a_deviation > 3:
                undertone = "cool (pink)"
            elif b_deviation < -3:
                undertone = "cool (blue)"
            else:
                undertone = "cool"
        elif abs(warm_score - cool_score) <= 1:
            if b_deviation > 5:
                undertone = "neutral-warm"
            elif b_deviation < -2:
                undertone = "neutral-cool"
            else:
                undertone = "neutral"
        else:
            undertone = "neutral"

        tone = f"{undertone}, {depth} complexion"

        # FIXED: Texture scoring - better ranges for smooth skin detection
        texture_score = laplacian_var * 0.6 + edge_density * 0.4
        if texture_score < 35:  # Increased threshold for very smooth
            texture = "very smooth"
        elif texture_score < 60:  # Increased threshold for smooth
            texture = "smooth"
        elif texture_score < 90:
            texture = "slightly textured"
        elif texture_score < 130:
            texture = "textured"
        else:
            texture = "very textured"

        # --- NEW: Lip Color Detection ---
        def detect_lip_color():
            height, width = img_256.shape[:2]

            # Define lip region (lower center part of face)
            lip_region = img_256[
                int(height * 0.65) : int(height * 0.85),  # Bottom part of face
                int(width * 0.35) : int(width * 0.65),  # Center horizontally
            ]

            if lip_region.size == 0:
                return "unable to detect"

            # Convert lip region to different color spaces
            lip_hsv = cv2.cvtColor(lip_region, cv2.COLOR_RGB2HSV)
            lip_lab = cv2.cvtColor(lip_region, cv2.COLOR_RGB2LAB)

            # Get average values
            avg_r_lip = np.mean(lip_region[:, :, 0])
            avg_g_lip = np.mean(lip_region[:, :, 1])
            avg_b_lip = np.mean(lip_region[:, :, 2])

            avg_h_lip = np.mean(lip_hsv[:, :, 0])
            avg_s_lip = np.mean(lip_hsv[:, :, 1])
            avg_v_lip = np.mean(lip_hsv[:, :, 2])

            avg_l_lip = np.mean(lip_lab[:, :, 0])
            avg_a_lip = np.mean(lip_lab[:, :, 1])
            avg_b_lip = np.mean(lip_lab[:, :, 2])

            # Compare lip color to surrounding skin
            surrounding_region = img_256[
                int(height * 0.55) : int(height * 0.65),  # Just above lips
                int(width * 0.35) : int(width * 0.65),
            ]

            if surrounding_region.size > 0:
                surr_r = np.mean(surrounding_region[:, :, 0])
                surr_g = np.mean(surrounding_region[:, :, 1])
                surr_b = np.mean(surrounding_region[:, :, 2])

                # Calculate color differences
                r_diff = avg_r_lip - surr_r
                g_diff = avg_g_lip - surr_g
                b_diff = avg_b_lip - surr_b

                # Determine lip color characteristics
                # High red content and higher than skin
                if (
                    avg_r_lip > avg_g_lip + 10
                    and avg_r_lip > avg_b_lip + 5
                    and r_diff > 8
                ):
                    if avg_s_lip > 80:  # High saturation
                        if (
                            avg_h_lip <= 15 or avg_h_lip >= 330 / 2
                        ):  # Red hue range in OpenCV
                            return "red/pink"
                        elif 15 < avg_h_lip <= 25:  # Orange-red
                            return "coral/orange-red"
                    else:
                        return "pink"

                # Brown/nude tones
                elif (
                    abs(avg_r_lip - avg_g_lip) < 15 and abs(avg_g_lip - avg_b_lip) < 15
                ):
                    if avg_l_lip < avg_l:  # Darker than skin
                        return "brown/nude"
                    else:
                        return "natural/nude"

                # Purple tones (high blue, moderate red)
                elif (
                    avg_b_lip > avg_g_lip and (avg_r_lip + avg_b_lip) > 1.3 * avg_g_lip
                ):
                    return "purple/mauve"

                # Peach tones
                elif (
                    avg_r_lip > avg_b_lip
                    and avg_g_lip > avg_b_lip
                    and 20 < avg_h_lip < 40
                ):
                    return "peach/coral"

                # Check if lips are significantly different from skin
                elif abs(r_diff) > 5 or abs(g_diff) > 5 or abs(b_diff) > 5:
                    return "natural with color"
                else:
                    return "natural"

            return "natural"

        lip_color = detect_lip_color()

        # --- IMPROVED Under-eye Analysis for Darker Skin ---
        height, width = img_gray.shape
        left_eye_region = img_gray[
            int(height * 0.58) : int(height * 0.72),
            int(width * 0.28) : int(width * 0.42),
        ]
        right_eye_region = img_gray[
            int(height * 0.58) : int(height * 0.72),
            int(width * 0.58) : int(width * 0.72),
        ]

        if left_eye_region.size > 0 and right_eye_region.size > 0:
            under_eye_avg = (np.mean(left_eye_region) + np.mean(right_eye_region)) / 2

            nearby_regions = [
                img_gray[
                    int(height * 0.45) : int(height * 0.58),
                    int(width * 0.28) : int(width * 0.72),
                ],
                img_gray[
                    int(height * 0.72) : int(height * 0.85),
                    int(width * 0.28) : int(width * 0.72),
                ],
            ]
            nearby_avg = np.mean(
                [np.mean(region) for region in nearby_regions if region.size > 0]
            )

            darkness_ratio = under_eye_avg / nearby_avg if nearby_avg > 0 else 1.0

            # Adjusted thresholds for darker skin tones
            if avg_l < 100:  # Darker skin - different thresholds
                if darkness_ratio < 0.88:
                    under_eye = "prominent dark circles"
                elif darkness_ratio < 0.94:
                    under_eye = "visible dark circles"
                elif darkness_ratio < 0.97:
                    under_eye = "mild dark circles"
                else:
                    under_eye = "no visible dark circles"
            else:  # Lighter skin - original thresholds
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

        result = {
            "skin_types": skin_types,
            "concerns": concerns,
            "tone": tone,
            "undertone": undertone,
            "texture": texture,
            "under_eye": under_eye,
            "lip_color": lip_color,  # NEW: Added lip color detection
        }
        return result

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to analyze image: {str(e)}"
        )
