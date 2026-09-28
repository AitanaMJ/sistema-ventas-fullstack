const API_URL = 'http://127.0.0.1:8000'


export async function obtenerClientes(
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
    `${API_URL}/clientes/?${parametros.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!respuesta.ok) {
    const error = await respuesta.json()

    throw new Error(
      error.detail || 'Error al obtener los clientes'
    )
  }

  return await respuesta.json()
}

export async function crearCliente(cliente) {
  const token = localStorage.getItem('token')

  const respuesta = await fetch(
    `${API_URL}/clientes/`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(cliente),
    }
  )

  if (!respuesta.ok) {
    const error = await respuesta.json()

    throw new Error(
      error.detail || 'Error al crear el cliente'
    )
  }

  return await respuesta.json()
}

export async function actualizarCliente(id, cliente) {
  const token = localStorage.getItem('token')

  const respuesta = await fetch(
    `${API_URL}/clientes/${id}`,
    {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(cliente),
    }
  )

  if (!respuesta.ok) {
    const error = await respuesta.json()

    throw new Error(
      error.detail || 'Error al actualizar el cliente'
    )
  }

  return await respuesta.json()
}