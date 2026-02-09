from fastapi import HTTPException, WebSocket

import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from pydantic import BaseModel
from db import SessionLocal
import asyncio
from prompts.alternative import get_alternate
from prompts.hair_care import get_hair_care_checker_prompt
from prompts.makeup import get_makeup_checker_prompt
from prompts.nutrition import get_nutrition_checker_prompt
from prompts.styling import get_styling_checker_prompt
from prompts.perplexity import get_perplexity_prompt
from prompts.wellness import get_wellness_checker_prompt
from services.db_service import (
    save_chat_message,
    get_user_session_data,
    update_user_profile,
)
from io import BytesIO  # Added
from concurrent.futures import ThreadPoolExecutor
from prompts.ingredients import get_ingredient_checker_prompt
from prompts.skin_care import get_skincare_prompt
from prompts.trend_analysis import get_trend_analysis_prompt
from prompts.treatment import get_treatment_plan_prompt
import numpy as np
import mediapipe as mp
from dataclasses import dataclass, asdict
from PIL import Image
from io import BytesIO
# from sklearn.cluster import KMeans
from typing import Dict, List, Tuple, Optional, Union
import json
import warnings
from mediapipe.tasks.python import vision
from mediapipe.tasks.python.core import base_options
from mediapipe.tasks.python.vision import RunningMode
from mediapipe import Image as MPImage, ImageFormat

warnings.filterwarnings('ignore')


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
        elif feature_type == "perplexity":
            return get_perplexity_prompt(user_metrics)
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

#         # FIXED: Normal skin detection - expanded ranges and better logic
#         if not skin_types:  # Only check if no other type detected
#             if (
#                 70 <= brightness <= 180  # Wider brightness range
#                 and 10 <= overall_color_variation <= 50  # Wider variation range
#                 and 15 <= saturation <= 80  # Wider saturation range
#                 and 40 <= laplacian_var <= 200  # Wider texture range
#             ):
#                 skin_types.append("normal")

#         # Default fallback
#         if not skin_types:
#             skin_types.append("normal")

#         # --- FIXED Redness Detection ---
#         concerns = []

#         # Get LAB values for better analysis
#         l_channel = img_lab[:, :, 0].astype(np.float32)
#         a_channel = img_lab[:, :, 1].astype(np.float32)
#         b_channel = img_lab[:, :, 2].astype(np.float32)

#         avg_l = np.mean(l_channel)
#         avg_a = np.mean(a_channel)
#         avg_b = np.mean(b_channel)

#         # Multiple validation approach for redness
#         redness_detected = False
#         redness_confidence = 0

#         # Method 1: LAB color space analysis (most reliable)
#         # In LAB: a* > 128 indicates red/magenta tones
#         a_deviation = avg_a - 128
#         if a_deviation > 8:  # Significant red component
#             redness_confidence += 1

#         # Method 2: RGB ratio analysis with stricter thresholds
#         red_channel = img_256[:, :, 0].astype(np.float32)
#         green_channel = img_256[:, :, 1].astype(np.float32)
#         blue_channel = img_256[:, :, 2].astype(np.float32)

#         avg_r = np.mean(red_channel)
#         avg_g = np.mean(green_channel)
#         avg_b_rgb = np.mean(blue_channel)

#         # Calculate normalized red dominance
#         total_rgb = avg_r + avg_g + avg_b_rgb
#         if total_rgb > 0:
#             red_ratio = avg_r / total_rgb
#             # Only flag if red is significantly dominant AND above threshold
#             if red_ratio > 0.40 and avg_r > avg_g + 15 and avg_r > avg_b_rgb + 10:
#                 redness_confidence += 1

#         # Method 3: HSV hue analysis - more restrictive
#         hue_channel = img_hsv[:, :, 0]
#         saturation_channel = img_hsv[:, :, 1]
#         value_channel = img_hsv[:, :, 2]

#         # Red hues in HSV (0-15 and 165-180 for OpenCV)
#         red_hue_mask = (
#             ((hue_channel <= 10) | (hue_channel >= 170))
#             & (saturation_channel > 50)
#             & (value_channel > 60)
#         )
#         red_pixel_percentage = np.sum(red_hue_mask) / red_hue_mask.size

#         # Only flag if significant red area AND high saturation
#         if (
#             red_pixel_percentage > 0.15
#             and np.mean(saturation_channel[red_hue_mask]) > 80
#         ):
#             redness_confidence += 1

#         # Method 4: Skin tone adaptive analysis
#         brightness_factor = brightness / 128.0

#         # For darker skin (brightness_factor < 0.8), redness appears differently
#         if brightness_factor < 0.8:
#             # Darker skin: look for subtle red undertones
#             if avg_a > 132 and (avg_r - avg_g) > 5 and red_pixel_percentage > 0.10:
#                 redness_confidence += 1
#         else:
#             # Lighter skin: standard redness detection
#             if avg_a > 135 and (avg_r - avg_g) > 10 and red_pixel_percentage > 0.12:
#                 redness_confidence += 1

#         # Only flag redness if multiple methods agree (confidence >= 3)
#         if redness_confidence >= 3:
#             redness_detected = True

#         if redness_detected:
#             concerns.append("redness")

#         # Breakouts detection
#         if laplacian_var > 140 and edge_density > 16:
#             concerns.append("breakouts")

#         # --- SIGNIFICANTLY IMPROVED Pigmentation Detection ---
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

#         # FIXED: Texture scoring - better ranges for smooth skin detection
#         texture_score = laplacian_var * 0.6 + edge_density * 0.4
#         if texture_score < 35:  # Increased threshold for very smooth
#             texture = "very smooth"
#         elif texture_score < 60:  # Increased threshold for smooth
#             texture = "smooth"
#         elif texture_score < 90:
#             texture = "slightly textured"
#         elif texture_score < 130:
#             texture = "textured"
#         else:
#             texture = "very textured"

#         # --- NEW: Lip Color Detection ---
#         def detect_lip_color():
#             height, width = img_256.shape[:2]

#             # Define lip region (lower center part of face)
#             lip_region = img_256[
#                 int(height * 0.65) : int(height * 0.85),  # Bottom part of face
#                 int(width * 0.35) : int(width * 0.65),  # Center horizontally
#             ]

#             if lip_region.size == 0:
#                 return "unable to detect"

#             # Convert lip region to different color spaces
#             lip_hsv = cv2.cvtColor(lip_region, cv2.COLOR_RGB2HSV)
#             lip_lab = cv2.cvtColor(lip_region, cv2.COLOR_RGB2LAB)

#             # Get average values
#             avg_r_lip = np.mean(lip_region[:, :, 0])
#             avg_g_lip = np.mean(lip_region[:, :, 1])
#             avg_b_lip = np.mean(lip_region[:, :, 2])

#             avg_h_lip = np.mean(lip_hsv[:, :, 0])
#             avg_s_lip = np.mean(lip_hsv[:, :, 1])
#             avg_v_lip = np.mean(lip_hsv[:, :, 2])

#             avg_l_lip = np.mean(lip_lab[:, :, 0])
#             avg_a_lip = np.mean(lip_lab[:, :, 1])
#             avg_b_lip = np.mean(lip_lab[:, :, 2])

#             # Compare lip color to surrounding skin
#             surrounding_region = img_256[
#                 int(height * 0.55) : int(height * 0.65),  # Just above lips
#                 int(width * 0.35) : int(width * 0.65),
#             ]

#             if surrounding_region.size > 0:
#                 surr_r = np.mean(surrounding_region[:, :, 0])
#                 surr_g = np.mean(surrounding_region[:, :, 1])
#                 surr_b = np.mean(surrounding_region[:, :, 2])

#                 # Calculate color differences
#                 r_diff = avg_r_lip - surr_r
#                 g_diff = avg_g_lip - surr_g
#                 b_diff = avg_b_lip - surr_b

#                 # Determine lip color characteristics
#                 # High red content and higher than skin
#                 if (
#                     avg_r_lip > avg_g_lip + 10
#                     and avg_r_lip > avg_b_lip + 5
#                     and r_diff > 8
#                 ):
#                     if avg_s_lip > 80:  # High saturation
#                         if (
#                             avg_h_lip <= 15 or avg_h_lip >= 330 / 2
#                         ):  # Red hue range in OpenCV
#                             return "red/pink"
#                         elif 15 < avg_h_lip <= 25:  # Orange-red
#                             return "coral/orange-red"
#                     else:
#                         return "pink"

#                 # Brown/nude tones
#                 elif (
#                     abs(avg_r_lip - avg_g_lip) < 15 and abs(avg_g_lip - avg_b_lip) < 15
#                 ):
#                     if avg_l_lip < avg_l:  # Darker than skin
#                         return "brown/nude"
#                     else:
#                         return "natural/nude"

#                 # Purple tones (high blue, moderate red)
#                 elif (
#                     avg_b_lip > avg_g_lip and (avg_r_lip + avg_b_lip) > 1.3 * avg_g_lip
#                 ):
#                     return "purple/mauve"

#                 # Peach tones
#                 elif (
#                     avg_r_lip > avg_b_lip
#                     and avg_g_lip > avg_b_lip
#                     and 20 < avg_h_lip < 40
#                 ):
#                     return "peach/coral"

#                 # Check if lips are significantly different from skin
#                 elif abs(r_diff) > 5 or abs(g_diff) > 5 or abs(b_diff) > 5:
#                     return "natural with color"
#                 else:
#                     return "natural"

#             return "natural"

#         lip_color = detect_lip_color()

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
#             "lip_color": lip_color,  # NEW: Added lip color detection
#         }
#         return result

#     except Exception as e:
#         raise HTTPException(
#             status_code=500, detail=f"Failed to analyze image: {str(e)}"
#         )


# async def analyze_skin_features(image_bytes: bytes):
#     """
#     Analyze skin features from image bytes with improved accuracy and robustness.

#     Args:
#         image_bytes: Raw image bytes

#     Returns:
#         Dictionary with skin_types, concerns, tone, undertone, texture,
#         under_eye, and lip_color - all with confidence scores
#     """
#     if cv2 is None:
#         raise HTTPException(
#             status_code=503,
#             detail="Image analysis temporarily unavailable. OpenCV not loaded.",
#         )

#     try:
#         ==================== STEP 1: LOAD & VALIDATE IMAGE ====================
#         img = Image.open(BytesIO(image_bytes)).convert("RGB")
#         img_np = np.array(img)

#         diagnostics = {
#             "warnings": [],
#             "preprocessing_applied": [],
#             "original_size": img_np.shape[:2],
#             "validation_warnings": []
#         }

#         ==================== STEP 2: ENHANCED COLOR CONSTANCY ====================
#         img_normalized = _apply_enhanced_color_constancy(img_np, diagnostics)

#         ==================== STEP 3: CLAHE ENHANCEMENT ====================
#         img_enhanced = _apply_clahe_enhancement(img_normalized, diagnostics)

#         ==================== STEP 4: MULTI-RESOLUTION PREPARATION ====================
#         img_256 = cv2.resize(img_enhanced, (256, 256))
#         img_128 = cv2.resize(img_enhanced, (128, 128))

#         ==================== STEP 5: SKIN DETECTION ====================
#         img_hsv = cv2.cvtColor(img_256, cv2.COLOR_RGB2HSV)
#         img_lab = cv2.cvtColor(img_256, cv2.COLOR_RGB2LAB)
#         img_ycrcb = cv2.cvtColor(img_256, cv2.COLOR_RGB2YCrCb)
#         img_gray = cv2.cvtColor(img_256, cv2.COLOR_RGB2GRAY)

#         skin_mask = _detect_skin_regions(img_256, img_hsv, img_ycrcb)

#         Validate skin coverage
#         skin_coverage = np.sum(skin_mask > 0) / skin_mask.size
#         diagnostics["skin_coverage_percentage"] = round(skin_coverage * 100, 2)

#         if skin_coverage < 0.15:
#             raise HTTPException(
#                 status_code=400,
#                 detail=f"Insufficient skin visible ({diagnostics['skin_coverage_percentage']}%). Please provide a clearer face photo."
#             )

#         ==================== STEP 6: CREATE AUGMENTED VERSIONS ====================
#         augmented_images = _create_augmented_versions(img_256)
#         diagnostics["augmentation_count"] = len(augmented_images)

#         ==================== STEP 7: EXTRACT COMPREHENSIVE METRICS ====================
#         metrics = _extract_image_metrics(img_256, img_hsv, img_lab, img_gray, skin_mask)

#         ==================== STEP 8: ANALYZE SKIN TYPE ====================
#         skin_types_result = _analyze_skin_type_ensemble(
#             img_256, img_hsv, img_gray, metrics, augmented_images, skin_mask
#         )

#         ==================== STEP 9: ANALYZE CONCERNS ====================
#         concerns_result = _analyze_concerns_comprehensive(
#             img_256, img_hsv, img_lab, img_gray, metrics, skin_mask
#         )

#         ==================== STEP 10: ANALYZE TONE & UNDERTONE ====================
#         tone_result, undertone_result = _analyze_tone_and_undertone_enhanced(
#             img_256, img_lab, img_hsv, metrics, skin_mask
#         )

#         ==================== STEP 11: ANALYZE TEXTURE ====================
#         texture_result = _analyze_texture_enhanced(metrics, skin_mask)

#         ==================== STEP 12: ANALYZE UNDER-EYE ====================
#         under_eye_result = _analyze_under_eye_adaptive(
#             img_gray, img_lab, metrics, skin_mask
#         )

#         ==================== STEP 13: ANALYZE LIP COLOR ====================
#         lip_color_result = _analyze_lip_color_enhanced(
#             img_256, img_lab, img_hsv, skin_mask
#         )

#         ==================== STEP 14: COMPILE & VALIDATE RESULTS ====================
#         result = {
#             "skin_types": skin_types_result,
#             "concerns": concerns_result,
#             "tone": tone_result,
#             "undertone": undertone_result,
#             "texture": texture_result,
#             "under_eye": under_eye_result,
#             "lip_color": lip_color_result,
#         }
#         print(result);
#         Validate results for consistency
#         result = _validate_analysis_results(result, metrics, diagnostics)

#         Add diagnostics if needed for debugging
#         result["diagnostics"] = diagnostics

#         Clean format for API response
#         clean = {
#             k: ([item["value"] for item in v] if isinstance(v, list) else v["value"])
#             for k, v in result.items()
#             if k not in ["diagnostics", "validation_warnings"]
#         }

#         Add validation warnings if any
#         if diagnostics.get("validation_warnings"):
#             clean["warnings"] = diagnostics["validation_warnings"]
#         print(clean);
#         return clean

#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(
#             status_code=500, detail=f"Failed to analyze image: {str(e)}"
#         )


# ==================== ENHANCED PREPROCESSING FUNCTIONS ====================

# def _apply_enhanced_color_constancy(img_np: np.ndarray, diagnostics: Dict) -> np.ndarray:
#     """
#     Apply enhanced color constancy using Gray World + White Patch ensemble.
#     More robust to various lighting conditions.
#     """
#     try:
#         img_float = img_np.astype(np.float32)

#         ===== METHOD 1: GRAY WORLD =====
#         mean_r = np.mean(img_float[:, :, 0])
#         mean_g = np.mean(img_float[:, :, 1])
#         mean_b = np.mean(img_float[:, :, 2])

#         gray_mean = (mean_r + mean_g + mean_b) / 3.0

#         img_gw = img_float.copy()
#         if mean_r > 1e-5 and mean_g > 1e-5 and mean_b > 1e-5:
#             img_gw[:, :, 0] *= (gray_mean / mean_r)
#             img_gw[:, :, 1] *= (gray_mean / mean_g)
#             img_gw[:, :, 2] *= (gray_mean / mean_b)

#         ===== METHOD 2: WHITE PATCH =====
#         max_r = np.percentile(img_float[:, :, 0], 99)
#         max_g = np.percentile(img_float[:, :, 1], 99)
#         max_b = np.percentile(img_float[:, :, 2], 99)

#         max_val = max(max_r, max_g, max_b)

#         img_wp = img_float.copy()
#         if max_r > 1e-5 and max_g > 1e-5 and max_b > 1e-5:
#             img_wp[:, :, 0] *= (max_val / max_r)
#             img_wp[:, :, 1] *= (max_val / max_g)
#             img_wp[:, :, 2] *= (max_val / max_b)

#         ===== WEIGHTED ENSEMBLE =====
#         Gray World is better for overall cast, White Patch for highlights
#         img_normalized = 0.6 * img_gw + 0.4 * img_wp
#         img_normalized = np.clip(img_normalized, 0, 255).astype(np.uint8)

