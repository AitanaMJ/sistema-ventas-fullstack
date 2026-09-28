const API_URL = 'http://127.0.0.1:8000'


export async function obtenerVentas(
  pagina = 1,
  porPagina = 10,
  filtros = {}
) {
  const token = localStorage.getItem('token')

  const parametros = new URLSearchParams({
    pagina: pagina.toString(),
    por_pagina: porPagina.toString(),
  })

  if (filtros.clienteId) {
    parametros.append('cliente_id', filtros.clienteId)
  }

  if (filtros.consumidorFinal) {
  parametros.append('consumidor_final', 'true')
  }

  if (filtros.usuarioId) {
    parametros.append('usuario_id', filtros.usuarioId)
  }

  if (filtros.fechaDesde) {
    parametros.append('fecha_desde', filtros.fechaDesde)
  }

  if (filtros.fechaHasta) {
    parametros.append('fecha_hasta', filtros.fechaHasta)
  }

  const respuesta = await fetch(
    `${API_URL}/ventas/?${parametros.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!respuesta.ok) {
    const error = await respuesta.json()

    throw new Error(
      error.detail || 'Error al obtener las ventas'
    )
  }

  return await respuesta.json()
}


export async function obtenerVentaPorId(id) {
  const token = localStorage.getItem('token')

  const respuesta = await fetch(
    `${API_URL}/ventas/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!respuesta.ok) {
    const error = await respuesta.json()

    throw new Error(
      error.detail || 'Error al obtener el detalle de la venta'
    )
  }

  return await respuesta.json()
}


export async function crearVenta(venta) {
  const token = localStorage.getItem('token')

  const respuesta = await fetch(
    `${API_URL}/ventas/`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(venta),
    }
  )

  if (!respuesta.ok) {
    const error = await respuesta.json()

    throw new Error(
      error.detail || 'Error al registrar la venta'
    )
  }

  return await respuesta.json()
}