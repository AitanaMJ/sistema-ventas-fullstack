from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from ..database import obtener_db
from ..models.cliente import Cliente
from ..models.venta import Venta
from ..models.usuario import Usuario
from ..schemas.cliente import (
    ClienteCrear,
    ClienteRespuesta,
    ClientesPaginados
)
from ..security import obtener_usuario_actual, requerir_admin


router = APIRouter(
    prefix="/clientes",
    tags=["Clientes"]
)


# =========================================================
# OBTENER TODOS LOS CLIENTES
# Admin y vendedor
# =========================================================
@router.get("/", response_model=ClientesPaginados)
def obtener_clientes(
    buscar: str | None = None,
    pagina: int = Query(default=1, ge=1),
    por_pagina: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    query = db.query(Cliente)

    if buscar:
        query = query.filter(
            (Cliente.nombre.ilike(f"%{buscar}%")) |
            (Cliente.email.ilike(f"%{buscar}%")) |
            (Cliente.telefono.ilike(f"%{buscar}%"))
        )

    total = query.count()

    offset = (pagina - 1) * por_pagina

    clientes = (
        query
        .order_by(Cliente.nombre)
        .offset(offset)
        .limit(por_pagina)
        .all()
    )

    return {
        "total": total,
        "pagina": pagina,
        "por_pagina": por_pagina,
        "clientes": clientes
    }

# =========================================================
# OBTENER CLIENTE POR ID
# Admin y vendedor
# =========================================================
@router.get(
    "/{id}",
    response_model=ClienteRespuesta
)
def obtener_cliente(
    id: int,
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    cliente = db.query(Cliente).filter(
        Cliente.id == id
    ).first()

    if cliente is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )

    return cliente


# =========================================================
# CREAR CLIENTE
# Admin y vendedor
# =========================================================
@router.post(
    "/",
    response_model=ClienteRespuesta,
    status_code=status.HTTP_201_CREATED
)
def crear_cliente(
    cliente: ClienteCrear,
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    # Verificar que el email no esté registrado
    cliente_existente = db.query(Cliente).filter(
        Cliente.email == cliente.email
    ).first()

    if cliente_existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un cliente con ese email"
        )

    try:
        nuevo_cliente = Cliente(
            nombre=cliente.nombre,
            email=cliente.email,
            telefono=cliente.telefono
        )

        db.add(nuevo_cliente)
        db.commit()
        db.refresh(nuevo_cliente)

        return nuevo_cliente

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al crear el cliente"
        )


# =========================================================
# ACTUALIZAR CLIENTE
# Admin y vendedor
# =========================================================
@router.put(
    "/{id}",
    response_model=ClienteRespuesta
)
def actualizar_cliente(
    id: int,
    cliente_actualizado: ClienteCrear,
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    cliente = db.query(Cliente).filter(
        Cliente.id == id
    ).first()

    if cliente is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )

    # Comprobar que el nuevo email no pertenezca a otro cliente
    email_en_uso = db.query(Cliente).filter(
        Cliente.email == cliente_actualizado.email,
        Cliente.id != id
    ).first()

    if email_en_uso:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ese email ya está siendo utilizado por otro cliente"
        )

    try:
        cliente.nombre = cliente_actualizado.nombre
        cliente.email = cliente_actualizado.email
        cliente.telefono = cliente_actualizado.telefono

        db.commit()
        db.refresh(cliente)

        return cliente

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al actualizar el cliente"
        )


# =========================================================
# ELIMINAR CLIENTE
# Solo ADMIN
# =========================================================
@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def eliminar_cliente(
    id: int,
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(requerir_admin)
):
    cliente = db.query(Cliente).filter(
        Cliente.id == id
    ).first()

    if cliente is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )

    # No permitimos eliminar clientes que tengan
    # ventas registradas.
    venta_existente = db.query(Venta).filter(
        Venta.cliente_id == id
    ).first()

    if venta_existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No se puede eliminar el cliente porque tiene ventas asociadas"
        )

    try:
        db.delete(cliente)
        db.commit()

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar el cliente"
        )