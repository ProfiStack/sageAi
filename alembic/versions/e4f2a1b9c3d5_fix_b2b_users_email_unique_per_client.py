"""fix b2b_users email unique per client

Revision ID: e4f2a1b9c3d5
Revises: f9107ebc88dc
Create Date: 2026-04-12

Removes the global unique constraint on b2b_users.email and replaces it
with a composite unique constraint on (email, client_id) so the same
email can exist across different B2B clients.
"""
from alembic import op

# revision identifiers
revision = "e4f2a1b9c3d5"
down_revision = "c3a1d8e9f2b4"
branch_labels = None
depends_on = None


def upgrade():
    # Drop the old global unique constraint
    op.drop_constraint("b2b_users_email_key", "b2b_users", type_="unique")

    # Add composite unique: email must be unique per client
    op.create_unique_constraint(
        "uq_b2b_users_email_client",
        "b2b_users",
        ["email", "client_id"],
    )


def downgrade():
    op.drop_constraint("uq_b2b_users_email_client", "b2b_users", type_="unique")
    op.create_unique_constraint("b2b_users_email_key", "b2b_users", ["email"])
