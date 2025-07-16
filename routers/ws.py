from typing import Annotated
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from datetime import datetime, timedelta
from routers.auth import get_current_user
from services.ai import manager, get_ai_response
from services.db_service import get_or_create_user_profile
from db import SessionLocal
from sqlalchemy.orm import Session
import asyncio
import json
import traceback

router = APIRouter()

user_dependency = Annotated[Session, Depends(get_current_user)]

@router.websocket("/ws/{feature_type}")
async def websocket_endpoint(user_db: user_dependency, websocket: WebSocket, user_id: str, feature_type: str):
    user_id = user_db.user_id
    # Initialize ping_task early to avoid UnboundLocalError
    ping_task = None
    
    # Initialize user profile first (before accepting connection)
    try:
        db = SessionLocal()
        get_or_create_user_profile(db, user_id)
    finally:
        db.close()

    try:
        # Accept connection with timeout
        await asyncio.wait_for(websocket.accept(), timeout=5.0)
        await manager.connect(user_id, feature_type, websocket)
        print(f"[CONNECTED] {user_id} for {feature_type}")

        ping_task = asyncio.create_task(ping_loop(user_id, websocket))

        while True:
            try:
                data = await websocket.receive_text()
                message_data = json.loads(data)
                
                if message_data.get("type") != "message":
                    await manager.send_message(
                        {"type": "error", "content": "Unsupported message type."}, 
                        user_id,
                        feature_type
                    )
                    continue

                user_message = message_data.get("content", "")

                # Send typing indicator
                typing_msg = {
                    "type": "typing",
                    "sender": "Consultant",
                    "content": "SAGEE is thinking...",
                    "timestamp": datetime.utcnow().isoformat(),
                }
                await manager.send_message(typing_msg, user_id, feature_type)

                await asyncio.sleep(0.5)

                # Get AI response
                ai_response = await get_ai_response(feature_type, user_message, user_id)

                response_msg = {
                    "type": "message",
                    "sender": "Consultant",
                    "content": ai_response,
                    "timestamp": datetime.utcnow().isoformat(),
                }
                await manager.send_message(response_msg, user_id, feature_type)

            except (RuntimeError, ConnectionResetError) as e:
                if "not connected" in str(e):
                    print(f"Connection lost for {user_id}, reconnecting...")
                    await websocket.accept()
                    continue
                raise

    except asyncio.TimeoutError:
        print(f"Connection timeout for {user_id}")
    except WebSocketDisconnect:
        print(f"[DISCONNECTED] {user_id}")
    except Exception as e:
        print(f"[ERROR] WebSocket error for {user_id}: {e}")
        traceback.print_exc()
    finally:
        if ping_task and not ping_task.done():
            ping_task.cancel()
        manager.disconnect(user_id, feature_type)

async def ping_loop(user_id: str, websocket: WebSocket):
    try:
        while True:
            await asyncio.sleep(30)
            await websocket.send_json({"type": "ping"})
    except Exception:
        pass
