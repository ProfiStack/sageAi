"""change message and response to JSON

Revision ID: ab9cb57a950d
Revises: 644d2f1b7f0b
Create Date: 2025-06-28 22:45:30.693339

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ab9cb57a950d'
down_revision: Union[str, Sequence[str], None] = '644d2f1b7f0b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.execute("""
        ALTER TABLE chat_messages 
        ALTER COLUMN message TYPE JSON 
        USING message::json
    """)
    op.execute("""
        ALTER TABLE chat_messages 
        ALTER COLUMN response TYPE JSON 
        USING response::json
    """)

def downgrade():
    op.execute("""
        ALTER TABLE chat_messages 
        ALTER COLUMN message TYPE TEXT 
        USING message::text
    """)
    op.execute("""
        ALTER TABLE chat_messages 
        ALTER COLUMN response TYPE TEXT 
        USING response::text
    """)