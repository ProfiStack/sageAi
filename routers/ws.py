from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from datetime import datetime
from services.ai import manager, get_ai_response, user_sessions
import json

router = APIRouter()


@router.websocket("/ws/{feature_type}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str, feature_type: str):
    await manager.connect(user_id, websocket)  # This now does accept()
    print(feature_type, '*****************');
    welcome_msg = {
        "type": "message",
        "sender": "Consultant",
        "content": "Welcome to SAGEE skincare chat!",
        "timestamp": datetime.now().isoformat(),
    }
    await manager.send_message(welcome_msg, user_id)

    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)

            if message_data.get("type") == "message":
                user_message = message_data.get("content", "")

                typing_msg = {
                    "type": "typing",
                    "sender": "Consultant",
                    "content": "SAGEE is thinking...",
                    "timestamp": datetime.now().isoformat(),
                }
                await manager.send_message(typing_msg, user_id)

                ai_response = await get_ai_response(feature_type, user_message, user_id)

                response_msg = {
                    "type": "message",
                    "sender": "Consultant",
                    "content": ai_response,
                    "timestamp": datetime.now().isoformat(),
                }
                await manager.send_message(response_msg, user_id)

    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(user_id)
