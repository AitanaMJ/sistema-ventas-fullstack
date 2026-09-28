const API_URL = 'http://127.0.0.1:8000'

export async function login(email, password) {
  const datos = new URLSearchParams()

  datos.append('username', email)
  datos.append('password', password)

  const respuesta = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: datos,
  })

  if (!respuesta.ok) {
    const error = await respuesta.json()

    throw new Error(
      error.detail || 'Error al iniciar sesión'
    )
  }

  return await respuesta.json()
}

export async function obtenerMiUsuario(token) {
  const respuesta = await fetch(
    'http://127.0.0.1:8000/usuarios/me',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!respuesta.ok) {
    throw new Error('No se pudo obtener el usuario')
  }

  return await respuesta.json()
}