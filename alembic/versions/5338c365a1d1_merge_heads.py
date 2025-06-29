"""Merge heads

Revision ID: 5338c365a1d1
Revises: f404a59b22bb, ef5227ac97b0
Create Date: 2025-06-29 16:47:35.655207

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5338c365a1d1'
down_revision: Union[str, Sequence[str], None] = ('f404a59b22bb', 'ef5227ac97b0')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