#         Detect color cast strength
#         cast_strength = abs(mean_r - gray_mean) + abs(mean_g - gray_mean) + abs(mean_b - gray_mean)
#         diagnostics["color_cast_strength"] = round(cast_strength, 2)
#         diagnostics["preprocessing_applied"].append("enhanced_color_constancy")

#         return img_normalized

#     except Exception as e:
#         diagnostics["warnings"].append(f"Color constancy failed: {str(e)}")
#         return img_np


# def _apply_clahe_enhancement(img: np.ndarray, diagnostics: Dict) -> np.ndarray:
#     """
#     Apply CLAHE with optimized parameters for skin analysis.
#     """
#     try:
#         img_lab = cv2.cvtColor(img, cv2.COLOR_RGB2LAB)
#         l, a, b = cv2.split(img_lab)

#         Adaptive CLAHE based on image brightness
#         avg_l = np.mean(l)
#         clip_limit = 2.5 if avg_l < 100 else 2.0

#         clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=(8, 8))
#         l_enhanced = clahe.apply(l)

#         img_lab_enhanced = cv2.merge([l_enhanced, a, b])
#         img_enhanced = cv2.cvtColor(img_lab_enhanced, cv2.COLOR_LAB2RGB)

#         diagnostics["preprocessing_applied"].append("adaptive_clahe")
#         return img_enhanced

#     except Exception as e:
#         diagnostics["warnings"].append(f"CLAHE failed: {str(e)}")
#         return img


# def _detect_skin_regions(img_rgb: np.ndarray, img_hsv: np.ndarray,
#                         img_ycrcb: np.ndarray) -> np.ndarray:
#     """
#     Detect skin regions using multi-color-space approach.
#     More robust than fixed coordinate regions.
#     """
#     HSV skin detection
#     lower_hsv = np.array([0, 20, 60], dtype=np.uint8)
#     upper_hsv = np.array([20, 170, 255], dtype=np.uint8)
#     mask_hsv = cv2.inRange(img_hsv, lower_hsv, upper_hsv)

#     YCrCb skin detection (more robust to lighting)
#     lower_ycrcb = np.array([0, 133, 77], dtype=np.uint8)
#     upper_ycrcb = np.array([255, 173, 127], dtype=np.uint8)
#     mask_ycrcb = cv2.inRange(img_ycrcb, lower_ycrcb, upper_ycrcb)

#     RGB ratio-based detection
#     r = img_rgb[:, :, 0].astype(np.float32)
#     g = img_rgb[:, :, 1].astype(np.float32)
#     b = img_rgb[:, :, 2].astype(np.float32)

#     Skin typically has R > G > B with specific ratios
#     mask_rgb = ((r > 95) & (g > 40) & (b > 20) &
#                 (r > g) & (r > b) &
#                 (abs(r - g) > 15)).astype(np.uint8) * 255

#     Combine all masks
#     skin_mask = cv2.bitwise_and(mask_hsv, mask_ycrcb)
#     skin_mask = cv2.bitwise_and(skin_mask, mask_rgb)

#     Morphological operations to clean up
#     kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
#     skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_CLOSE, kernel, iterations=2)
#     skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_OPEN, kernel)

#     Fill small holes
#     kernel_large = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))
#     skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_CLOSE, kernel_large)

#     return skin_mask


# def _create_augmented_versions(img: np.ndarray) -> List[np.ndarray]:
#     """
#     Create augmented versions for ensemble analysis.
#     """
#     augmented = [img]

#     Brightness variations (±10%)
#     bright_up = np.clip(img.astype(np.float32) * 1.1, 0, 255).astype(np.uint8)
#     bright_down = np.clip(img.astype(np.float32) * 0.9, 0, 255).astype(np.uint8)
#     augmented.extend([bright_up, bright_down])

#     Temperature variations
#     warmer = img.copy().astype(np.float32)
#     warmer[:, :, 0] = np.clip(warmer[:, :, 0] * 1.05, 0, 255)
#     warmer[:, :, 1] = np.clip(warmer[:, :, 1] * 1.02, 0, 255)

#     cooler = img.copy().astype(np.float32)
#     cooler[:, :, 2] = np.clip(cooler[:, :, 2] * 1.05, 0, 255)

#     augmented.extend([warmer.astype(np.uint8), cooler.astype(np.uint8)])

#     return augmented


# def _extract_image_metrics(img_256: np.ndarray, img_hsv: np.ndarray,
#                           img_lab: np.ndarray, img_gray: np.ndarray,
#                           skin_mask: np.ndarray) -> Dict:
#     """
#     Extract comprehensive metrics from skin regions only.
#     """
#     Get skin pixels only
#     skin_pixels_rgb = img_256[skin_mask > 0]
#     skin_pixels_hsv = img_hsv[skin_mask > 0]
#     skin_pixels_lab = img_lab[skin_mask > 0]
#     skin_gray = img_gray[skin_mask > 0]

#     if len(skin_pixels_rgb) == 0:
#         Fallback to full image if skin detection failed
#         skin_pixels_rgb = img_256.reshape(-1, 3)
#         skin_pixels_hsv = img_hsv.reshape(-1, 3)
#         skin_pixels_lab = img_lab.reshape(-1, 3)
#         skin_gray = img_gray.flatten()

#     HSV metrics (skin regions only)
#     brightness = np.mean(skin_pixels_hsv[:, 2])
#     saturation = np.mean(skin_pixels_hsv[:, 1])
#     hue = np.mean(skin_pixels_hsv[:, 0])

#     brightness_std = np.std(skin_pixels_hsv[:, 2])
#     saturation_std = np.std(skin_pixels_hsv[:, 1])

#     RGB metrics
#     avg_r = np.mean(skin_pixels_rgb[:, 0])
#     avg_g = np.mean(skin_pixels_rgb[:, 1])
#     avg_b_rgb = np.mean(skin_pixels_rgb[:, 2])

#     color_std = np.std(skin_pixels_rgb, axis=0)
#     overall_color_variation = np.mean(color_std)

#     LAB metrics
#     avg_l = np.mean(skin_pixels_lab[:, 0])
#     avg_a = np.mean(skin_pixels_lab[:, 1])
#     avg_b = np.mean(skin_pixels_lab[:, 2])

#     l_std = np.std(skin_pixels_lab[:, 0])
#     a_std = np.std(skin_pixels_lab[:, 1])
#     b_std = np.std(skin_pixels_lab[:, 2])

#     Texture metrics (full image for edge detection)
#     laplacian_var = cv2.Laplacian(img_gray, cv2.CV_64F).var()

#     sobel_x = cv2.Sobel(img_gray, cv2.CV_64F, 1, 0, ksize=3)
#     sobel_y = cv2.Sobel(img_gray, cv2.CV_64F, 0, 1, ksize=3)
#     sobel_magnitude = np.sqrt(sobel_x**2 + sobel_y**2)
#     edge_density = np.mean(sobel_magnitude[skin_mask > 0]) if np.any(skin_mask) else np.mean(sobel_magnitude)

#     return {
#         "brightness": brightness,
#         "saturation": saturation,
#         "hue": hue,
#         "brightness_std": brightness_std,
#         "saturation_std": saturation_std,
#         "overall_color_variation": overall_color_variation,
#         "laplacian_var": laplacian_var,
#         "edge_density": edge_density,
#         "avg_l": avg_l,
#         "avg_a": avg_a,
#         "avg_b": avg_b,
#         "l_std": l_std,
#         "a_std": a_std,
#         "b_std": b_std,
#         "avg_r": avg_r,
#         "avg_g": avg_g,
#         "avg_b_rgb": avg_b_rgb,
#         "l_channel": img_lab[:, :, 0],
#         "a_channel": img_lab[:, :, 1],
#         "b_channel": img_lab[:, :, 2],
#         "img_hsv": img_hsv,
#         "img_gray": img_gray,
#         "skin_pixels_lab": skin_pixels_lab,
#         "skin_pixels_hsv": skin_pixels_hsv,
#         "skin_gray": skin_gray
#     }


# ==================== ENHANCED ANALYSIS FUNCTIONS ====================

