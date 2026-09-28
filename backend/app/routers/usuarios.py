from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import obtener_db
from ..models.usuario import Usuario
from ..schemas.usuario import (
    UsuarioCrear,
    UsuarioActualizar,
    UsuarioEstado,
    UsuarioRespuesta,
    CambiarPassword
)
from ..security import (
    hashear_password,
    verificar_password,
    obtener_usuario_actual,
    requerir_admin
)


router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"]
)


# =========================================================
# OBTENER MI USUARIO
# Admin y vendedor
# =========================================================
@router.get(
    "/me",
    response_model=UsuarioRespuesta
)
def obtener_mi_usuario(
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    return usuario_actual

# =========================================================
# CAMBIAR MI CONTRASEÑA
# Admin y vendedor
# =========================================================
@router.patch("/me/password")
def cambiar_password(
    datos: CambiarPassword,
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    # Verificar que la contraseña actual sea correcta
    if not verificar_password(
        datos.password_actual,
        usuario_actual.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La contraseña actual es incorrecta"
        )

    # Evitar usar nuevamente la misma contraseña
    if verificar_password(
        datos.password_nueva,
        usuario_actual.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La nueva contraseña debe ser diferente a la actual"
        )

    try:
        # Hashear la nueva contraseña
        usuario_actual.password_hash = hashear_password(
            datos.password_nueva
        )

        db.commit()

        return {
            "mensaje": "Contraseña actualizada correctamente"
        }

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al actualizar la contraseña"
        )




# =========================================================
# OBTENER TODOS LOS USUARIOS
# Solo ADMIN
# =========================================================
@router.get(
    "/vendedores",
    response_model=list[UsuarioRespuesta]
)
def obtener_vendedores(
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(obtener_usuario_actual)
):
    return (
        db.query(Usuario)
        .order_by(Usuario.nombre)
        .all()
    )
    

# =========================================================
# OBTENER TODOS LOS USUARIOS
# Solo ADMIN
# =========================================================
@router.get(
    "/",
    response_model=list[UsuarioRespuesta]
)
def obtener_usuarios(
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(requerir_admin)
):
    return (
        db.query(Usuario)
        .order_by(Usuario.nombre)
        .all()
    )    
     

# =========================================================
# OBTENER USUARIO POR ID
# Solo ADMIN
# =========================================================
@router.get(
    "/{id}",
    response_model=UsuarioRespuesta
)
def obtener_usuario(
    id: int,
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(requerir_admin)
):
    usuario = db.query(Usuario).filter(
        Usuario.id == id
    ).first()

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    return usuario


# =========================================================
# CREAR USUARIO
# Solo ADMIN
# =========================================================
@router.post(
    "/",
    response_model=UsuarioRespuesta,
    status_code=status.HTTP_201_CREATED
)
def crear_usuario(
    usuario: UsuarioCrear,
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(requerir_admin)
):
    usuario_existente = db.query(Usuario).filter(
        Usuario.email == usuario.email
    ).first()

    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un usuario con ese email"
        )

    try:
        nuevo_usuario = Usuario(
            nombre=usuario.nombre,
            email=usuario.email,
            password_hash=hashear_password(usuario.password),
            rol=usuario.rol,
            activo=True
        )

        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)

        return nuevo_usuario

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al crear el usuario"
        )


# =========================================================
# ACTUALIZAR USUARIO
# Solo ADMIN
# =========================================================
@router.put(
    "/{id}",
    response_model=UsuarioRespuesta
)
def actualizar_usuario(
    id: int,
    usuario_actualizado: UsuarioActualizar,
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(requerir_admin)
):
    usuario = db.query(Usuario).filter(
        Usuario.id == id
    ).first()

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
        
    # Evitar que el administrador cambie su propio rol
    if usuario.id == usuario_actual.id and usuario_actualizado.rol != "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No podés quitarte tu propio rol de administrador"
        )    


    # Verificar que el email no pertenezca a otro usuario
    email_en_uso = db.query(Usuario).filter(
        Usuario.email == usuario_actualizado.email,
        Usuario.id != id
    ).first()

    if email_en_uso:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ese email ya está siendo utilizado por otro usuario"
        )
        

    try:
        usuario.nombre = usuario_actualizado.nombre
        usuario.email = usuario_actualizado.email
        usuario.rol = usuario_actualizado.rol

        db.commit()
        db.refresh(usuario)

        return usuario

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al actualizar el usuario"
        )


# =========================================================
# ACTIVAR / DESACTIVAR USUARIO
# Solo ADMIN
# =========================================================
@router.patch(
    "/{id}/estado",
    response_model=UsuarioRespuesta
)
def cambiar_estado_usuario(
    id: int,
    estado: UsuarioEstado,
    db: Session = Depends(obtener_db),
    usuario_actual: Usuario = Depends(requerir_admin)
):
    usuario = db.query(Usuario).filter(
        Usuario.id == id
    ).first()

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    # Evitar que el administrador se desactive a sí mismo
    if usuario.id == usuario_actual.id and estado.activo is False:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No podés desactivar tu propio usuario"
        )

    try:
        usuario.activo = estado.activo

        db.commit()
        db.refresh(usuario)

        return usuario

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al cambiar el estado del usuario"
        )