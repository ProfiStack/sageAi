import os
import asyncio
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv
import anthropic

from core.database import SessionLocal
from repositories.chat_repository import get_user_session_data, save_chat_message
from prompts.alternative import get_alternate
from prompts.hair_care import get_hair_care_checker_prompt
from prompts.makeup import get_makeup_checker_prompt
from prompts.nutrition import get_nutrition_checker_prompt
from prompts.styling import get_styling_checker_prompt
from prompts.perplexity import get_perplexity_prompt
from prompts.wellness import get_wellness_checker_prompt
from prompts.ingredients import get_ingredient_checker_prompt
from prompts.skin_care import get_skincare_prompt
from prompts.trend_analysis import get_trend_analysis_prompt
from prompts.treatment import get_treatment_plan_prompt

load_dotenv()
claude = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
executor = ThreadPoolExecutor()


def format_title(text: str) -> str:
    return text.replace("_", " ").title()


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
                import subprocess
                import sys
                subprocess.run(
                    [sys.executable, "-m", "pip", "uninstall", "opencv-python", "-y"],
                    capture_output=True,
                )
                subprocess.run(
                    [sys.executable, "-m", "pip", "install", "opencv-python-headless==4.12.0.88"],
                    capture_output=True,
                )
                import cv2
                print("✅ Successfully switched to opencv-python-headless")
                return cv2
            except Exception as install_error:
                print(f"❌ Failed to install headless version: {install_error}")
        print("⚠️ OpenCV not available - image analysis will be disabled")
        return None


cv2 = safe_import_cv2()


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
        elif feature_type in ("meal_muse", "nutri_guide", "supp_smart"):
            chat_title = format_title(feature_type)
            return get_nutrition_checker_prompt(user_metrics, chat_title)
        elif feature_type in (
            "fit_flow", "manifest_mode", "positivity_pulse",
            "self_spark", "stress_reset", "wellness_whisper", "zen_zone",
        ):
            chat_title = format_title(feature_type)
            return get_wellness_checker_prompt(user_metrics, chat_title)
        elif feature_type in ("formula_focus", "hair_decode", "style_spark", "tress_therapy"):
            chat_title = format_title(feature_type)
            return get_hair_care_checker_prompt(user_metrics, chat_title)
        elif feature_type in ("event_edit", "fashion_fix", "shop_smart"):
            chat_title = format_title(feature_type)
            return get_styling_checker_prompt(user_metrics, chat_title)
        elif feature_type in (
            "beauty_breakdown", "beauty_brief", "event_glam",
            "flawless_factor", "perfect_pair", "true_tone",
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
        chat_history = user_data.get("chat_history", [])[-10:]

        # Build messages — Claude only accepts user/assistant roles
        history_messages = [
            {
                "role": "assistant" if m["role"] == "system" else m["role"],
                "content": m["content"],
            }
            for m in chat_history
            if m["role"] in ("user", "assistant", "system")
        ]
        history_messages.append({"role": "user", "content": message})

        if "end chat" in message.lower():
            return "Thank you for chatting with us :)"

        try:
            response = await asyncio.get_event_loop().run_in_executor(
                executor,
                lambda: claude.messages.create(
                    model="claude-opus-4-6",
                    system=system_prompt,
                    messages=history_messages,
                    max_tokens=2048,
                    temperature=0.7,
                ),
            )
            ai_response = response.content[0].text
        except Exception as e:
            print(f"[Claude] API call failed: {e}")
            return "Sorry! I had trouble generating a response. Please try again in a moment."

        # Save conversation to DB using a fresh session
        db2 = SessionLocal()
        try:
            db_message = history_messages.copy()
            db_message.append({"role": "assistant", "content": ai_response})
            save_chat_message(db2, user_id, feature_type, message, db_message)
        finally:
            db2.close()

        return ai_response
    except Exception as outer_err:
        print(f"[get_ai_response] Fatal error: {outer_err}")
        return "Oops! Something went wrong. Please try again later."
