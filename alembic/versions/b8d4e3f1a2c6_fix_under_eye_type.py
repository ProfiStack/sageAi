"""fix_under_eye_type

Changes b2b_face_scans.under_eye from Float to String — the skin analyzer
returns a string value (e.g. "none", "mild", "moderate", "severe").

Revision ID: b8d4e3f1a2c6
Revises: a3c9f1e2b5d7
Create Date: 2026-03-11 00:01:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'b8d4e3f1a2c6'
down_revision: Union[str, Sequence[str], None] = 'a3c9f1e2b5d7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        'b2b_face_scans',
        'under_eye',
        existing_type=sa.Float(),
        type_=sa.String(),
        existing_nullable=True,
        postgresql_using='under_eye::text',
    )


def downgrade() -> None:
    op.alter_column(
        'b2b_face_scans',
        'under_eye',
        existing_type=sa.String(),
        type_=sa.Float(),
        existing_nullable=True,
        postgresql_using="CASE under_eye WHEN 'none' THEN 0.0 WHEN 'mild' THEN 0.3 WHEN 'moderate' THEN 0.6 WHEN 'severe' THEN 1.0 ELSE NULL END",
    )
