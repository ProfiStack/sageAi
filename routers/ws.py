from fastapi import APIRouter, WebSocket

from controllers.websocket_controller import websocket_endpoint

router = APIRouter()


@router.websocket("/ws/{feature_type}/{user_id}")
async def ws_endpoint(websocket: WebSocket, user_id: str, feature_type: str):
    await websocket_endpoint(websocket, user_id, feature_type)
