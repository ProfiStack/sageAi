"""add gender and location to user profiles

Revision ID: add_gender_location_fields
Revises: ef5227ac97b0
Create Date: 2025-01-27 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'add_gender_location_fields'
down_revision: Union[str, Sequence[str], None] = 'ef5227ac97b0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add gender and location columns to user_profiles table
    op.add_column('user_profiles', sa.Column('location', sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    # Remove gender and location columns from user_profiles table
    op.drop_column('user_profiles', 'location')
