const API_URL = 'http://127.0.0.1:8000'


export async function obtenerProductos(
  buscar = '',
  pagina = 1,
  porPagina = 10
) {
  const token = localStorage.getItem('token')

  const parametros = new URLSearchParams({
    pagina: pagina.toString(),
    por_pagina: porPagina.toString(),
  })

  if (buscar.trim()) {
    parametros.append('buscar', buscar.trim())
  }

  const respuesta = await fetch(
    `${API_URL}/productos/?${parametros.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!respuesta.ok) {
    const error = await respuesta.json()

    throw new Error(
      error.detail || 'Error al obtener los productos'
    )
  }

  return await respuesta.json()
}
export async function cambiarEstadoProducto(id, activo) {
  const token = localStorage.getItem('token')

  const respuesta = await fetch(
    `http://127.0.0.1:8000/productos/${id}/estado`,
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
      error.detail || 'Error al cambiar el estado del producto'
    )
  }

  return await respuesta.json()
}

export async function crearProducto(producto) {
  const token = localStorage.getItem('token')

  const respuesta = await fetch(
    'http://127.0.0.1:8000/productos/',
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(producto),
    }
  )

  if (!respuesta.ok) {
    const error = await respuesta.json()

    throw new Error(
      error.detail || 'Error al crear el producto'
    )
  }

  return await respuesta.json()
}

export async function actualizarProducto(id, producto) {
  const token = localStorage.getItem('token')

  const respuesta = await fetch(
    `http://127.0.0.1:8000/productos/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(producto),
    }
  )

  if (!respuesta.ok) {
    const error = await respuesta.json()

    throw new Error(
      error.detail || 'Error al actualizar el producto'
    )
  }

  return await respuesta.json()
}