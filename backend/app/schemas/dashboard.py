from datetime import date
from decimal import Decimal
from pydantic import BaseModel


class VentaPorDia(BaseModel):
    fecha: date
    total: Decimal


class VentaPorVendedor(BaseModel):
    usuario_id: int
    nombre: str
    cantidad_ventas: int
    total: Decimal


class ProductoMasVendido(BaseModel):
    producto_id: int
    nombre: str
    cantidad_vendida: int
    total_vendido: Decimal


class ProductoStockBajo(BaseModel):
    producto_id: int
    nombre: str
    stock: int


class DashboardResumen(BaseModel):
    ventas_totales: Decimal
    cantidad_ventas: int
    cantidad_clientes: int
    cantidad_productos: int
    productos_vendidos: int
    productos_stock_bajo: int

    ventas_por_dia: list[VentaPorDia]
    ventas_por_vendedor: list[VentaPorVendedor]
    productos_mas_vendidos: list[ProductoMasVendido]
    stock_bajo: list[ProductoStockBajo]