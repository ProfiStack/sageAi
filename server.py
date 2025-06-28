# server.py - SAGEE Skincare AI API Server
import asyncio
import json
import uuid
from typing import Dict, List, Optional
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import uvicorn

# Initialize Ollama client
ollama = OpenAI(base_url='http://localhost:11434/v1', api_key='ollama')

# User session storage (in production, use Redis or database)
user_sessions: Dict[str, Dict] = {}

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        
        # Initialize user session if not exists
        if user_id not in user_sessions:
            user_sessions[user_id] = {
                "skin_type": "",
                "lifestyle": "", 
                "concern": "",
                "preferred_routine": "",
                "chat_history": [],
                "created_at": datetime.now().isoformat(),
                "last_active": datetime.now().isoformat()
            }

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        
        # Update last active time
        if user_id in user_sessions:
            user_sessions[user_id]["last_active"] = datetime.now().isoformat()

    async def send_message(self, message: dict, user_id: str):
        if user_id in self.active_connections:
            try:
                await self.active_connections[user_id].send_text(json.dumps(message))
                return True
            except:
                # Connection lost, remove it
                self.disconnect(user_id)
                return False
        return False

    def get_active_users(self):
        return list(self.active_connections.keys())

manager = ConnectionManager()

# Pydantic models for API
class ChatMessage(BaseModel):
    message: str
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    user_id: str
    timestamp: str

class UserProfile(BaseModel):
    skin_type: Optional[str] = None
    lifestyle: Optional[str] = None
    concern: Optional[str] = None
    preferred_routine: Optional[str] = None

class ProfileResponse(BaseModel):
    skin_type: str
    lifestyle: str
    concern: str
    preferred_routine: str
    created_at: str
    last_active: str

# Initialize FastAPI app
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🌟 SAGEE Skincare AI API Server starting...")
    print("🔌 WebSocket endpoint: ws://localhost:8000/ws/{user_id}")
    print("💬 Chat API: POST /api/chat")
    print("👤 Profile API: GET/POST /api/user/{user_id}/profile")
    print("📊 Health check: GET /api/health")
    yield
    print("🛑 SAGEE Server shutting down...")

