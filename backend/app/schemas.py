from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserResponse(BaseModel):
    id:         int
    name:       str
    email:      str
    is_admin:   bool

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class UserRef(BaseModel):
    id: int
    name: str
    model_config = {"from_attributes": True}


class ReviewCreate(BaseModel):
    product_id: int
    rating: int
    comment: Optional[str] = None


class ReviewUpdate(BaseModel):
    rating: Optional[int] = None
    comment: Optional[str] = None

class ReviewResponse(BaseModel):
    id:         int
    product_id: int
    user_id:    int
    rating:     int
    comment:    Optional[str] = None
    created_at: datetime
    user:       UserRef

    model_config = {"from_attributes": True}


class ProductSummary(BaseModel):
    id:             int
    title:          str
    description:    Optional[str]
    image_url:      Optional[str]
    average_rating: float
    review_count:   int

    model_config = {"from_attributes": True}


class ProductCreate(BaseModel):
    title:       str
    description: Optional[str] = None
    image_url:   Optional[str] = None


class ProductDetail(BaseModel):
    id:             int
    title:          str
    description:    Optional[str] = None
    image_url:      Optional[str] = None
    average_rating: float
    review_count:   int
    reviews:        list[ReviewResponse]

    model_config = {"from_attributes": True}