# def _analyze_skin_type_ensemble(img_256: np.ndarray, img_hsv: np.ndarray,
#                                img_gray: np.ndarray, metrics: Dict,
#                                augmented: List[np.ndarray],
#                                skin_mask: np.ndarray) -> Dict:
#     """
#     Analyze skin type using ensemble approach with relative metrics.
#     """
#     predictions = []

#     Analyze original + augmented versions
#     for aug_img in [img_256] + augmented[:2]:
#         result = _analyze_single_skin_type(aug_img, metrics, skin_mask)
#         if result:
#             predictions.append(result)

#     if not predictions:
#         return {"value": "normal", "confidence": 0.60}

#     Vote on most common prediction
#     values = [p["value"] for p in predictions]
#     most_common = max(set(values), key=values.count)

#     Calculate confidence from agreement
#     agreement = values.count(most_common) / len(values)
#     matching_confs = [p["confidence"] for p in predictions if p["value"] == most_common]
#     base_conf = np.mean(matching_confs)

#     final_confidence = base_conf * (0.7 + 0.3 * agreement)

#     return {"value": most_common, "confidence": round(final_confidence, 2)}


# def _analyze_single_skin_type(img: np.ndarray, metrics: Dict,
#                               skin_mask: np.ndarray) -> Optional[Dict]:
#     """
#     Analyze skin type for a single image using relative metrics.
#     """
#     brightness = metrics["brightness"]
#     saturation = metrics["saturation"]
#     brightness_std = metrics["brightness_std"]
#     saturation_std = metrics["saturation_std"]
#     laplacian_var = metrics["laplacian_var"]
#     edge_density = metrics["edge_density"]

#     Calculate shine/oiliness using local variance
#     img_hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)
#     v_channel = img_hsv[:, :, 2][skin_mask > 0] if np.any(skin_mask) else img_hsv[:, :, 2].flatten()

#     High brightness peaks indicate oily shine
#     bright_pixels = np.sum(v_channel > np.percentile(v_channel, 85))
#     shine_ratio = bright_pixels / len(v_channel)

#     OILY SKIN: High brightness, low variation, shine spots
#     if shine_ratio > 0.20 and brightness > 110 and saturation > 25:
#         confidence = min(0.72 + shine_ratio, 0.88)
#         return {"value": "oily", "confidence": round(confidence, 2)}

#     DRY SKIN: Low saturation, high L* variance, low shine
#     if saturation < 40 and brightness_std > 15 and shine_ratio < 0.10:
#         confidence = min(0.70 + (40 - saturation) / 100, 0.86)
#         return {"value": "dry", "confidence": round(confidence, 2)}

#     COMBINATION SKIN: Regional differences
#     h, w = img.shape[:2]
#     t_zone = img[int(h*0.25):int(h*0.65), int(w*0.35):int(w*0.65)]
#     cheek_left = img[int(h*0.45):int(h*0.75), int(w*0.15):int(w*0.40)]
#     cheek_right = img[int(h*0.45):int(h*0.75), int(w*0.60):int(w*0.85)]

#     regions = []
#     for region in [t_zone, cheek_left, cheek_right]:
#         if region.size > 0:
#             region_hsv = cv2.cvtColor(region, cv2.COLOR_RGB2HSV)
#             regions.append({
#                 'brightness': np.mean(region_hsv[:, :, 2]),
#                 'saturation': np.mean(region_hsv[:, :, 1])
#             })

#     if len(regions) >= 2:
#         brightness_range = max([r['brightness'] for r in regions]) - min([r['brightness'] for r in regions])
#         saturation_range = max([r['saturation'] for r in regions]) - min([r['saturation'] for r in regions])

#         if brightness_range > 15 or saturation_range > 20:
#             confidence = min(0.74 + max(brightness_range, saturation_range) / 100, 0.87)
#             return {"value": "combination", "confidence": round(confidence, 2)}

#     SENSITIVE SKIN: High color variation, redness, low texture
#     avg_a = metrics["avg_a"]
#     a_std = metrics["a_std"]

#     if a_std > 8 and avg_a > 133 and laplacian_var < 110:
#         confidence = min(0.68 + a_std / 50, 0.82)
#         return {"value": "sensitive", "confidence": round(confidence, 2)}

#     NORMAL SKIN: Balanced metrics
#     if (80 <= brightness <= 150 and
#         20 <= saturation <= 70 and
#         50 <= laplacian_var <= 180):
#         return {"value": "normal", "confidence": 0.80}

#     return {"value": "normal", "confidence": 0.65}


# def _analyze_concerns_comprehensive(img_256: np.ndarray, img_hsv: np.ndarray,
#                                    img_lab: np.ndarray, img_gray: np.ndarray,
#                                    metrics: Dict, skin_mask: np.ndarray) -> List[Dict]:
#     """
#     Multi-label concern detection with improved accuracy.
#     """
#     concerns = []

#     ==================== REDNESS DETECTION (vs warm undertone) ====================
#     redness = _detect_redness_vs_warmth(img_256, img_hsv, img_lab, metrics, skin_mask)
#     if redness:
#         concerns.append(redness)

#     ==================== BREAKOUTS DETECTION ====================
#     breakouts = _detect_breakouts(img_gray, metrics, skin_mask)
#     if breakouts:
#         concerns.append(breakouts)

#     ==================== HYPERPIGMENTATION DETECTION ====================
#     hyperpig = _detect_hyperpigmentation_adaptive(img_lab, metrics, skin_mask)
#     if hyperpig:
#         concerns.append(hyperpig)

#     ==================== SCARRING DETECTION ====================
#     scarring = _detect_scarring_enhanced(img_gray, metrics, skin_mask)
#     if scarring:
#         concerns.append(scarring)

#     ==================== FINE LINES DETECTION ====================
#     fine_lines = _detect_fine_lines(img_gray, metrics)
#     if fine_lines:
#         concerns.append(fine_lines)

#     ==================== DULLNESS DETECTION ====================
#     dullness = _detect_dullness(metrics, skin_mask)
#     if dullness:
#         concerns.append(dullness)

#     ==================== ENLARGED PORES DETECTION ====================
#     pores = _detect_enlarged_pores(img_gray, metrics)
#     if pores:
#         concerns.append(pores)

#     if not concerns:
#         concerns.append({"value": "none_detected", "confidence": 0.85})

#     return concerns


# def _detect_redness_vs_warmth(img_256: np.ndarray, img_hsv: np.ndarray,
#                               img_lab: np.ndarray, metrics: Dict,
#                               skin_mask: np.ndarray) -> Optional[Dict]:
#     """
#     Differentiate between undertone warmth and actual redness/inflammation.
#     Key: Redness is patchy/uneven, undertone is uniform.
#     """
#     skin_pixels_lab = metrics["skin_pixels_lab"]
#     a_channel = img_lab[:, :, 1][skin_mask > 0] if np.any(skin_mask) else img_lab[:, :, 1].flatten()

#     avg_a = np.mean(a_channel)
#     a_variance = np.var(a_channel)

#     High a* with LOW variance = warm undertone (uniform)
#     High a* with HIGH variance = redness (patchy)

#     is_high_red = avg_a > 135
#     is_patchy = a_variance > 30

#     if not is_high_red:
#         return None

#     Check for localized red spots
#     a_threshold = np.percentile(a_channel, 85)
#     red_spots = a_channel > a_threshold
#     red_percentage = np.sum(red_spots) / len(a_channel)

#     Additional check: red hue in HSV
#     skin_hsv = img_hsv[skin_mask > 0] if np.any(skin_mask) else img_hsv.reshape(-1, 3)
#     hue = skin_hsv[:, 0]
#     sat = skin_hsv[:, 1]

#     red_hue_mask = ((hue <= 10) | (hue >= 170)) & (sat > 60)
#     red_hue_percentage = np.sum(red_hue_mask) / len(hue)

#     Decision logic
#     if is_patchy and red_hue_percentage > 0.12:
#         Patchy redness = concern
#         confidence = min(0.72 + a_variance / 100, 0.87)
#         return {"value": "redness", "confidence": round(confidence, 2)}
#     elif is_high_red and not is_patchy and red_percentage < 0.20:
#         Uniform warmth = not a concern
#         return None
#     elif red_hue_percentage > 0.18:
#         Significant red hue = concern
#         confidence = min(0.70 + red_hue_percentage, 0.85)
#         return {"value": "redness", "confidence": round(confidence, 2)}

#     return None