app = FastAPI(
    title="SAGEE Skincare AI API",
    description="AI-powered skincare consultation API with WebSocket and REST endpoints",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_system_prompt(user_metrics: Dict) -> str:
    """Generate system prompt based on user metrics"""
    return f"""You are SAGEE, An AI Agent built for an App names SAGEE, This app helps users pick the best suited skincare products for their skin type and other metrics, You must give precise replies to the user, keeping the replies very
 The current users skin metrics are:
 Skin Type - Oily
 Lifestyle - Active Lifestyle
 Concern - Acne & Breakouts
 Prefered Routine - Balanced ( 3 - 4 Steps)"""


async def get_ai_response(message: str, user_id: str) -> str:
    """Get AI response from Ollama"""
    try:
        user_data = user_sessions.get(user_id, {})
        system_prompt = get_system_prompt(user_data)
        
        # Prepare chat history
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add recent chat history (last 10 messages to maintain context)
        chat_history = user_data.get('chat_history', [])[-10:]
        messages.extend(chat_history)
        
        # Add current message
        messages.append({"role": "user", "content": message})
        
        # Get response from Ollama
        response = ollama.chat.completions.create(
            model="llama3.2:1b",
            messages=messages,
            temperature=0.7,
            max_tokens=300
        )
        
        ai_response = response.choices[0].message.content
        
        # Update chat history
        if user_id not in user_sessions:
            user_sessions[user_id] = {
                "skin_type": "",
                "lifestyle": "",
                "concern": "", 
                "preferred_routine": "",
                "chat_history": [],
                "created_at": datetime.now().isoformat()
            }
        
        user_sessions[user_id]['chat_history'].extend([
            {"role": "user", "content": message},
            {"role": "Ai consultant", "content": ai_response}
        ])
        user_sessions[user_id]['last_active'] = datetime.now().isoformat()
        
        return ai_response
        
    except Exception as e:
        print(f"Error getting AI response: {e}")
        return "I'm sorry, I'm having trouble processing your request right now. Please try again."

# WebSocket endpoint
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    
    # Send welcome message
    welcome_msg = {
        "type": "message",
        "sender": "Ai consultant",
        "content": "Hello! I'm SAGEE, your AI skincare consultant. I can help you find the perfect skincare routine based on your skin profile. What would you like to know about skincare today?",
        "timestamp": datetime.now().isoformat()
    }
    await manager.send_message(welcome_msg, user_id)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            if message_data.get("type") == "message":
                user_message = message_data.get("content", "")
                
                # Send typing indicator
                typing_msg = {
                    "type": "typing",
                    "sender": "Ai consultant",
                    "content": "SAGEE is thinking...",
                    "timestamp": datetime.now().isoformat()
                }
                await manager.send_message(typing_msg, user_id)
                
                # Get AI response
                ai_response = await get_ai_response(user_message, user_id)
                
                # Send AI response
                response_msg = {
                    "type": "message",
                    "sender": "Ai consultant", 
                    "content": ai_response,
                    "timestamp": datetime.now().isoformat()
                }
                await manager.send_message(response_msg, user_id)
                
            elif message_data.get("type") == "update_profile":
                # Update user skin profile
                profile_data = message_data.get("data", {})
                if user_id in user_sessions:
                    allowed_fields = ['skin_type', 'lifestyle', 'concern', 'preferred_routine']
                    for field in allowed_fields:
                        if field in profile_data:
                            user_sessions[user_id][field] = profile_data[field]
                    
                # Send confirmation
                confirm_msg = {
                    "type": "profile_updated",
                    "content": "Your skin profile has been updated! I'll provide more personalized recommendations now.",
                    "timestamp": datetime.now().isoformat()
                }
                await manager.send_message(confirm_msg, user_id)
                
    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        print(f"WebSocket error for user {user_id}: {e}")
        manager.disconnect(user_id)

# REST API Endpoints


@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(chat_message: ChatMessage):
    """Send a chat message and get AI response"""
    user_id = chat_message.user_id or str(uuid.uuid4())
    
    try:
        ai_response = await get_ai_response(chat_message.message, user_id)
        
        return ChatResponse(
            response=ai_response,
            user_id=user_id,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")

@app.get("/api/user/{user_id}/profile", response_model=ProfileResponse)
async def get_user_profile(user_id: str):
    """Get user's skin profile"""
    if user_id not in user_sessions:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile = user_sessions[user_id]
    return ProfileResponse(
        skin_type=profile.get('skin_type', 'Unknown'),
        lifestyle=profile.get('lifestyle', 'Unknown'),
        concern=profile.get('concern', 'Unknown'),
        preferred_routine=profile.get('preferred_routine', 'Unknown'),
        created_at=profile.get('created_at', ''),
        last_active=profile.get('last_active', '')
    )

@app.post("/api/user/{user_id}/profile")
async def update_user_profile(user_id: str, profile: UserProfile):
    """Update user's skin profile"""
    if user_id not in user_sessions:
        user_sessions[user_id] = {
            "chat_history": [],
            "created_at": datetime.now().isoformat()
        }
    
    # Update profile data
    profile_dict = profile.dict(exclude_unset=True)
    user_sessions[user_id].update(profile_dict)
    user_sessions[user_id]['last_active'] = datetime.now().isoformat()
    
    return {"message": "Profile updated successfully", "user_id": user_id}

@app.get("/api/user/{user_id}/history")
async def get_chat_history(user_id: str, limit: int = 20):
    """Get user's chat history"""
    if user_id not in user_sessions:
        raise HTTPException(status_code=404, detail="User not found")
    
    chat_history = user_sessions[user_id].get('chat_history', [])
    return {
        "user_id": user_id,
        "history": chat_history[-limit:],
        "total_messages": len(chat_history)
    }

@app.delete("/api/user/{user_id}/history")
async def clear_chat_history(user_id: str):
    """Clear user's chat history"""
    if user_id not in user_sessions:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_sessions[user_id]['chat_history'] = []
    return {"message": "Chat history cleared", "user_id": user_id}

@app.get("/api/users")
async def get_all_users():
    """Get all users (admin endpoint)"""
    users = []
    for user_id, data in user_sessions.items():
        users.append({
            "user_id": user_id,
            "skin_type": data.get('skin_type'),
            "concern": data.get('concern'),
            "created_at": data.get('created_at'),
            "last_active": data.get('last_active'),
            "message_count": len(data.get('chat_history', [])),
            "is_connected": user_id in manager.active_connections
        })
    
    return {
        "total_users": len(users),
        "active_connections": len(manager.active_connections),
        "users": users
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test Ollama connection
        test_response = ollama.chat.completions.create(
            model="llama3.2:1b",
            messages=[{"role": "user", "content": "Hello"}],
            max_tokens=10
        )
        ollama_status = "connected"
        ollama_model = "llama3.2:1b"
    except Exception as e:
        ollama_status = f"disconnected: {str(e)}"
        ollama_model = "unknown"
    
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "ollama": {
            "status": ollama_status,
            "model": ollama_model
        },
        "stats": {
            "active_connections": len(manager.active_connections),
            "total_users": len(user_sessions),
            "active_users": manager.get_active_users()
        }
    }

@app.get("/")
async def root():
    """API information endpoint"""
    return {
        "service": "SAGEE Skincare AI API",
        "version": "1.0.0",
        "endpoints": {
            "chat": "POST /api/chat",
            "websocket": "WS /ws/{user_id}",
            "profile": "GET/POST /api/user/{user_id}/profile",
            "history": "GET/DELETE /api/user/{user_id}/history",
            "health": "GET /api/health"
        },
        "docs": "/docs",
        "redoc": "/redoc"
    }

if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )


# requirements.txt
"""
fastapi==0.104.1
uvicorn[standard]==0.24.0
websockets==12.0
openai==1.3.5
python-multipart==0.0.6
pydantic==2.5.0
"""

# Example usage and testing script - test_client.py
"""
import asyncio
import websockets
import json
import requests

# Test REST API
def test_chat_api():
    url = "http://localhost:8000/api/chat"
    
    payload = {
        "message": "What's the best skincare routine for oily skin with acne?",
        "user_id": "test_user_123"
    }
    
    response = requests.post(url, json=payload)
    print("Chat API Response:", response.json())

# Test WebSocket
async def test_websocket():
    uri = "ws://localhost:8000/ws/test_user_ws"
    
    async with websockets.connect(uri) as websocket:
        # Send a message
        message = {
            "type": "message",
            "content": "Hello SAGEE, recommend products for dry skin"
        }
        
        await websocket.send(json.dumps(message))
        
        # Listen for responses
        async for response in websocket:
            data = json.loads(response)
            print(f"WebSocket Response: {data}")
            if data.get('type') == 'message' and data.get('sender') == 'consultant':
                break

# Test profile update
def test_profile_api():
    user_id = "test_user_123"
    
    # Update profile
    profile_data = {
        "skin_type": "Dry",
        "lifestyle": "Office Worker",
        "concern": "Anti-Aging",
        "preferred_routine": "Comprehensive (5+ Steps)"
    }
    
    update_response = requests.post(f"http://localhost:8000/api/user/{user_id}/profile", json=profile_data)
    print("Profile Update:", update_response.json())
    
    # Get profile
    get_response = requests.get(f"http://localhost:8000/api/user/{user_id}/profile")
    print("Profile Get:", get_response.json())

if __name__ == "__main__":
    print("Testing SAGEE API...")
    test_chat_api()
    test_profile_api()
    # asyncio.run(test_websocket())
"""