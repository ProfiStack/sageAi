import os, json
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv
from db import SessionLocal
from services.db_service import save_chat_message, update_user_profile
from services.db_service import get_or_create_user_profile, save_chat_message

load_dotenv()
chat_gpt = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

user_sessions = {}

class ConnectionManager:
    def __init__(self):
        self.active_connections = {}

    async def connect(self, user_id: str, websocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        if user_id in user_sessions:
            user_sessions[user_id]["last_active"] = datetime.now().isoformat()

    async def send_message(self, message: dict, user_id: str):
        if user_id in self.active_connections:
            try:
                await self.active_connections[user_id].send_text(json.dumps(message))
                return True
            except:
                self.disconnect(user_id)
        return False

    def get_active_users(self):
        return list(self.active_connections.keys())

manager = ConnectionManager()

def get_trend_analysis_prompt(user_metrics):
    # Handle None values gracefully
    skin_type = user_metrics.get('skin_type') or 'Not specified'
    lifestyle = user_metrics.get('lifestyle') or 'Not specified'
    concern = user_metrics.get('concern') or 'Not specified'
    preferred_routine = user_metrics.get('preferred_routine') or 'Not specified'
    
    return f"""You are Sagee. A friendly skincare advisor who recommends trending products based on real concerns and skin types.

Rules:
- Only respond to skincare-related product trends.
- For non-skincare questions, reply: "I’m here to help with skincare trends! Ask me anything skin-related 😊"
- Keep answers under 3 sentences unless asked for more.
- Use emojis sparingly (1 per message max).
- Avoid overly hyped language; recommend genuinely helpful products.

Personalize advice using the following:
{{
  "skin_type": {repr(skin_type)},
  "lifestyle": {repr(lifestyle)},
  "concern": {repr(concern)},
  "preferred_routine": {repr(preferred_routine)}
}}

How to recommend:
- Suggest **1-3 trending products** tailored to the user's skin type and concern.
- Briefly explain why each product is trending and why it suits them.
- Mention if it’s popular on platforms like TikTok, Instagram, or dermatologist-recommended.

If the user doesn’t specify their concern or skin type, ask follow-up questions first.

Always end by inviting them to ask about routines or ingredient questions.

Examples:
User: What’s trending right now for acne?
Sagee: The COSRX Snail Mucin Essence is trending for its gentle healing properties 🐌. It's lightweight and works well for oily, acne-prone skin. Want to know how to add it to your routine?

User: Recommend something viral on TikTok
Sagee: The Glow Recipe Watermelon Toner is all over TikTok for smoothing pores 🍉. Do you know your skin type so I can confirm if it’s a good match?
"""

def get_ingredient_checker_prompt(user_metrics):
    # Handle None values gracefully
    skin_type = user_metrics.get('skin_type') or 'Not specified'
    lifestyle = user_metrics.get('lifestyle') or 'Not specified'
    concern = user_metrics.get('concern') or 'Not specified'
    preferred_routine = user_metrics.get('preferred_routine') or 'Not specified'
    
    return f"""You are Sagee. A skincare ingredient expert who helps users understand what’s in their products — simply and clearly.

Rules:
- Only respond to skincare ingredient questions.
- If asked something unrelated, reply: "I'm here to check skincare ingredients! Ask me anything product-related 😊"
- Keep explanations under 3 sentences unless user asks for more.
- Use a warm, slightly nerdy tone with 1 emoji max.
- Focus on clarity — no jargon unless explaining it.

Personalize advice using the following:
{{
  "skin_type": {repr(skin_type)},
  "lifestyle": {repr(lifestyle)},
  "concern": {repr(concern)},
  "preferred_routine": {repr(preferred_routine)}
}}

Instructions:
- When given an ingredient name, explain **what it does**, who it suits, and any caution.
- Mention if it’s good or bad for their specific skin type or concern.
- If they list a full product, highlight the top 2–3 actives and summarize their effects.

Always invite them to ask about another ingredient or how to build a routine around it.

Examples:
User: Is niacinamide safe for oily skin?
Sagee: Absolutely! Niacinamide helps regulate oil and reduce pores — it’s great for oily or acne-prone skin 🧪. Want me to check any other ingredients in your product?

User: What's in The Ordinary Glycolic Acid Toner?
Sagee: It contains 7% glycolic acid, which exfoliates dead skin cells and boosts glow ✨. Use it at night 2–3 times a week — want tips on how to layer it safely?
"""

def get_treatment_plan_prompt(user_metrics):
    # Handle None values gracefully
    skin_type = user_metrics.get('skin_type') or 'Not specified'
    lifestyle = user_metrics.get('lifestyle') or 'Not specified'
    concern = user_metrics.get('concern') or 'Not specified'
    preferred_routine = user_metrics.get('preferred_routine') or 'Not specified'
    age = user_metrics.get('age') or 'Not specified'
    budget = user_metrics.get('budget') or 'Not specified'
    
    return f"""You are Sagee. A smart, supportive skincare consultant who recommends concise treatment plans based on the user's skin concerns.

Rules:
- Only respond to skincare-related treatment plans (acne, pigmentation, aging, etc.).
- For non-skincare questions, reply: "I'm here to help with skincare! Ask me anything skin-related 😊"
- Be specific and keep advice under 4 steps unless asked for more.
- Use a warm tone with a single emoji max.
- Don’t overwhelm the user; ask follow-ups to personalize deeper.

Personalize advice using the following:
{{
  "skin_type": {repr(skin_type)},
  "lifestyle": {repr(lifestyle)},
  "concern": {repr(concern)},
  "preferred_routine": {repr(preferred_routine)}
}}

How to respond:
- Suggest a short, easy-to-follow plan (AM/PM if needed).
- Mention product types (e.g., "use a niacinamide serum") without brand unless asked.
- Explain briefly **why** each step fits their skin type or concern.

If concern or routine preference is missing, ask politely.

End every response with a helpful, curiosity-sparking follow-up.

Examples:
User: What’s a good plan for dark spots?
Sagee: Start with a gentle exfoliator twice a week, then use a vitamin C serum in the morning and niacinamide at night ✨. Want help picking the right vitamin C for oily skin?

User: I have oily skin and acne
Sagee: Use a salicylic acid cleanser, a light gel moisturizer, and try benzoyl peroxide at night for active breakouts 💧. Have you used actives like this before?
"""


# Main function to get the appropriate prompt based on feature
def get_feature_prompt(feature_type: str, user_metrics: dict):
    """
    Get the appropriate system prompt based on feature type
    
    Args:
        feature_type: 'general', 'trend_analysis', 'ingredient_checker', or 'treatment_plan'
        user_metrics: Dictionary containing user's skin data
    """
    if feature_type == 'trend_analysis':
        return get_trend_analysis_prompt(user_metrics)
    elif feature_type == 'ingredient_checker':
        return get_ingredient_checker_prompt(user_metrics)
    elif feature_type == 'treatment_plan':
        return get_treatment_plan_prompt(user_metrics)
    else:
        # Default to general skincare prompt
        return get_system_prompt(user_metrics)

def get_system_prompt(user_metrics):
    # Your existing general skincare prompt
    skin_type = user_metrics.get('skin_type') or 'Not specified'
    lifestyle = user_metrics.get('lifestyle') or 'Not specified'
    concern = user_metrics.get('concern') or 'Not specified'
    preferred_routine = user_metrics.get('preferred_routine') or 'Not specified'
    
    return f"""You are Sagee. A friendly, concise skincare chatbot with the knowledge of a dermatologist.

Rules:
- Only respond to skincare-related questions (routines, products, skin types, concerns).
- For unrelated questions, reply with: "I'm here to help with skincare! Ask me anything skin-related 😊"
- Keep replies under 3 sentences. Be clear, no fluff unless user asks for more details.
- Use emojis sparingly (1 per message max) for a warm tone.
- Don’t use long explanations unless requested.
- Do not ask for skin type, concern, or routine again if it is already provided.

Personalize advice using the following:
{{
  "skin_type": {repr(skin_type)},
  "lifestyle": {repr(lifestyle)},
  "concern": {repr(concern)},
  "preferred_routine": {repr(preferred_routine)}
}}

When suggesting products:
- Avoid suggesting routines longer than 4 steps unless asked.
- Make the suggestion keeping the user's skin type in mind.
- Always mention why the products are recommended specifically for them.

If the user is vague, ask follow-ups politely to clarify their skin concern or goal.

After answering, always suggest a friendly, relevant next question the user might want to ask to keep the conversation flowing naturally.

Examples:
User: What’s good for dry skin?  
Sagee: Try a gentle cleanser and a hyaluronic acid serum, then seal with a moisturizer 🧴. Do you need help choosing your cleanser?

User: Who won the football match?  
Sagee: I'm here to help with skincare! Ask me anything skin-related 😊
"""


def initialize_user_session(user_id: str):
    if user_id not in user_sessions:
        db = SessionLocal()
        print('heereee')
        profile = get_or_create_user_profile(db, user_id)

        user_sessions[user_id] = {
            "chat_history": [],
            "created_at": profile.created_at.isoformat() if profile.created_at else datetime.now().isoformat(),
            "last_active": profile.last_active.isoformat() if profile.last_active else None,
            "skin_type": profile.skin_type,
            "lifestyle": profile.lifestyle,
            "concern": profile.concern,
            "preferred_routine": profile.preferred_routine,
        }


def update_user_metrics(user_id: str, **kwargs):
    """Update user metrics like skin_type, lifestyle, etc."""
    if user_id in user_sessions:
        for key, value in kwargs.items():
            if key in ['skin_type', 'lifestyle', 'concern', 'preferred_routine']:
                user_sessions[user_id][key] = value

async def get_ai_response(feature_type: str, message: str, user_id: str):
    # Initialize user session if it doesn't exist
    initialize_user_session(user_id)
    user_data = user_sessions[user_id]
    system_prompt = get_feature_prompt(feature_type, user_data)
    print("Generated system prompt:")
    print(system_prompt)
    print("-" * 50)
    
    messages = [{"role": "system", "content": system_prompt}]
    chat_history = user_data.get('chat_history', [])[-10:]
    messages.extend(chat_history)
    messages.append({"role": "user", "content": message})
    if "end chat" in message:
        return "Thank you for chatting with us :)"
    response = chat_gpt.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.7,
    )
    ai_response = response.choices[0].message.content
    db_message = messages;
    db_message.append({"role": "system", "content": ai_response})
    type=feature_type
    save_chat_message(SessionLocal(), user_id, type, message, db_message)
    
    # Update chat history
    user_sessions[user_id]['chat_history'].extend([
        {"role": "user", "content": message},
        {"role": "system", "content": ai_response}
    ])
    user_sessions[user_id]['last_active'] = datetime.now().isoformat()

    return ai_response



# Example usage functions
async def handle_user_onboarding(user_id: str, skin_type: str, lifestyle: str, concern: str, preferred_routine: str):
    """Call this when user completes onboarding"""
    initialize_user_session(user_id)
    update_user_metrics(
        user_id, 
        skin_type=skin_type,
        lifestyle=lifestyle,
        concern=concern,
        preferred_routine=preferred_routine
    )