# def _detect_breakouts(img_gray: np.ndarray, metrics: Dict,
#                      skin_mask: np.ndarray) -> Optional[Dict]:
#     """
#     Detect breakouts using texture and edge analysis.
#     """
#     laplacian_var = metrics["laplacian_var"]
#     edge_density = metrics["edge_density"]

#     High texture variance indicates bumps/breakouts
#     if laplacian_var > 150 and edge_density > 18:
#         confidence = min(0.70 + (laplacian_var - 150) / 250, 0.86)
#         return {"value": "breakouts", "confidence": round(confidence, 2)}

#     return None


# def _detect_hyperpigmentation_adaptive(img_lab: np.ndarray, metrics: Dict,
#                                        skin_mask: np.ndarray) -> Optional[Dict]:
#     """
#     Adaptive hyperpigmentation detection for all skin tones.
#     """
#     l_channel = metrics["l_channel"]
#     avg_l = metrics["avg_l"]
#     l_std = metrics["l_std"]

#     Get skin L values only
#     l_skin = l_channel[skin_mask > 0] if np.any(skin_mask) else l_channel.flatten()

#     if len(l_skin) < 100:
#         return None

#     Use percentiles for adaptive thresholding
#     p10 = np.percentile(l_skin, 10)
#     p50 = np.percentile(l_skin, 50)
#     p90 = np.percentile(l_skin, 90)

#     darkness_range = p50 - p10
#     lightness_range = p90 - p50

#     Adaptive threshold based on skin tone
#     # if avg_l < 100:  # Darker skin
#         threshold_factor = 0.10
#         min_affected = 0.04
#     # elif avg_l < 140:  # Medium skin
#         threshold_factor = 0.12
#         min_affected = 0.06
#     # else:  # Lighter skin
#         threshold_factor = 0.15
#         min_affected = 0.08

#     is_significant = darkness_range > (p50 * threshold_factor)

#     Calculate affected area
#     dark_threshold = p50 - (darkness_range * 0.5)
#     dark_pixels = np.sum(l_skin < dark_threshold)
#     dark_percentage = dark_pixels / len(l_skin)

#     if is_significant and dark_percentage > min_affected:
#         confidence = min(0.68 + (dark_percentage * 2.5), 0.85)
#         return {"value": "hyperpigmentation", "confidence": round(confidence, 2)}

#     return None


# def _detect_scarring_enhanced(img_gray: np.ndarray, metrics: Dict,
#                               skin_mask: np.ndarray) -> Optional[Dict]:
#     """
#     Enhanced scarring detection using multiple texture methods.
#     """
#     laplacian_var = metrics["laplacian_var"]
#     edge_density = metrics["edge_density"]

#     Directional texture analysis
#     kernel_h = np.array([[-1, -1, -1], [2, 2, 2], [-1, -1, -1]], dtype=np.float32)
#     kernel_v = np.array([[-1, 2, -1], [-1, 2, -1], [-1, 2, -1]], dtype=np.float32)

#     lines_h = cv2.filter2D(img_gray, -1, kernel_h)
#     lines_v = cv2.filter2D(img_gray, -1, kernel_v)

#     line_intensity_h = np.mean(np.abs(lines_h))
#     line_intensity_v = np.mean(np.abs(lines_v))

#     Crater/pit detection
#     circles = cv2.HoughCircles(
#         img_gray, cv2.HOUGH_GRADIENT, dp=1, minDist=8,
#         param1=50, param2=12, minRadius=1, maxRadius=6
#     )
#     crater_count = 0 if circles is None else len(circles[0])
#     crater_density = crater_count / (256 * 256) * 10000

#     Scoring
#     scar_score = 0

#     if crater_density > 3 and laplacian_var > 160:
#         scar_score += 1
#     if max(line_intensity_h, line_intensity_v) > 15 and edge_density > 20:
#         scar_score += 1
#     if laplacian_var > 180 and crater_density > 4:
#         scar_score += 1

#     if scar_score >= 2:
#         confidence = min(0.60 + scar_score * 0.08, 0.78)
#         return {"value": "scarring", "confidence": round(confidence, 2)}

#     return None


# def _detect_fine_lines(img_gray: np.ndarray, metrics: Dict) -> Optional[Dict]:
#     """
#     Detect fine lines and wrinkles.
#     """
#     laplacian_var = metrics["laplacian_var"]
#     edge_density = metrics["edge_density"]

#     Subtle texture indicates fine lines
#     if 90 < laplacian_var < 160 and edge_density > 10:
#         confidence = min(0.62 + (laplacian_var - 90) / 200, 0.80)
#         return {"value": "fine_lines", "confidence": round(confidence, 2)}

#     return None


# def _detect_dullness(metrics: Dict, skin_mask: np.ndarray) -> Optional[Dict]:
#     """
#     Detect dull, lackluster skin.
#     """
#     saturation = metrics["saturation"]
#     brightness = metrics["brightness"]
#     overall_color_variation = metrics["overall_color_variation"]

#     Low saturation + low brightness = dull
#     if saturation < 35 and brightness < 125 and overall_color_variation < 32:
#         dullness_score = (35 - saturation) + (125 - brightness) / 2
#         confidence = min(0.65 + dullness_score / 100, 0.82)
#         return {"value": "dullness", "confidence": round(confidence, 2)}

#     return None


# def _detect_enlarged_pores(img_gray: np.ndarray, metrics: Dict) -> Optional[Dict]:
#     """
#     Detect enlarged pores using circular pattern detection.
#     """
#     edge_density = metrics["edge_density"]

#     Detect circular patterns
#     circles = cv2.HoughCircles(
#         img_gray, cv2.HOUGH_GRADIENT, dp=1, minDist=8,
#         param1=50, param2=12, minRadius=1, maxRadius=6
#     )

#     crater_count = 0 if circles is None else len(circles[0])
#     crater_density = crater_count / (256 * 256) * 10000

#     if edge_density > 22 and crater_density > 2.5:
#         confidence = min(0.64 + crater_density / 25, 0.81)
#         return {"value": "enlarged_pores", "confidence": round(confidence, 2)}

#     return None


# def _analyze_tone_and_undertone_enhanced(img_256: np.ndarray, img_lab: np.ndarray,
#                                         img_hsv: np.ndarray, metrics: Dict,
#                                         skin_mask: np.ndarray) -> Tuple[Dict, Dict]:
#     """
#     Enhanced tone and undertone analysis with better accuracy.
#     """
#     avg_l = metrics["avg_l"]
#     avg_a = metrics["avg_a"]
#     avg_b = metrics["avg_b"]
#     l_std = metrics["l_std"]

#     ==================== TONE DEPTH ANALYSIS ====================
#     Adjust for undertone's effect on perceived lightness
#     warmth_factor = (avg_b - 128) * 0.02
#     adjusted_l = avg_l + warmth_factor

#     if adjusted_l < 75:
#         depth = "very_deep"
#         tone_confidence = 0.87
#     elif adjusted_l < 105:
#         depth = "deep"
#         tone_confidence = 0.89
#     elif adjusted_l < 135:
#         depth = "medium-deep"
#         tone_confidence = 0.91
#     elif adjusted_l < 165:
#         depth = "medium"
#         tone_confidence = 0.93
#     elif adjusted_l < 195:
#         depth = "light"
#         tone_confidence = 0.91
#     else:
#         depth = "very_light"
#         tone_confidence = 0.89

#     Reduce confidence for uneven lighting
#     if l_std > 22:
#         tone_confidence = max(0.65, tone_confidence - 0.18)

#     ==================== UNDERTONE ANALYSIS ====================
#     a_deviation = avg_a - 128
#     b_deviation = avg_b - 128

#     warm_score = 0
#     cool_score = 0

#     Yellow component (strongest indicator)
#     if b_deviation > 10:
#         warm_score += 2
#         if b_deviation > 16:
#             warm_score += 1
#     elif b_deviation < -6:
#         cool_score += 2

#     Red/pink component
#     if a_deviation > 8:
#         if b_deviation > 0:
#             warm_score += 1
#         else:
#             cool_score += 1
#     elif a_deviation < -4:
#         cool_score += 1

#     RGB ratios
#     avg_r = metrics["avg_r"]
#     avg_g = metrics["avg_g"]
#     avg_b_rgb = metrics["avg_b_rgb"]

