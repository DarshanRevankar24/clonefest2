from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional, Dict

# --- IMPORTED: Enums from models ---
from models import PostPrivacy, UserRole

# =========================
# User Schemas
# =========================
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: UserRole = UserRole.visitor

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# =========================
# Authentication Schemas
# =========================
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None


# =========================
# Album Schemas
# =========================
class AlbumBase(BaseModel):
    name: str
    description: Optional[str] = None

class AlbumCreate(AlbumBase):
    pass

class Album(AlbumBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# =========================
# Tag Schemas
# =========================
class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class Tag(TagBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# =========================
# Comment Schemas
# =========================
class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    author: User
    post_id: int
    created_at: datetime
    is_approved: bool

    class Config:
        from_attributes = True


# =========================
# Post Schemas
# =========================
class PostBase(BaseModel):
    title: str
    caption: Optional[str] = None
    alt_text: Optional[str] = None
    license: Optional[str] = None
    privacy: PostPrivacy = PostPrivacy.public
    album_id: Optional[int] = None

class PostCreate(PostBase):
    image_url: str
    image_public_id: str
    tags: List[str] = []

class Post(PostBase):
    id: int
    author: User
    image_url: str
    album: Optional[Album] = None
    tags: List[Tag] = []
    comments: List[Comment] = []
    views: int
    likes_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# =========================
# Like Schemas
# =========================
class Like(BaseModel):
    id: int
    user: User
    post_id: int

    class Config:
        from_attributes = True


# =========================
# Palette Schemas
# =========================
class PaletteBase(BaseModel):
    name: str
    description: Optional[str] = None
    vars: Dict[str, str]  # CSS variables

class PaletteCreate(PaletteBase):
    pass

class Palette(PaletteBase):
    id: Optional[int] = None


# =========================
# Search Schemas
# =========================
class SearchResult(BaseModel):
    id: int
    url: str
    title: Optional[str] = None
    similarity: Optional[float] = None


# =========================
# AI Image Generation Schemas
# =========================
class GenerateRequest(BaseModel):
    prompt: str

class GenerateResponse(BaseModel):
    url: str
    prompt: str
    model: str


# =========================
# Admin Schemas
# =========================
class AdminStats(BaseModel):
    users: int
    images: int
    albums: int
