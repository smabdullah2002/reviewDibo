from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Product, Review, User
from app.auth import get_current_user
from app import schemas

router = APIRouter()


@router.post("/", response_model=schemas.ReviewResponse)
def create_review(
    review: schemas.ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not 1 <= review.rating <= 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    existing = db.query(Review).filter(
        Review.user_id == current_user.id,
        Review.product_id == review.product_id,
    ).first()

    if existing:
        existing.rating = review.rating
        existing.comment = review.comment
        db.commit()
        db.refresh(existing)
        return existing

    db_review = Review(user_id=current_user.id, **review.model_dump())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@router.put("/{review_id}", response_model=schemas.ReviewResponse, status_code=200)
def update_review(
    review_id: int,
    review: schemas.ReviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")

    if db_review.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to update this review")

    if review.rating is not None and not 1 <= review.rating <= 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    db_review.rating = review.rating if review.rating is not None else db_review.rating
    db_review.comment = review.comment if review.comment is not None else db_review.comment

    db.commit()
    db.refresh(db_review)
    return db_review


@router.delete("/{review_id}", status_code=204)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")

    if db_review.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this review")

    db.delete(db_review)
    db.commit()
    return Response(status_code=204)