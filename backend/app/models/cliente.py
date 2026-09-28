from sqlalchemy import Column, Integer, String
from ..database import Base
from sqlalchemy.orm import relationship


class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    email = Column(
    String(150),
    nullable=False,
    unique=True
    )
    telefono = Column(String(30), nullable=True)
    
    ventas = relationship(
    "Venta",
    back_populates="cliente"
)