from fastapi import APIRouter
from typing import List
import schemas

router = APIRouter(prefix="/palettes", tags=["palettes"])

# In-memory storage (replace with DB in future)
palettes: List[schemas.Palette] = []

@router.get("/", response_model=List[schemas.Palette])
def list_palettes():
    """
    Get all saved palettes.
    """
    return palettes

@router.post("/", response_model=schemas.Palette)
def save_palette(p: schemas.PaletteCreate):
    """
    Save a new palette (theming).
    """
    palette = schemas.Palette(**p.dict(), id=len(palettes) + 1)
    palettes.append(palette)
    return palette
