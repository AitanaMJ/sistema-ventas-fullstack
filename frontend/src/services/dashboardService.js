const API_URL = 'http://127.0.0.1:8000'


export async function obtenerDashboard() {
  const token = localStorage.getItem('token')

  const respuesta = await fetch(
    `${API_URL}/dashboard/resumen`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!respuesta.ok) {
    const error = await respuesta.json()

    throw new Error(
      error.detail || 'Error al obtener el dashboard'
    )
  }

  return await respuesta.json()
}