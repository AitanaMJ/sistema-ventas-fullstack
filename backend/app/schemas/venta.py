from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


# =========================================================
# DATOS PARA CREAR UNA VENTA
# =========================================================
class DetalleVentaCrear(BaseModel):
    producto_id: int = Field(gt=0)
    cantidad: int = Field(gt=0)


class VentaCrear(BaseModel):
    cliente_id: int | None = Field(default=None, gt=0)
    productos: list[DetalleVentaCrear] = Field(min_length=1)


# =========================================================
# DATOS RESUMIDOS DEL CLIENTE
# =========================================================
class ClienteResumen(BaseModel):
    id: int
    nombre: str


# =========================================================
# DATOS RESUMIDOS DEL VENDEDOR
# =========================================================
class VendedorResumen(BaseModel):
    id: int
    nombre: str


# =========================================================
# DETALLE DE PRODUCTO DENTRO DE UNA VENTA
# =========================================================
class ProductoDetalle(BaseModel):
    id: int
    nombre: str
    precio_unitario: Decimal
    cantidad: int
    subtotal: Decimal


# =========================================================
# RESUMEN DE VENTA
# Se utiliza al obtener todas las ventas
# =========================================================
class VentaResumen(BaseModel):
    id: int
    fecha: datetime

    # Puede ser None cuando la venta es a Consumidor final
    cliente: ClienteResumen | None = None

    vendedor: VendedorResumen | None = None

    total: Decimal


# =========================================================
# DETALLE COMPLETO DE UNA VENTA
# =========================================================
class VentaDetalle(BaseModel):
    id: int
    fecha: datetime

    # Puede ser None cuando la venta es a Consumidor final
    cliente: ClienteResumen | None = None

    vendedor: VendedorResumen | None = None

    productos: list[ProductoDetalle]

    total: Decimal


# =========================================================
# LISTADO PAGINADO DE VENTAS
# =========================================================
class VentasPaginadas(BaseModel):
    total: int
    pagina: int
    por_pagina: int
    ventas: list[VentaResumen]