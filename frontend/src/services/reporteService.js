const API_URL = 'http://127.0.0.1:8000'


export async function obtenerResumenVentas(filtros = {}) {
  const token = localStorage.getItem('token')

  const parametros = new URLSearchParams()

  if (filtros.fechaDesde) {
    parametros.append('fecha_desde', filtros.fechaDesde)
  }

  if (filtros.fechaHasta) {
    parametros.append('fecha_hasta', filtros.fechaHasta)
  }

  if (filtros.usuarioId) {
    parametros.append('usuario_id', filtros.usuarioId)
  }

  const respuesta = await fetch(
    `${API_URL}/reportes/ventas/resumen?${parametros.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!respuesta.ok) {
    const error = await respuesta.json()

    throw new Error(
      error.detail || 'Error al obtener el reporte'
    )
  }

  return await respuesta.json()
}

export async function exportarVentasExcel(filtros = {}) {
  const token = localStorage.getItem('token')

  const parametros = new URLSearchParams()

  if (filtros.fechaDesde) {
    parametros.append('fecha_desde', filtros.fechaDesde)
  }

  if (filtros.fechaHasta) {
    parametros.append('fecha_hasta', filtros.fechaHasta)
  }

  if (filtros.usuarioId) {
    parametros.append('usuario_id', filtros.usuarioId)
  }

  const respuesta = await fetch(
    `http://127.0.0.1:8000/reportes/ventas/excel?${parametros.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!respuesta.ok) {
    const error = await respuesta.json()

    throw new Error(
      error.detail || 'Error al exportar el reporte'
    )
  }

  const archivo = await respuesta.blob()

  const url = window.URL.createObjectURL(archivo)

  const enlace = document.createElement('a')

  enlace.href = url
  enlace.download = 'reporte_ventas.xlsx'

  document.body.appendChild(enlace)

  enlace.click()

  enlace.remove()

  window.URL.revokeObjectURL(url)
}