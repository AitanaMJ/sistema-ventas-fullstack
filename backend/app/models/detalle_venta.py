from sqlalchemy import Column, Integer, Numeric, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base


class DetalleVenta(Base):
    __tablename__ = "detalles_venta"

    id = Column(Integer, primary_key=True, index=True)

    venta_id = Column(
        Integer,
        ForeignKey("ventas.id"),
        nullable=False
    )

    producto_id = Column(
        Integer,
        ForeignKey("productos.id"),
        nullable=False
    )

    cantidad = Column(Integer, nullable=False)
    precio_unitario = Column(Numeric(12, 2), nullable=False)
    subtotal = Column(Numeric(12, 2), nullable=False)

    venta = relationship(
        "Venta",
        back_populates="detalles"
    )

    producto = relationship("Producto")