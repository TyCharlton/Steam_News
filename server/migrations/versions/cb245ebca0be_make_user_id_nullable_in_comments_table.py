"""Make user_id nullable in comments table

Revision ID: cb245ebca0be
Revises: 346c12d1451d
Create Date: 2024-03-19 21:14:38.281867

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cb245ebca0be'
down_revision = '346c12d1451d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('comments', schema=None) as batch_op:
        batch_op.alter_column('comment_desc',
               existing_type=sa.VARCHAR(),
               type_=sa.Text(),
               nullable=True)
        batch_op.alter_column('user_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('game_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('comments', schema=None) as batch_op:
        batch_op.alter_column('game_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('user_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('comment_desc',
               existing_type=sa.Text(),
               type_=sa.VARCHAR(),
               nullable=False)

    # ### end Alembic commands ###
