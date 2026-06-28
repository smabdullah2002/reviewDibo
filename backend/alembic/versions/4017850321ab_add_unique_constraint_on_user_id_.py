"""add unique constraint on user_id product_id in reviews

Revision ID: 4017850321ab
Revises: cf5bbdef0fcf
Create Date: 2026-06-28 23:03:56.501519

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4017850321ab'
down_revision: Union[str, Sequence[str], None] = 'cf5bbdef0fcf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_unique_constraint("uq_review_user_product", "reviews", ["user_id", "product_id"])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint("uq_review_user_product", "reviews", type_="unique")
