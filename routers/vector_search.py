from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from database import get_db
import schemas, models
from typing import List
from utils.embeddings import get_text_embedding, get_image_embedding
from utils.faiss_store import search

router = APIRouter(prefix="/search/vector", tags=["vector-search"])

# --- Text-based search ---
@router.post("/text", response_model=List[schemas.SearchResult])
async def vector_search_text(payload: schemas.GenerateRequest, db: Session = Depends(get_db)):
    """
    Vector search with text query -> returns similar posts.
    """
    query_emb = get_text_embedding(payload.prompt)
    results = search(query_emb, k=5)

    # Fetch matching posts
    posts = []
    for r in results:
        post = db.query(models.Post).filter(models.Post.id == r["post_id"]).first()
        if post:
            posts.append(
                schemas.SearchResult(
                    id=post.id,
                    url=post.image_url,
                    title=post.title,
                    similarity=r["similarity"]
                )
            )
    return posts


# --- Image-based search ---
@router.post("/image", response_model=List[schemas.SearchResult])
async def vector_search_image(probe: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Vector search with uploaded image -> returns similar posts.
    """
    img_bytes = await probe.read()
    query_emb = get_image_embedding(img_bytes)
    results = search(query_emb, k=5)

    posts = []
    for r in results:
        post = db.query(models.Post).filter(models.Post.id == r["post_id"]).first()
        if post:
            posts.append(
                schemas.SearchResult(
                    id=post.id,
                    url=post.image_url,
                    title=post.title,
                    similarity=r["similarity"]
                )
            )
    return posts
