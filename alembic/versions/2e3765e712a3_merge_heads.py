"""merge heads

Revision ID: 2e3765e712a3
Revises: a1b8e8ad2f01, add_gender_location_fields
Create Date: 2025-06-29 18:00:03.074264

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2e3765e712a3'
down_revision: Union[str, Sequence[str], None] = ('a1b8e8ad2f01', 'add_gender_location_fields')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
