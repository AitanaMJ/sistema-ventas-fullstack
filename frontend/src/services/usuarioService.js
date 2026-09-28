const API_URL = 'http://127.0.0.1:8000'


export async function obtenerVendedores() {
  const token = localStorage.getItem('token')

  const respuesta = await fetch(
    `${API_URL}/usuarios/vendedores`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!respuesta.ok) {
    const error = await respuesta.json()

    throw new Error(
      error.detail || 'Error al obtener los vendedores'
    )
  }

  return await respuesta.json()
}


export async function obtenerUsuarios() {
  const token = localStorage.getItem('token')

  const respuesta = await fetch(`${API_URL}/usuarios/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!respuesta.ok) {
    const error = await respuesta.json()

    throw new Error(
      error.detail || 'Error al obtener los usuarios'
    )
  }

  return await respuesta.json()
}


export async function crearUsuario(usuario) {
  const token = localStorage.getItem('token')

  const respuesta = await fetch(`${API_URL}/usuarios/`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(usuario),
  })

  if (!respuesta.ok) {
    const error = await respuesta.json()

    throw new Error(
      error.detail || 'Error al crear el usuario'
    )
  }

  return await respuesta.json()
}


export async function actualizarUsuario(id, usuario) {
  const token = localStorage.getItem('token')

  const respuesta = await fetch(`${API_URL}/usuarios/${id}`, {
    method: 'PUT',

    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(usuario),
  })

  if (!respuesta.ok) {
    const error = await respuesta.json()

    throw new Error(
      error.detail || 'Error al actualizar el usuario'
    )
  }

  return await respuesta.json()
}


export async function cambiarEstadoUsuario(id, activo) {
  const token = localStorage.getItem('token')

  const respuesta = await fetch(
    `${API_URL}/usuarios/${id}/estado`,
    {
      method: 'PATCH',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        activo: activo,
      }),
    }
  )

  if (!respuesta.ok) {
    const error = await respuesta.json()

    throw new Error(
      error.detail || 'Error al cambiar el estado del usuario'
    )
  }

  return await respuesta.json()
}