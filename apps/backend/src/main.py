from fastapi import FastAPI
from src.db.database import init_db
from src.routers.sources import router as sources_router

app = FastAPI(title="OpenLense Backend")
app.include_router(sources_router)


@app.on_event("startup")
async def on_startup():
    init_db()
    print("Database initialized")


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}
