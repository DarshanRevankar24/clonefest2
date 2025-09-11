from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

# --- DB + models ---
import models
from database import engine, Base

# --- Routers ---
from routers import auth, posts, comments, images, albums
from routers import search, vector_search, generate, palettes, admin  # ✅ new

# Logging setup
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Startup / shutdown lifecycle ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Application startup...")
    async with engine.begin() as conn:
        # Auto-create database tables
        await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created/verified.")
    yield
    logger.info("Application shutdown...")

# Initialize FastAPI
app = FastAPI(
    title="CloneFest 2025 - Image Gallery API",
    description="A modern, extensible media platform API.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ restrict to frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Register routers ---
logger.info("Registering routers...")
app.include_router(auth.router)
app.include_router(posts.router)
app.include_router(comments.router)
app.include_router(images.router)
app.include_router(albums.router)

# ✅ new feature routers
app.include_router(search.router)
app.include_router(vector_search.router)
app.include_router(generate.router)
app.include_router(palettes.router)
app.include_router(admin.router)

logger.info("Routers registered successfully.")

# Health check
@app.get("/", tags=["Health Check"])
def read_root():
    return {
        "message": "Image Gallery API is running",
        "status": "healthy",
        "docs_url": "/docs"
    }
