from fastapi import APIRouter
from app.routers import products, reviews, auth

api_router = APIRouter()

api_router.include_router(auth.router,       prefix="/api/auth",     tags=["auth"])
api_router.include_router(products.router,    prefix="/api/products", tags=["products"])
api_router.include_router(reviews.router,     prefix="/api/reviews",  tags=["reviews"])
