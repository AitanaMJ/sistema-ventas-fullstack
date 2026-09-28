from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy import func, Date
from sqlalchemy.orm import Session

from ..database import obtener_db
from ..models.venta import Venta
from ..models.cliente import Cliente
from ..models.producto import Producto
from ..models.detalle_venta import DetalleVenta
from ..models.usuario import Usuario
from ..schemas.dashboard import DashboardResumen
from ..security import requerir_admin


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get(
    "/resumen",
    response_model=DashboardResumen
)
def obtener_resumen(
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(requerir_admin)
):
    ventas_totales = db.query(
        func.coalesce(func.sum(Venta.total), 0)
    ).scalar()

    cantidad_ventas = db.query(
        func.count(Venta.id)
    ).scalar()

    cantidad_clientes = db.query(
        func.count(Cliente.id)
    ).scalar()

    cantidad_productos = db.query(
        func.count(Producto.id)
    ).scalar()

    productos_vendidos = db.query(
        func.coalesce(func.sum(DetalleVenta.cantidad), 0)
    ).scalar()

    productos_stock_bajo = db.query(
        func.count(Producto.id)
    ).filter(
        Producto.stock <= 10
    ).scalar()
    
    ventas_por_dia = (
    db.query(
        func.cast(Venta.fecha, Date).label("fecha"),
        func.sum(Venta.total).label("total")
    )
    .group_by(
        func.cast(Venta.fecha, Date)
    )
    .order_by(
        func.cast(Venta.fecha, Date)
    )
    .all()
    )
    
    ventas_por_vendedor = (
    db.query(
        Usuario.id.label("usuario_id"),
        Usuario.nombre.label("nombre"),
        func.count(Venta.id).label("cantidad_ventas"),
        func.sum(Venta.total).label("total")
    )
    .join(
        Venta,
        Venta.usuario_id == Usuario.id
    )
    .group_by(
        Usuario.id,
        Usuario.nombre
    )
    .order_by(
        func.sum(Venta.total).desc()
    )
    .all()
    )
    
    productos_mas_vendidos = (
    db.query(
        Producto.id.label("producto_id"),
        Producto.nombre.label("nombre"),
        func.sum(DetalleVenta.cantidad).label("cantidad_vendida"),
        func.sum(DetalleVenta.subtotal).label("total_vendido")
    )
    .join(
        DetalleVenta,
        DetalleVenta.producto_id == Producto.id
    )
    .group_by(
        Producto.id,
        Producto.nombre
    )
    .order_by(
        func.sum(DetalleVenta.cantidad).desc()
    )
    .limit(5)
    .all()
    )
    
    # Productos con stock bajo
    stock_bajo = (
    db.query(Producto)
        .filter(Producto.stock <= 10)
        .order_by(Producto.stock)
        .all()
    )

    return {
    "ventas_totales": Decimal(ventas_totales),
    "cantidad_ventas": cantidad_ventas,
    "cantidad_clientes": cantidad_clientes,
    "cantidad_productos": cantidad_productos,
    "productos_vendidos": productos_vendidos,
    "productos_stock_bajo": productos_stock_bajo,

    "ventas_por_dia": [
        {
            "fecha": venta.fecha,
            "total": venta.total
        }
        for venta in ventas_por_dia
    ],

    "ventas_por_vendedor": [
        {
            "usuario_id": vendedor.usuario_id,
            "nombre": vendedor.nombre,
            "cantidad_ventas": vendedor.cantidad_ventas,
            "total": vendedor.total
        }
        for vendedor in ventas_por_vendedor
    ],

    "productos_mas_vendidos": [
        {
            "producto_id": producto.producto_id,
            "nombre": producto.nombre,
            "cantidad_vendida": producto.cantidad_vendida,
            "total_vendido": producto.total_vendido
        }
        for producto in productos_mas_vendidos
    ],

    "stock_bajo": [
        {
            "producto_id": producto.id,
            "nombre": producto.nombre,
            "stock": producto.stock
        }
        for producto in stock_bajo
    ]
}

 
    