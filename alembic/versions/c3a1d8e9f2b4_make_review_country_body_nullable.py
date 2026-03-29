"""make_review_country_body_nullable

Revision ID: c3a1d8e9f2b4
Revises: f9107ebc88dc
Create Date: 2026-03-15 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c3a1d8e9f2b4'
down_revision: Union[str, None] = 'f9107ebc88dc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Make reviewer_country and body optional — country is no longer collected
    # from users via the frontend review form.
    op.alter_column('reviews', 'reviewer_country',
                    existing_type=sa.String(),
                    nullable=True)
    op.alter_column('reviews', 'body',
                    existing_type=sa.TEXT(),
                    nullable=True)


def downgrade() -> None:
    # Revert: fill any NULLs first to avoid constraint violation on rollback
    op.execute("UPDATE reviews SET body = '' WHERE body IS NULL")
    op.execute("UPDATE reviews SET reviewer_country = 'Unknown' WHERE reviewer_country IS NULL")

    op.alter_column('reviews', 'body',
                    existing_type=sa.TEXT(),
                    nullable=False)
    op.alter_column('reviews', 'reviewer_country',
                    existing_type=sa.String(),
                    nullable=False)
