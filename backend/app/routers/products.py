from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Product, Review, User
from app.auth import get_current_admin
from app import schemas

router = APIRouter()

@router.get("/", response_model=list[schemas.ProductSummary], status_code=200)
def get_all_products(db: Session = Depends(get_db)):
    rows = db.query(
        Product,
        func.coalesce(func.avg(Review.rating), 0).label("avg_rating"),
        func.count(Review.id).label("review_count"),
    ).outerjoin(Review, Review.product_id == Product.id).group_by(Product.id).all()

    return [
        schemas.ProductSummary(
            id=prod.id,
            title=prod.title,
            description=prod.description,
            image_url=prod.image_url,
            average_rating=round(float(avg_rating), 2),
            review_count=review_count,
        )
        for prod, avg_rating, review_count in rows
    ]


@router.get("/{product_id}", response_model=schemas.ProductDetail, status_code=200)
def get_product_detail(product_id: int, db: Session = Depends(get_db)):
    row = db.query(
        Product,
        func.coalesce(func.avg(Review.rating), 0).label("avg_rating"),
        func.count(Review.id).label("review_count"),
    ).outerjoin(Review, Review.product_id == Product.id).filter(
        Product.id == product_id
    ).group_by(Product.id).first()

    if not row:
        raise HTTPException(status_code=404, detail="Product not found")

    product, avg_rating, review_count = row

    return schemas.ProductDetail(
        id=product.id,
        title=product.title,
        description=product.description,
        image_url=product.image_url,
        average_rating=round(float(avg_rating), 2),
        review_count=review_count,
        reviews=product.reviews,
    )


@router.post("/", response_model=schemas.ProductDetail, status_code=201)
def create_product(
    payload: schemas.ProductCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return schemas.ProductDetail(
        id=product.id,
        title=product.title,
        description=product.description,
        image_url=product.image_url,
        average_rating=0,
        review_count=0,
        reviews=[],
    )


@router.delete("/{product_id}", status_code=204)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return Response(status_code=204)

