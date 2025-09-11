from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from typing import List

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/", response_model=List[schemas.Post])
def search(q: str = "", album: str = "", db: Session = Depends(get_db)):
    """
    Search posts (images) by keyword and/or album name.
    """
    query = db.query(models.Post)

    if q:
        # search in title OR caption
        query = query.filter(
            (models.Post.title.ilike(f"%{q}%")) |
            (models.Post.caption.ilike(f"%{q}%"))
        )

    if album:
        query = query.join(models.Album).filter(models.Album.name.ilike(f"%{album}%"))

    results = query.all()
    return results