#     rg_ratio = avg_r / avg_g if avg_g > 0 else 1
#     yb_ratio = (avg_r + avg_g) / (2 * avg_b_rgb) if avg_b_rgb > 0 else 1

#     if rg_ratio > 1.06 and yb_ratio > 1.12:
#         warm_score += 1
#     elif rg_ratio < 0.94 and yb_ratio < 0.88:
#         cool_score += 1

#     Determine undertone
#     if warm_score > cool_score + 1:
#         if b_deviation > 14:
#             undertone = "warm (golden)"
#         elif a_deviation > 9:
#             undertone = "warm (peachy)"
#         else:
#             undertone = "warm"
#         undertone_confidence = min(0.76 + warm_score * 0.04, 0.91)

#     elif cool_score > warm_score + 1:
#         if a_deviation > 4:
#             undertone = "cool (pink)"
#         elif b_deviation < -4:
#             undertone = "cool (blue)"
#         else:
#             undertone = "cool"
#         undertone_confidence = min(0.74 + cool_score * 0.04, 0.89)

#     else:
#         if abs(b_deviation) < 4 and abs(a_deviation) < 4:
#             undertone = "neutral"
#             undertone_confidence = 0.83
#         elif b_deviation > 0:
#             undertone = "neutral-warm"
#             undertone_confidence = 0.79
#         else:
#             undertone = "neutral-cool"
#             undertone_confidence = 0.79

#     Compile descriptions
#     tone_description = f"{depth} with {undertone} undertone"

#     return (
#         {"value": tone_description, "confidence": round(tone_confidence, 2)},
#         {"value": undertone, "confidence": round(undertone_confidence, 2)}
#     )


# def _analyze_texture_enhanced(metrics: Dict, skin_mask: np.ndarray) -> Dict:
#     """
#     Enhanced texture analysis using multiple metrics.
#     """
#     laplacian_var = metrics["laplacian_var"]
#     edge_density = metrics["edge_density"]
#     l_std = metrics["l_std"]

#     Weighted texture score
#     texture_score = laplacian_var * 0.5 + edge_density * 0.3 + l_std * 0.2

#     if texture_score < 40:
#         texture = "very_smooth"
#         confidence = 0.84
#     elif texture_score < 65:
#         texture = "smooth"
#         confidence = 0.87
#     elif texture_score < 95:
#         texture = "slightly_textured"
#         confidence = 0.89
#     elif texture_score < 135:
#         texture = "textured"
#         confidence = 0.85
#     else:
#         texture = "very_textured"
#         confidence = 0.82

#     return {"value": texture, "confidence": round(confidence, 2)}


# def _analyze_under_eye_adaptive(img_gray: np.ndarray, img_lab: np.ndarray,
#                                metrics: Dict, skin_mask: np.ndarray) -> Dict:
#     """
#     Adaptive under-eye analysis accounting for different skin tones.
#     """
#     height, width = img_gray.shape
#     avg_l = metrics["avg_l"]

#     Under-eye regions
#     left_eye = img_lab[
#         int(height * 0.58):int(height * 0.72),
#         int(width * 0.28):int(width * 0.42)
#     ]
#     right_eye = img_lab[
#         int(height * 0.58):int(height * 0.72),
#         int(width * 0.58):int(width * 0.72)
#     ]

#     if left_eye.size == 0 or right_eye.size == 0:
#         return {"value": "unable_to_detect", "confidence": 0.25}

#     under_eye_l = (np.mean(left_eye[:, :, 0]) + np.mean(right_eye[:, :, 0])) / 2

#     Reference regions (cheeks, forehead)
#     cheek_region = img_lab[
#         int(height * 0.50):int(height * 0.70),
#         int(width * 0.15):int(width * 0.85)
#     ]

#     if cheek_region.size == 0:
#         return {"value": "unable_to_detect", "confidence": 0.25}

#     reference_l = np.mean(cheek_region[:, :, 0])

#     darkness_ratio = under_eye_l / reference_l if reference_l > 0 else 1.0

#     Adaptive thresholds
#     # if avg_l < 100:  # Darker skin
#         thresholds = {"severe": 0.87, "moderate": 0.93, "mild": 0.96}
#     # elif avg_l < 140:  # Medium skin
#         thresholds = {"severe": 0.85, "moderate": 0.91, "mild": 0.95}
#     # else:  # Lighter skin
#         thresholds = {"severe": 0.83, "moderate": 0.89, "mild": 0.94}

#     if darkness_ratio < thresholds["severe"]:
#         return {"value": "severe", "confidence": 0.81}
#     elif darkness_ratio < thresholds["moderate"]:
#         return {"value": "moderate", "confidence": 0.84}
#     elif darkness_ratio < thresholds["mild"]:
#         return {"value": "mild", "confidence": 0.86}
#     else:
#         return {"value": "none", "confidence": 0.88}


# def _analyze_lip_color_enhanced(img_256: np.ndarray, img_lab: np.ndarray,
#                                img_hsv: np.ndarray, skin_mask: np.ndarray) -> Dict:
#     """
#     Enhanced lip color analysis.
#     """
#     height, width = img_256.shape[:2]

#     Lip region
#     lip_region = img_256[
#         int(height * 0.65):int(height * 0.85),
#         int(width * 0.35):int(width * 0.65)
#     ]

#     if lip_region.size == 0:
#         return {"value": "unable_to_detect", "confidence": 0.25}

#     lip_lab = cv2.cvtColor(lip_region, cv2.COLOR_RGB2LAB)
#     lip_hsv = cv2.cvtColor(lip_region, cv2.COLOR_RGB2HSV)

#     avg_l_lip = np.mean(lip_lab[:, :, 0])
#     avg_a_lip = np.mean(lip_lab[:, :, 1])
#     avg_b_lip = np.mean(lip_lab[:, :, 2])

#     avg_h_lip = np.mean(lip_hsv[:, :, 0])
#     avg_s_lip = np.mean(lip_hsv[:, :, 1])

#     avg_r_lip = np.mean(lip_region[:, :, 0])
#     avg_g_lip = np.mean(lip_region[:, :, 1])
#     avg_b_rgb_lip = np.mean(lip_region[:, :, 2])

#     Compare to surrounding skin
#     surrounding = img_lab[
#         int(height * 0.55):int(height * 0.65),
#         int(width * 0.35):int(width * 0.65)
#     ]

#     if surrounding.size > 0:
#         surr_l = np.mean(surrounding[:, :, 0])
#         l_diff = avg_l_lip - surr_l

#         Classification
#         confidence = 0.76

#         Strong red/pink
#         if avg_a_lip > 135 and avg_s_lip > 70:
#             if avg_h_lip <= 15 or avg_h_lip >= 165:
#                 return {"value": "red/pink", "confidence": 0.86}
#             elif 15 < avg_h_lip <= 30:
#                 return {"value": "coral/orange", "confidence": 0.83}

#         Pink tones
#         elif avg_a_lip > 130 and 30 < avg_s_lip <= 70:
#             return {"value": "pink", "confidence": 0.80}

#         Brown/nude
#         elif abs(avg_r_lip - avg_g_lip) < 18 and abs(avg_g_lip - avg_b_rgb_lip) < 18:
#             if avg_l_lip < surr_l:
#                 return {"value": "brown/nude", "confidence": 0.77}
#             else:
#                 return {"value": "natural", "confidence": 0.79}

#         Purple/mauve
#         elif avg_b_rgb_lip > avg_g_lip and (avg_r_lip + avg_b_rgb_lip) > 1.35 * avg_g_lip:
#             return {"value": "purple/mauve", "confidence": 0.75}

#         Peach/coral
#         elif avg_r_lip > avg_b_rgb_lip and 20 < avg_h_lip < 40:
#             return {"value": "peach/coral", "confidence": 0.81}

#         Natural with some color
#         elif abs(l_diff) > 8 or avg_s_lip > 30:
#             return {"value": "natural_with_color", "confidence": 0.74}

#         else:
#             return {"value": "natural", "confidence": 0.72}

#     return {"value": "natural", "confidence": 0.68}


# def _validate_analysis_results(result: Dict, metrics: Dict,
#                               diagnostics: Dict) -> Dict:
#     """
#     Validate results for internal consistency and flag issues.
#     """
#     warnings = []

#     Check tone/brightness consistency
#     tone_value = result["tone"]["value"]
#     avg_l = metrics["avg_l"]

