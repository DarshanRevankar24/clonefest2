# models.py

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Table, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

# --- New Enum for Post Privacy ---
class PostPrivacy(str, enum.Enum):
    public = "public"
    unlisted = "unlisted"
    private = "private"

# --- New Enum for User Roles ---
class UserRole(str, enum.Enum):
    admin = "admin"
    editor = "editor"
    visitor = "visitor"

# --- New Enum for Content Type ---
class ContentType(str, enum.Enum):
    image = "image"
    video = "video"
    audio = "audio"

# Association table for many-to-many relationship between posts and tags
post_tags = Table(
    'post_tags', Base.metadata,
    Column('post_id', Integer, ForeignKey('posts.id')),
    Column('tag_id', Integer, ForeignKey('tags.id'))
)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
    role = Column(Enum(UserRole), default=UserRole.visitor)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # --- NEW: Additional user fields ---
    avatar_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    
    # Relationships
    posts = relationship("Post", back_populates="author")
    comments = relationship("Comment", back_populates="author")
    likes = relationship("Like", back_populates="user")

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    caption = Column(Text, nullable=True)
    alt_text = Column(String(255), nullable=True)
    
    # Cloudinary integration
    image_url = Column(String(500), nullable=False)
    image_public_id = Column(String(255), nullable=False)
    
    # --- NEW: Content type and metadata ---
    content_type = Column(Enum(ContentType), default=ContentType.image)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    file_size = Column(Integer, nullable=True)
    
    # Hackathon requirements
    license = Column(String(100), nullable=True)
    privacy = Column(Enum(PostPrivacy), default=PostPrivacy.public)
    
    # Engagement metrics
    views = Column(Integer, default=0)
    # --- NEW: Additional engagement metrics ---
    like_count = Column(Integer, default=0)
    download_count = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign keys
    author_id = Column(Integer, ForeignKey("users.id"))
    album_id = Column(Integer, ForeignKey("albums.id"), nullable=True)
    
    # Relationships
    author = relationship("User", back_populates="posts")
    album = relationship("Album", back_populates="posts")
    comments = relationship("Comment", back_populates="post")
    tags = relationship("Tag", secondary=post_tags, back_populates="posts")
    likes = relationship("Like", back_populates="post")
    
    # --- NEW: Vector search embeddings ---
    title_embedding = Column(Text, nullable=True)
    caption_embedding = Column(Text, nullable=True)

class Album(Base):
    __tablename__ = "albums"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # --- NEW: Album privacy and cover photo ---
    is_public = Column(Boolean, default=True)
    cover_photo_id = Column(Integer, ForeignKey("posts.id"), nullable=True)
    
    # Relationships
    posts = relationship("Post", back_populates="album")
    cover_photo = relationship("Post", foreign_keys=[cover_photo_id])

class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    posts = relationship("Post", secondary=post_tags, back_populates="tags")
    
    # --- NEW: Tag embedding for search ---
    name_embedding = Column(Text, nullable=True)

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_approved = Column(Boolean, default=True)
    
    # Foreign keys
    author_id = Column(Integer, ForeignKey("users.id"))
    post_id = Column(Integer, ForeignKey("posts.id"))
    parent_comment_id = Column(Integer, ForeignKey("comments.id"), nullable=True)
    
    # Relationships
    author = relationship("User", back_populates="comments")
    post = relationship("Post", back_populates="comments")
    replies = relationship("Comment", backref="parent", remote_side=[id])
    
    # --- NEW: Comment embedding for search ---
    content_embedding = Column(Text, nullable=True)

class Like(Base):
    __tablename__ = "likes"
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"))
    post_id = Column(Integer, ForeignKey("posts.id"))
    
    # Relationships
    user = relationship("User", back_populates="likes")
    post = relationship("Post", back_populates="likes")

# --- NEW: Search History Model ---
class SearchHistory(Base):
    __tablename__ = "search_history"
    
    id = Column(Integer, primary_key=True, index=True)
    query = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relationships
    user = relationship("User")
    
    # --- NEW: Search query embedding ---
    query_embedding = Column(Text, nullable=True)

# --- NEW: Download History Model ---
class DownloadHistory(Base):
    __tablename__ = "download_history"
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    
    # Relationships
    user = relationship("User")
    post = relationship("Post")