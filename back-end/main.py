from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models  # noqa: F401 — register SQLAlchemy models
from database import Base, config, engine
from routers import activities, admin, ai, auth, cultures, exploitations, predictions, soil_analyses, stats

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AgriIntelli API",
    description="Backend FastAPI + SQLAlchemy + PostgreSQL pour AgriIntelli",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.get("cors_origins", ["*"]),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(exploitations.router)
app.include_router(cultures.router)
app.include_router(activities.router)
app.include_router(soil_analyses.router)
app.include_router(predictions.router)
app.include_router(stats.router)
app.include_router(ai.router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "agriintelli-api"}
