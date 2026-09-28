from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship

from ..database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    nombre = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(150),
        nullable=False,
        unique=True,
        index=True
    )

    password_hash = Column(
        String(255),
        nullable=False
    )

    rol = Column(
        String(30),
        nullable=False,
        default="vendedor"
    )

    activo = Column(
        Boolean,
        nullable=False,
        default=True
    )

    ventas = relationship(
        "Venta",
        back_populates="usuario"
    )