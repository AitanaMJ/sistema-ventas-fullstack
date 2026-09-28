from sqlalchemy import Column, Integer, String, Numeric, Boolean
from ..database import Base


class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    precio = Column(Numeric(12, 2), nullable=False)
    stock = Column(Integer, nullable=False, default=0)

    activo = Column(
        Boolean,
        nullable=False,
        default=True
    )