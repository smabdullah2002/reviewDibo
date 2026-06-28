from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import products, reviews
from app.database import engine, Base
from app.base import api_router

# Base.metadata.create_all(bind=engine)

app = FastAPI(title="Product Review API", docs_url="/docs", redoc_url="/redoc")
app.include_router(api_router)


app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "docs": "/docs"}