from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/stats", response_model=schemas.AdminStats)
def stats(db: Session = Depends(get_db)):
    """
    Admin stats: counts users, images/posts, and albums.
    """
    users_count = db.query(models.User).count()
    posts_count = db.query(models.Post).count()
    albums_count = db.query(models.Album).count()

    return schemas.AdminStats(
        users=users_count,
        images=posts_count,   # using Post for images since you renamed Blog → Post
        albums=albums_count
    )
