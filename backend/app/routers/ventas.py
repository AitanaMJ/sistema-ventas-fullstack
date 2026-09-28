from decimal import Decimal
from datetime import date, datetime, time

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from ..database import obtener_db
from ..models.venta import Venta
from ..models.cliente import Cliente
from ..models.producto import Producto
from ..models.detalle_venta import DetalleVenta
from ..models.usuario import Usuario
from ..schemas.venta import (
    VentaCrear,
    VentaDetalle,
    VentasPaginadas,
)
from ..security import obtener_usuario_actual


router = APIRouter(
    prefix="/ventas",
    tags=["Ventas"]
)


# =========================================================
# CREAR VENTA
# Admin y vendedor
# =========================================================
@router.post(
    "/",
    response_model=VentaDetalle,
    status_code=status.HTTP_201_CREATED
)
def crear_venta(
    venta: VentaCrear,
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    try:
        # Buscar cliente solamente si se seleccionó uno
        cliente = None

        if venta.cliente_id is not None:
            cliente = (
                db.query(Cliente)
                .filter(Cliente.id == venta.cliente_id)
                .first()
            )

            if cliente is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Cliente no encontrado"
                )

        # Crear venta inicialmente con total 0
        nueva_venta = Venta(
            cliente_id=venta.cliente_id,
            usuario_id=usuario_actual.id,
            total=Decimal("0.00")
        )

        db.add(nueva_venta)
        db.flush()

        total_venta = Decimal("0.00")

        # Procesar productos
        for item in venta.productos:
            producto = (
                db.query(Producto)
                .filter(Producto.id == item.producto_id)
                .first()
            )

            if producto is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Producto {item.producto_id} no encontrado"
                )

            if not producto.activo:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"El producto '{producto.nombre}' está desactivado"
                )

            # Verificar stock
            if producto.stock < item.cantidad:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        f"Stock insuficiente para {producto.nombre}. "
                        f"Disponible: {producto.stock}"
                    )
                )

            # Calcular subtotal
            subtotal = producto.precio * item.cantidad

            # Descontar stock
            producto.stock -= item.cantidad

            # Crear detalle
            detalle = DetalleVenta(
                venta_id=nueva_venta.id,
                producto_id=producto.id,
                cantidad=item.cantidad,
                precio_unitario=producto.precio,
                subtotal=subtotal
            )

            db.add(detalle)

            # Acumular total
            total_venta += subtotal

        # Guardar total final
        nueva_venta.total = total_venta

        # Confirmar toda la operación
        db.commit()
        db.refresh(nueva_venta)

        return {
            "id": nueva_venta.id,
            "fecha": nueva_venta.fecha,
            "cliente": (
                {
                    "id": cliente.id,
                    "nombre": cliente.nombre
                }
                if cliente
                else None
            ),
            "vendedor": {
                "id": usuario_actual.id,
                "nombre": usuario_actual.nombre
            },
            "productos": [
                {
                    "id": detalle.producto.id,
                    "nombre": detalle.producto.nombre,
                    "precio_unitario": detalle.precio_unitario,
                    "cantidad": detalle.cantidad,
                    "subtotal": detalle.subtotal
                }
                for detalle in nueva_venta.detalles
            ],
            "total": nueva_venta.total
        }

    except HTTPException:
        db.rollback()
        raise

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al registrar la venta"
        )


# =========================================================
# OBTENER TODAS LAS VENTAS
# Admin y vendedor
# =========================================================
@router.get("/", response_model=VentasPaginadas)
def obtener_ventas(
    cliente_id: int | None = None,
    consumidor_final: bool = False,
    usuario_id: int | None = None,
    fecha_desde: date | None = None,
    fecha_hasta: date | None = None,
    pagina: int = Query(default=1, ge=1),
    por_pagina: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    query = db.query(Venta)
    

    # Filtro por cliente
    if consumidor_final:
         query = query.filter(Venta.cliente_id.is_(None))

    elif cliente_id is not None:
         query = query.filter(Venta.cliente_id == cliente_id)

    # Filtro por vendedor
    if usuario_id is not None:
        query = query.filter(Venta.usuario_id == usuario_id)

    # Filtro desde fecha
    if fecha_desde is not None:
        inicio = datetime.combine(fecha_desde, time.min)
        query = query.filter(Venta.fecha >= inicio)

    # Filtro hasta fecha
    if fecha_hasta is not None:
        fin = datetime.combine(fecha_hasta, time.max)
        query = query.filter(Venta.fecha <= fin)

    # Total después de aplicar filtros
    total = query.count()

    # Paginación
    offset = (pagina - 1) * por_pagina

    ventas = (
        query
        .order_by(Venta.fecha.desc())
        .offset(offset)
        .limit(por_pagina)
        .all()
    )

    ventas_respuesta = [
        {
            "id": venta.id,
            "fecha": venta.fecha,
            "cliente": (
                {
                    "id": venta.cliente.id,
                    "nombre": venta.cliente.nombre
                }
                if venta.cliente
                else None
            ),
            "vendedor": (
                {
                    "id": venta.usuario.id,
                    "nombre": venta.usuario.nombre
                }
                if venta.usuario
                else None
            ),
            "total": venta.total
        }
        for venta in ventas
    ]

    return {
        "total": total,
        "pagina": pagina,
        "por_pagina": por_pagina,
        "ventas": ventas_respuesta
    }


# =========================================================
# OBTENER VENTA POR ID
# Admin y vendedor
# =========================================================
@router.get(
    "/{id}",
    response_model=VentaDetalle
)
def obtener_venta(
    id: int,
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    venta = (
        db.query(Venta)
        .filter(Venta.id == id)
        .first()
    )

    if venta is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venta no encontrada"
        )

    return {
        "id": venta.id,
        "fecha": venta.fecha,
        "cliente": (
            {
                "id": venta.cliente.id,
                "nombre": venta.cliente.nombre
            }
            if venta.cliente
            else None
        ),
        "vendedor": (
            {
                "id": venta.usuario.id,
                "nombre": venta.usuario.nombre
            }
            if venta.usuario
            else None
        ),
        "productos": [
            {
                "id": detalle.producto.id,
                "nombre": detalle.producto.nombre,
                "precio_unitario": detalle.precio_unitario,
                "cantidad": detalle.cantidad,
                "subtotal": detalle.subtotal
            }
            for detalle in venta.detalles
        ],
        "total": venta.total
    }
        