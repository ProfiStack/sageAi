"""create hashed_password field

Revision ID: d891a6fae132
Revises: e96fcde58f43
Create Date: 2025-07-16 17:53:33.763221

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd891a6fae132'
down_revision: Union[str, Sequence[str], None] = 'e96fcde58f43'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('user_profiles', sa.Column('hashed_password',sa.String(length=255), default=''));


def downgrade() -> None:
    op.drop_column('users_profiles', 'hashed_password');
    pass
