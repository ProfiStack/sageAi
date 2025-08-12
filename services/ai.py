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
        elif feature_type == "meal_muse" or feature_type == "nutri_guide" or feature_type == "supp_smart":
            return get_nutrition_checker_prompt(user_metrics)
        elif feature_type == "fit_flow" or feature_type == "manifest_mode" or feature_type == "positivity_pulse" or feature_type == "self_spark" or feature_type == "stress_reset" or feature_type == "wellness_whisper" or feature_type == "zen_zone":
            return get_wellness_checker_prompt(user_metrics)
        elif feature_type == "formula_focus" or feature_type == "hair_decode" or feature_type == "style_spark" or feature_type == "tress_therapy":
            return get_hair_care_checker_prompt(user_metrics)
        elif feature_type == "event_edit" or feature_type == "fashion_fix" or feature_type == "shop_smart":
            return get_styling_checker_prompt(user_metrics)
        elif feature_type == "beauty_breakdown" or feature_type == "beauty_brief" or feature_type == "event_glam" or feature_type == "flawless_factor" or feature_type == "perfect_pair" or feature_type == "true_tone":
            return get_makeup_checker_prompt(user_metrics)
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

        # Hyperpigmentation
        if overall_color_variation > 50:
            concerns.append("hyperpigmentation")

        # Redness analysis
        red_channel = img_256[:, :, 0].astype(np.float32)
        green_channel = img_256[:, :, 1].astype(np.float32)
        blue_channel = img_256[:, :, 2].astype(np.float32)

        redness_index = np.mean(red_channel - (green_channel + blue_channel) / 2)
        if redness_index > 30:
            concerns.append("redness")

        # Fine lines/aging
        if laplacian_var > 120 and brightness < 100:
            concerns.append("fine lines")

        # Dullness
        if saturation < 35 and brightness < 110:
            concerns.append("dullness")

        # Large pores
        if edge_density > 20:
            concerns.append("enlarged pores")

        # --- Skin tone analysis ---
        l_channel = img_lab[:, :, 0]
        a_channel = img_lab[:, :, 1]
        b_channel = img_lab[:, :, 2]

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

        # Determine undertone
        if avg_b > 130:
            undertone = "warm"
        elif avg_b < 120:
            undertone = "cool"
        else:
            undertone = "neutral"

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