#     if "very_deep" in tone_value and avg_l > 115:
#         warnings.append("Tone/brightness mismatch - image may be overexposed")
#     elif "very_light" in tone_value and avg_l < 180:
#         warnings.append("Tone/brightness mismatch - image may be underexposed")

#     Check undertone/color consistency
#     undertone_value = result["undertone"]["value"]
#     avg_b = metrics["avg_b"]

#     if "warm" in undertone_value and avg_b < 125:
#         warnings.append("Warm undertone detected but low yellow values - verify color correction")
#     elif "cool" in undertone_value and avg_b > 133:
#         warnings.append("Cool undertone detected but high yellow values - verify color correction")

#     Check for cascading low confidence
#     low_conf_results = [
#         k for k, v in result.items()
#         if isinstance(v, dict) and v.get("confidence", 1) < 0.65
#     ]

#     if len(low_conf_results) >= 3:
#         warnings.append(f"Multiple low-confidence predictions ({', '.join(low_conf_results)}) - image quality may be poor")

#     Check skin coverage
#     if diagnostics.get("skin_coverage_percentage", 100) < 25:
#         warnings.append("Low skin coverage detected - results may be less accurate")

#     diagnostics["validation_warnings"] = warnings
#     return result

# DeepFace integration


class SkinAnalysisResult(BaseModel):
    skin_type: str
    concerns: List[Dict[str, float]]
    tone: str
    undertone: str
    texture: str
    under_eye: str
    lip_color: str

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
            normalized_regions["cheek"], lighting_quality
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
        print(skin_type, skin_type_conf, concerns, tone, tone_conf, undertone, undertone_conf, texture, texture_conf, under_eye, under_eye_conf, lip_color, lip_conf)
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

        print(result)
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

            # Extract gray values for texture
            gray_region = img_gray * (mask > 0).astype(np.uint8)
            gray_pixels = gray_region[mask > 0]

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
                "mask": mask,
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
        self, cheek_data: Dict, lighting_quality: float
    ) -> Tuple[str, float]:
        """
        Classify skin type based on texture proxies and color variance
        Types: oily, dry, combination, normal, sensitive
        """
        if cheek_data is None:
            return "unknown", 0.0

        # Use RGB std as texture/oiliness proxy
        rgb_std = cheek_data["rgb_std"]
        texture_score = np.mean(rgb_std)

        # Lightness variance (L channel in LAB)
        l_std = cheek_data["lab_std"][0]

        # HSV saturation (dry skin has lower saturation)
        saturation = cheek_data["hsv_mean"][1]

        # Classification rules (calibrated thresholds)
        if texture_score > 15 and l_std > 12 and saturation > 40:
            skin_type = "oily"
        elif saturation < 35 and l_std > 10:
            skin_type = "dry"
        elif texture_score > 10 and l_std < 15:
            skin_type = "combination"
        elif l_std > 15 or cheek_data["lab_std"][1] > 8:  # High variance in redness
            skin_type = "sensitive"
        else:
            skin_type = "normal"

        # Confidence based on lighting and data quality
        base_confidence = 0.72
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
        if regions["under_eye"] is not None and regions["cheek"] is not None:
            under_eye_l = regions["under_eye"]["lab_mean"][0]
            cheek_l = regions["cheek"]["lab_mean"][0]

            darkness_diff = cheek_l - under_eye_l
            if darkness_diff > 6:
                if darkness_diff > 15:
                    severity = "severe"
                elif darkness_diff > 10:
                    severity = "moderate"
                else:
                    severity = "mild"

                confidence = min(0.88, (darkness_diff / 20) * lighting_quality)
                concerns.append(
                    {
                        "concern": "dark_circles",
                        "severity": severity,
                        "confidence": confidence,
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
        if regions["cheek"] is not None:
            l_std = regions["cheek"]["lab_std"][0]
            if l_std > 9:
                if l_std > 16:
                    severity = "severe"
                elif l_std > 12:
                    severity = "moderate"
                else:
                    severity = "mild"

                confidence = min(0.85, (l_std / 20) * lighting_quality)
                concerns.append(
                    {
                        "concern": "uneven_tone",
                        "severity": severity,
                        "confidence": confidence,
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
        if regions["cheek"] is not None:
            saturation = regions["cheek"]["hsv_mean"][1]
            brightness = regions["cheek"]["hsv_mean"][2]

            if saturation < 38 and brightness < 125:
                if saturation < 28 and brightness < 110:
                    severity = "severe"
                elif saturation < 33:
                    severity = "moderate"
                else:
                    severity = "mild"

                confidence = 0.75 * lighting_quality
                concerns.append(
                    {
                        "concern": "dullness",
                        "severity": severity,
                        "confidence": confidence,
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
        Detect acne using redness + texture anomalies
        Acne shows as localized red bumps with texture variation
        """
        if regions["cheek"] is None or regions["forehead"] is None:
            return None

        # Combine face regions
        face_mask = cv2.bitwise_or(
            regions["cheek"]["mask"], regions["forehead"]["mask"]
        )

        # Extract a channel (redness) in face region
        a_channel = img_lab[:, :, 1].copy()
        face_a = a_channel[face_mask > 0]

        if len(face_a) == 0:
            return None

        # Detect red spots (acne is typically redder than surrounding skin)
        a_mean = np.mean(face_a)
        a_std = np.std(face_a)
        red_threshold = a_mean + 1.2 * a_std  # Areas significantly redder

        # Create red spot mask
        red_spots_mask = ((a_channel > red_threshold) & (face_mask > 0)).astype(
            np.uint8
        )

        # Use morphological operations to isolate spots
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        red_spots_mask = cv2.morphologyEx(red_spots_mask, cv2.MORPH_CLOSE, kernel)

        # Count connected components (potential acne spots)
        num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(
            red_spots_mask, connectivity=8
        )

        # Filter by size (acne spots are typically 3-50 pixels in area)
        valid_spots = 0
        for i in range(1, num_labels):  # Skip background
            area = stats[i, cv2.CC_STAT_AREA]
            if 3 <= area <= 50:
                valid_spots += 1

        # Also check texture variance in gray image
        gray_face = img_gray[face_mask > 0]
        gray_std = np.std(gray_face)

        # Classification
        if valid_spots > 15 or (valid_spots > 8 and gray_std > 25):
            severity = "severe"
            confidence = 0.78
        elif valid_spots > 8 or (valid_spots > 4 and gray_std > 22):
            severity = "moderate"
            confidence = 0.75
        elif valid_spots > 3:
            severity = "mild"
            confidence = 0.70
        else:
            return None

        return {
            "concern": "acne",
            "severity": severity,
            "confidence": confidence * lighting_quality,
        }

    def _detect_redness(
        self, img_lab: np.ndarray, regions: Dict, lighting_quality: float
    ) -> Optional[Dict]:
        """
        Detect generalized redness (different from acne - more diffuse)
        """
        if regions["cheek"] is None:
            return None

        a_channel = regions["cheek"]["lab_mean"][1]  # Red-green axis
        a_std = regions["cheek"]["lab_std"][1]

        # Check if skin is generally red (not just spots)
        # Neutral is ~128, red is >128
        if a_channel > 136 and a_std < 10:  # Diffuse redness (low std = not spotty)
            if a_channel > 145:
                severity = "severe"
                confidence = 0.82
            elif a_channel > 140:
                severity = "moderate"
                confidence = 0.80
            else:
                severity = "mild"
                confidence = 0.75

            return {
                "concern": "redness",
                "severity": severity,
                "confidence": confidence * lighting_quality,
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

        # General hyperpigmentation (overall uneven lightness)
        if l_std > 14:
            if l_std > 20:
                severity = "severe"
                confidence = 0.78
            elif l_std > 17:
                severity = "moderate"
                confidence = 0.76
            else:
                severity = "mild"
                confidence = 0.72

            concerns.append(
                {
                    "concern": "hyperpigmentation",
                    "severity": severity,
                    "confidence": confidence * lighting_quality,
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

        # Apply Laplacian to detect texture edges
        laplacian = cv2.Laplacian(img_gray, cv2.CV_64F)
        laplacian_abs = np.abs(laplacian)

        # Get texture in cheek region
        texture_region = laplacian_abs[mask > 0]

        if len(texture_region) == 0:
            return None

        # High variance in texture suggests scars (discontinuous texture)
        texture_var = np.var(texture_region)
        texture_mean = np.mean(texture_region)

        # Also check for lightness discontinuities
        l_channel = img_lab[:, :, 0]
        l_region = l_channel[mask > 0]
        l_std = np.std(l_region)

        # Scars: high texture variance + lightness irregularity
        scar_score = (texture_var / 100) + (l_std / 10)

        if scar_score > 4.5:
            severity = "moderate"
            confidence = 0.68  # Lower confidence - scars hard to detect
        elif scar_score > 3.5:
            severity = "mild"
            confidence = 0.65
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
        Detect enlarged pores using local texture variance
        Pores show as small dark spots with regular patterns
        """
        if regions["nose"] is None and regions["cheek"] is None:
            return None

        # Focus on nose and cheek (common pore areas)
        pore_mask = np.zeros_like(img_gray)
        if regions["nose"] is not None:
            pore_mask = cv2.bitwise_or(pore_mask, regions["nose"]["mask"])
        if regions["cheek"] is not None:
            pore_mask = cv2.bitwise_or(pore_mask, regions["cheek"]["mask"])

        # Use Laplacian variance as texture measure
        laplacian = cv2.Laplacian(img_gray, cv2.CV_64F)
        lap_var = laplacian.var()

        # Calculate local standard deviation (high = textured/porous)
        gray_region = img_gray[pore_mask > 0]
        if len(gray_region) == 0:
            return None

        local_std = np.std(gray_region)

        # Combined score
        pore_score = (lap_var / 50) + (local_std / 10)

        if pore_score > 8:
            severity = "severe"
            confidence = 0.70
        elif pore_score > 5.5:
            severity = "moderate"
            confidence = 0.68
        elif pore_score > 4:
            severity = "mild"
            confidence = 0.65
        else:
            return None

        return {
            "concern": "enlarged_pores",
            "severity": severity,
            "confidence": confidence * lighting_quality,
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

        # Apply Canny edge detection (deterministic with fixed thresholds)
        edges = cv2.Canny(img_gray, threshold1=30, threshold2=90)

        # Analyze forehead (common wrinkle area)
        if regions["forehead"] is not None:
            forehead_edges = edges[regions["forehead"]["mask"] > 0]
            if len(forehead_edges) > 0:
                edge_density = np.sum(forehead_edges > 0) / len(forehead_edges)

                if edge_density > 0.08:
                    concerns.append(
                        {
                            "concern": "wrinkles",
                            "severity": "moderate",
                            "confidence": 0.72 * lighting_quality,
                        }
                    )
                elif edge_density > 0.05:
                    concerns.append(
                        {
                            "concern": "fine_lines",
                            "severity": "mild",
                            "confidence": 0.68 * lighting_quality,
                        }
                    )

        # Analyze under-eye (fine lines common)
        if regions["under_eye"] is not None:
            under_eye_edges = edges[regions["under_eye"]["mask"] > 0]
            if len(under_eye_edges) > 0:
                edge_density = np.sum(under_eye_edges > 0) / len(under_eye_edges)

                if edge_density > 0.06 and not any(
                    c["concern"] == "fine_lines" for c in concerns
                ):
                    concerns.append(
                        {
                            "concern": "fine_lines",
                            "severity": "mild",
                            "confidence": 0.65 * lighting_quality,
                        }
                    )

        return concerns

    def _classify_tone(
        self, cheek_data: Dict, lighting_quality: float
    ) -> Tuple[str, float]:
        """
        Classify skin tone using L channel (lightness) from LAB
        Scale: very_light, light, medium_light, medium, medium_deep, deep, very_deep
        """
        if cheek_data is None:
            return "unknown", 0.0

        l_value = cheek_data["lab_mean"][0]

        # Expanded Fitzpatrick-inspired thresholds
        if l_value > 85:
            tone = "very_light"
        elif l_value > 75:
            tone = "light"
        elif l_value > 65:
            tone = "medium_light"
        elif l_value > 55:
            tone = "medium"
        elif l_value > 45:
            tone = "medium_deep"
        elif l_value > 35:
            tone = "deep"
        else:
            tone = "very_deep"

        # High confidence for tone (relatively stable measurement)
        confidence = 0.86 * lighting_quality

        return tone, confidence

    def _classify_undertone(
        self, cheek_data: Dict, lighting_quality: float
    ) -> Tuple[str, float]:
        """
        Classify undertone using 'a' and 'b' channels from LAB
        Types: warm, warm_golden, cool, cool_pink, neutral, neutral_warm, neutral_cool
        """
        if cheek_data is None:
            return "unknown", 0.0

        a_channel = cheek_data["lab_mean"][1]  # Red-green axis
        b_channel = cheek_data["lab_mean"][2]  # Yellow-blue axis

        # Normalize around neutral (128)
        a_diff = a_channel - 128
        b_diff = b_channel - 128

        # Calculate undertone scores
        warm_score = 0
        cool_score = 0

        # Yellow component (b channel)
        if b_diff > 12:
            warm_score += 3
        elif b_diff > 6:
            warm_score += 2
        elif b_diff > 2:
            warm_score += 1
        elif b_diff < -4:
            cool_score += 2

        # Red/pink component (a channel)
        if a_diff > 8:
            if b_diff > 0:
                warm_score += 1  # Peachy
            else:
                cool_score += 2  # Pink
        elif a_diff > 4:
            if b_diff < 0:
                cool_score += 1

        # Determine undertone
        if warm_score >= cool_score + 2:
            if b_diff > 15:
                undertone = "warm_golden"
            else:
                undertone = "warm"
        elif cool_score >= warm_score + 2:
            if a_diff > 6:
                undertone = "cool_pink"
            else:
                undertone = "cool"
        else:
            # Neutral territory
            if abs(b_diff) < 4 and abs(a_diff) < 4:
                undertone = "neutral"
            elif b_diff > 0:
                undertone = "neutral_warm"
            else:
                undertone = "neutral_cool"

        # Confidence (undertone is subtle)
        base_confidence = 0.70
        confidence = base_confidence * lighting_quality

        return undertone, confidence

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

        under_eye_l = under_eye_data["lab_mean"][0]
        cheek_l = cheek_data["lab_mean"][0]

        # Calculate relative darkness
        darkness_diff = cheek_l - under_eye_l

        # Classification
        if darkness_diff < 4:
            state = "none"
        elif darkness_diff < 8:
            state = "mild"
        elif darkness_diff < 14:
            state = "moderate"
        else:
            state = "severe"

        confidence = 0.78 * lighting_quality

        return state, confidence

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

        # Calculate color characteristics
        lightness = l
        saturation = s
        hue = h

        # Red dominance
        red_intensity = r / (g + b + 1)

        # a* channel (red-green)
        a_diff = a_lab - 128

        # Classification with expanded categories

        # PALE: Very light, low saturation
        if lightness > 75 and saturation < 40:
            lip_color = "pale"

        # NUDE: Light, peachy/beige
        elif lightness > 65 and saturation < 60 and b_lab > 128:
            lip_color = "nude"

        # BROWN: Lower lightness, low saturation, warm
        elif lightness < 55 and saturation < 50 and b_lab > 128:
            lip_color = "brown"

        # RED: High saturation, red hue
        elif saturation > 80 and (hue < 15 or hue > 345):
            lip_color = "red"

        # CORAL: Orange-red, warm
        elif saturation > 50 and 5 < hue < 25:
            lip_color = "coral"

        # BERRY: Deep, saturated, purple-red
        elif saturation > 60 and lightness < 60 and (hue > 320 or hue < 10):
            lip_color = "berry"

        # MAUVE: Purple-pink, medium saturation
        elif saturation > 35 and 300 < hue < 340:
            lip_color = "mauve"

        # ROSE/PINK: Distinguish by intensity
        elif saturation > 45 and 330 < hue < 360:
            if a_diff > 15 or saturation > 65:
                lip_color = "rose"
            else:
                lip_color = "pink"

        # LIGHT_PINK: Lower saturation pink
        elif saturation > 30 and 320 < hue < 360 and lightness > 60:
            lip_color = "light_pink"

        # PINK: Default pink range
        elif saturation > 35 and (hue > 320 or hue < 20):
            lip_color = "pink"

        # NATURAL: Everything else
        else:
            lip_color = "natural"

        confidence = 0.72 * lighting_quality

        return lip_color, confidence

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
