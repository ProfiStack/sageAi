"""b2b_missing_columns

Adds missing columns to b2b_face_scans (concerns_confidence, tone_confidence,
undertone_confidence) and b2b_clients (email, created_at) and b2b_api_keys
(label, created_at).

Revision ID: a3c9f1e2b5d7
Revises: d02b71fddbfc
Create Date: 2026-03-11 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'a3c9f1e2b5d7'
down_revision: Union[str, Sequence[str], None] = 'd02b71fddbfc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # b2b_face_scans — add missing confidence columns
    op.add_column('b2b_face_scans', sa.Column('concerns_confidence', sa.JSON(), nullable=True))
    op.add_column('b2b_face_scans', sa.Column('tone_confidence', sa.Float(), nullable=True))
    op.add_column('b2b_face_scans', sa.Column('undertone_confidence', sa.Float(), nullable=True))

    # b2b_clients — add email and created_at
    op.add_column('b2b_clients', sa.Column('email', sa.String(), nullable=True))
    op.add_column('b2b_clients', sa.Column('created_at', sa.DateTime(), nullable=True))
    op.create_unique_constraint('uq_b2b_clients_email', 'b2b_clients', ['email'])

    # b2b_users — add email column (was missing from original migration)
    op.add_column('b2b_users', sa.Column('email', sa.String(), nullable=True))

    # b2b_api_keys — add label and created_at
    op.add_column('b2b_api_keys', sa.Column('label', sa.String(), nullable=True))
    op.add_column('b2b_api_keys', sa.Column('created_at', sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column('b2b_api_keys', 'created_at')
    op.drop_column('b2b_api_keys', 'label')

    op.drop_column('b2b_users', 'email')

    op.drop_constraint('uq_b2b_clients_email', 'b2b_clients', type_='unique')
    op.drop_column('b2b_clients', 'created_at')
    op.drop_column('b2b_clients', 'email')

    op.drop_column('b2b_face_scans', 'undertone_confidence')
    op.drop_column('b2b_face_scans', 'tone_confidence')
    op.drop_column('b2b_face_scans', 'concerns_confidence')
