import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { obtenerDashboard } from '../services/dashboardService'

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import './Dashboard.css'


function Dashboard() {
  const { usuario } = useAuth()

  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        const respuesta = await obtenerDashboard()

        setDatos(respuesta)

      } catch (error) {
        setError(error.message)

      } finally {
        setCargando(false)
      }
    }

    cargarDashboard()
  }, [])


  if (cargando) {
    return <p>Cargando dashboard...</p>
  }


  if (error) {
    return <p>{error}</p>
  }


  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <h1>Dashboard</h1>

        <p>
          Bienvenida, {usuario.nombre}
        </p>
      </div>


      {/* TARJETAS */}
      <div className="dashboard-cards">

        <div className="dashboard-card">
          <p>Ventas totales</p>

          <h2>
            ${Number(datos.ventas_totales).toLocaleString('es-AR')}
          </h2>
        </div>


        <div className="dashboard-card">
          <p>Cantidad de ventas</p>

          <h2>
            {datos.cantidad_ventas}
          </h2>
        </div>


        <div className="dashboard-card">
          <p>Clientes</p>

          <h2>
            {datos.cantidad_clientes}
          </h2>
        </div>


        <div className="dashboard-card">
          <p>Productos</p>

          <h2>
            {datos.cantidad_productos}
          </h2>
        </div>


        <div className="dashboard-card">
          <p>Productos vendidos</p>

          <h2>
            {datos.productos_vendidos}
          </h2>
        </div>


        <div className="dashboard-card">
          <p>Stock bajo</p>

          <h2>
            {datos.productos_stock_bajo}
          </h2>
        </div>

      </div>


      {/* GRÁFICOS */}
      <div className="dashboard-graficos">

        {/* VENTAS POR DÍA */}
        <div className="grafico-card">

          <h2>Ventas por día</h2>

          <div className="grafico">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart data={datos.ventas_por_dia}>

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="fecha"
                />

                <YAxis />

                <Tooltip
                  formatter={(value) =>
                    `$${Number(value).toLocaleString('es-AR')}`
                  }
                />

                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* VENTAS POR VENDEDOR */}
        <div className="grafico-card">

          <h2>Ventas por vendedor</h2>

          <div className="grafico">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={datos.ventas_por_vendedor}>

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="nombre"
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="cantidad_ventas"
                  fill="#2563eb"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* TABLAS */}
<div className="dashboard-tablas">

  {/* PRODUCTOS MÁS VENDIDOS */}
  <div className="tabla-card">

    <h2>Productos más vendidos</h2>

    <table>
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Total vendido</th>
        </tr>
      </thead>

      <tbody>
        {datos.productos_mas_vendidos.map((producto) => (
          <tr key={producto.producto_id}>
            <td>{producto.nombre}</td>

            <td>{producto.cantidad_vendida}</td>

            <td>
              ${Number(producto.total_vendido)
                .toLocaleString('es-AR')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

  </div>


  {/* STOCK BAJO */}
  <div className="tabla-card">

    <h2>Stock bajo</h2>

    <table>
      <thead>
        <tr>
          <th>Producto</th>
          <th>Stock</th>
        </tr>
      </thead>

      <tbody>
        {datos.stock_bajo.map((producto) => (
          <tr key={producto.producto_id}>
            <td>{producto.nombre}</td>
            <td>{producto.stock}</td>
          </tr>
        ))}
      </tbody>
    </table>

  </div>

</div>

    </div>
  )
}


export default Dashboard