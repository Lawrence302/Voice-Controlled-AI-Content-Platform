import uuid
from sqlalchemy import UUID, Column, Integer, String, Text, TIMESTAMP, func
from sqlalchemy.orm import declarative_base
from database import Base
# Base = declarative_base()

class Author(Base):
    __tablename__ = "authors"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)

class BlogPost(Base):
    __tablename__ = "blogposts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    view_id = Column(Integer, unique=True, autoincrement=True, index=True)
    date = Column(TIMESTAMP, nullable=False, server_default=func.now())
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    summary = Column(Text)
    author = Column(String(100), nullable=False)
