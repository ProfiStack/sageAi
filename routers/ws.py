from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from datetime import datetime
from services.ai import manager, get_ai_response
from services.db_service import get_or_create_user_profile
from db import SessionLocal
import asyncio
import json
import traceback

router = APIRouter()

@router.websocket("/ws/{feature_type}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str, feature_type: str):
    await manager.connect(user_id, websocket)
    print(f"[CONNECTED] {user_id}")

    try:
        db = SessionLocal()
        # Ensure user profile exists in DB
        get_or_create_user_profile(db, user_id)

        while True:
            try:
                data = await websocket.receive_text()
                message_data = json.loads(data)

                if message_data.get("type") != "message":
                    await manager.send_message({
                        "type": "error",
                        "content": "Unsupported message type."
                    }, user_id)
                    continue

                user_message = message_data.get("content", "")

                typing_msg = {
                    "type": "typing",
                    "sender": "Consultant",
                    "content": "SAGEE is thinking...",
                    "timestamp": datetime.now().isoformat(),
                }
                await manager.send_message(typing_msg, user_id)

                await asyncio.sleep(0.5)  # Optional delay for realism

                ai_response = await get_ai_response(feature_type, user_message, user_id)

                response_msg = {
                    "type": "message",
                    "sender": "Consultant",
                    "content": ai_response,
                    "timestamp": datetime.now().isoformat(),
                }
                await manager.send_message(response_msg, user_id)

            except json.JSONDecodeError:
                await manager.send_message({
                    "type": "error",
                    "content": "Invalid message format. Please send valid JSON."
                }, user_id)

    except WebSocketDisconnect:
        print(f"[DISCONNECTED] {user_id}")
        manager.disconnect(user_id)

    except Exception as e:
        print(f"[ERROR] WebSocket error for {user_id}: {e}")
        traceback.print_exc()
        manager.disconnect(user_id)
