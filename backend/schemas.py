from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID

class IntentResponse(BaseModel):
    action: str
    target: str

class BlogPostCreate(BaseModel):
    title: str
    content: str
    summary: Optional[str] = None
    author: str

class BlogPostRead(BaseModel):
    id: UUID
    date: datetime
    title: str
    content: str
    summary: Optional[str]
    author: str

    model_config = ConfigDict(from_attributes=True)