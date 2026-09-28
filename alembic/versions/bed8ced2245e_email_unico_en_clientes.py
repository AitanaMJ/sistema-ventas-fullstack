"""email unico en clientes

Revision ID: bed8ced2245e
Revises: 414185746904
Create Date: 2026-09-10 22:44:29.266499

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bed8ced2245e'
down_revision: Union[str, Sequence[str], None] = '414185746904'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
     op.create_unique_constraint(
        "uq_clientes_email",
        "clientes",
        ["email"]
    )


def downgrade() -> None:
     op.drop_constraint(
        "uq_clientes_email",
        "clientes",
        type_="unique"
    )
