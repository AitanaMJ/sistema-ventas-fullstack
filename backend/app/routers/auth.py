from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..database import obtener_db
from ..models.usuario import Usuario
from ..security import verificar_password, crear_access_token



router = APIRouter(
    prefix="/auth",
    tags=["Autenticación"]
)


@router.post("/login")
def login(
    datos: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(obtener_db)
):
    usuario = db.query(Usuario).filter(
        Usuario.email == datos.username
    ).first()

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )

    if not verificar_password(
        datos.password,
        usuario.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )

    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo"
        )

    token = crear_access_token({
        "sub": str(usuario.id),
        "rol": usuario.rol
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }