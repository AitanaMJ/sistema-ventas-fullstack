from sqlalchemy import Column, Integer, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from ..database import Base


class Venta(Base):
    __tablename__ = "ventas"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    fecha = Column(
        DateTime,
        default=datetime.now,
        nullable=False
    )

    cliente_id = Column(
    Integer,
    ForeignKey("clientes.id"),
    nullable=True
    )

    # Usuario que registró la venta
    usuario_id = Column(
        Integer,
        ForeignKey("usuarios.id"),
        nullable=True
    )

    total = Column(
        Numeric(12, 2),
        nullable=False
    )

    cliente = relationship(
        "Cliente",
        back_populates="ventas"
    )

    usuario = relationship(
        "Usuario",
        back_populates="ventas"
    )

    detalles = relationship(
        "DetalleVenta",
        back_populates="venta"
    )