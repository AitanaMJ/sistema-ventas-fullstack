from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from ..database import obtener_db
from ..models.producto import Producto
from ..models.usuario import Usuario
from ..schemas.producto import (
    ProductoCrear,
    ProductoActualizar,
    ProductoEstado,
    ProductoRespuesta,
    ProductosPaginados
)
from ..security import obtener_usuario_actual, requerir_admin


router = APIRouter(
    prefix="/productos",
    tags=["Productos"]
)


# =========================================================
# OBTENER TODOS LOS PRODUCTOS
# Requiere usuario autenticado
# =========================================================
@router.get("/", response_model=ProductosPaginados)
def obtener_productos(
    buscar: str | None = None,
    pagina: int = Query(default=1, ge=1),
    por_pagina: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    query = db.query(Producto)

    # Buscar productos por nombre
    if buscar:
        query = query.filter(
            Producto.nombre.ilike(f"%{buscar}%")
        )

    # Cantidad total de productos encontrados
    total = query.count()

    # Calcular desde qué registro comenzar
    offset = (pagina - 1) * por_pagina

    # Aplicar paginación
    productos = (
        query
        .order_by(Producto.nombre)
        .offset(offset)
        .limit(por_pagina)
        .all()
    )

    return {
        "total": total,
        "pagina": pagina,
        "por_pagina": por_pagina,
        "productos": productos
    }

# =========================================================
# OBTENER PRODUCTO POR ID
# Requiere usuario autenticado
# =========================================================
@router.get(
    "/{id}",
    response_model=ProductoRespuesta
)
def obtener_producto(
    id: int,
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    producto = db.query(Producto).filter(
        Producto.id == id
    ).first()

    if producto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )

    return producto


# =========================================================
# CREAR PRODUCTO
# Requiere usuario autenticado
# =========================================================
@router.post(
    "/",
    response_model=ProductoRespuesta,
    status_code=status.HTTP_201_CREATED
)
def crear_producto(
    producto: ProductoCrear,
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    try:
        nuevo_producto = Producto(
            nombre=producto.nombre,
            precio=producto.precio,
            stock=producto.stock
        )

        db.add(nuevo_producto)
        db.commit()
        db.refresh(nuevo_producto)

        return nuevo_producto

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al crear el producto"
        )


# =========================================================
# ACTUALIZAR PRODUCTO
# Requiere usuario autenticado
# =========================================================
@router.put(
    "/{id}",
    response_model=ProductoRespuesta
)
def actualizar_producto(
    id: int,
    producto_actualizado: ProductoActualizar,
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    producto = db.query(Producto).filter(
        Producto.id == id
    ).first()

    if producto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )

    try:
        producto.nombre = producto_actualizado.nombre
        producto.precio = producto_actualizado.precio
        producto.stock = producto_actualizado.stock

        db.commit()
        db.refresh(producto)

        return producto

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al actualizar el producto"
        )


# =========================================================
# ACTIVAR / DESACTIVAR PRODUCTO
# Solo ADMIN
# =========================================================
@router.patch(
    "/{id}/estado",
    response_model=ProductoRespuesta
)
def cambiar_estado_producto(
    id: int,
    estado: ProductoEstado,
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(requerir_admin)
):
    producto = db.query(Producto).filter(
        Producto.id == id
    ).first()

    if producto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )

    try:
        producto.activo = estado.activo

        db.commit()
        db.refresh(producto)

        return producto

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al cambiar el estado del producto"
        )

