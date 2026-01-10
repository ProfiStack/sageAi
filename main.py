import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, favourites, profile, user, health, ws, auth, static, payments
from routers.b2b import recommendation

app = FastAPI(
    title="SAGEE Skincare AI API",
    description="AI-powered skincare consultation API with WebSocket and REST endpoints",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(user.router, prefix="/api")
app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(static.router, prefix="/api")
app.include_router(payments.router, prefix="/api/payments")
app.include_router(favourites.router, prefix="/api")
app.include_router(recommendation.router, prefix="/api/b2b")
app.include_router(ws.router)

@app.get("/")
async def root():
    return {
        "service": "SAGEE Skincare AI API",
        "version": "1.0.0",
        "endpoints": {
            "chat": "POST /api/chat",
            "profile": "GET/POST /api/user/{user_id}/profile",
            "history": "GET/DELETE /api/user/{user_id}/history",
            "health": "GET /api/health"
        },
        "docs": "/docs",
        "redoc": "/redoc"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

