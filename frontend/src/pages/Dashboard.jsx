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


  const formatearDinero = (valor) => {
    return `$${Number(valor).toLocaleString('es-AR')}`
  }


  if (cargando) {
    return (
      <div className="dashboard-estado">
        Cargando dashboard...
      </div>
    )
  }


  if (error) {
    return (
      <div className="dashboard-error">
        {error}
      </div>
    )
  }


  return (
    <div className="dashboard">

      {/* =====================================================
          ENCABEZADO
      ====================================================== */}
      <div className="dashboard-header">

        <div>
          <span className="dashboard-bienvenida">
            Buenos días, {usuario.nombre} 👋
          </span>

          <h1>
            Resumen de tu negocio
          </h1>

          <p>
            Consultá las ventas, clientes y productos
            desde un solo lugar.
          </p>
        </div>

      </div>


      {/* =====================================================
          TARJETAS
      ====================================================== */}
      <div className="dashboard-cards">

        <div className="dashboard-card">

          <div className="dashboard-card-top">
            <div className="card-icon card-icon-purple">
              $
            </div>

            <span className="card-badge">
              Ventas
            </span>
          </div>

          <div className="dashboard-card-info">
            <p>Ventas totales</p>

            <h2>
              {formatearDinero(datos.ventas_totales)}
            </h2>
          </div>

        </div>


        <div className="dashboard-card">

          <div className="dashboard-card-top">
            <div className="card-icon card-icon-pink">
              ↗
            </div>

            <span className="card-badge">
              Operaciones
            </span>
          </div>

          <div className="dashboard-card-info">
            <p>Cantidad de ventas</p>

            <h2>
              {datos.cantidad_ventas}
            </h2>
          </div>

        </div>


        <div className="dashboard-card">

          <div className="dashboard-card-top">
            <div className="card-icon card-icon-blue">
              ♙
            </div>

            <span className="card-badge">
              Clientes
            </span>
          </div>

          <div className="dashboard-card-info">
            <p>Clientes registrados</p>

            <h2>
              {datos.cantidad_clientes}
            </h2>
          </div>

        </div>


        <div className="dashboard-card">

          <div className="dashboard-card-top">
            <div className="card-icon card-icon-orange">
              ◇
            </div>

            <span className="card-badge">
              Inventario
            </span>
          </div>

          <div className="dashboard-card-info">
            <p>Productos registrados</p>

            <h2>
              {datos.cantidad_productos}
            </h2>
          </div>

        </div>


        <div className="dashboard-card">

          <div className="dashboard-card-top">
            <div className="card-icon card-icon-green">
              ✓
            </div>

            <span className="card-badge">
              Unidades
            </span>
          </div>

          <div className="dashboard-card-info">
            <p>Productos vendidos</p>

            <h2>
              {datos.productos_vendidos}
            </h2>
          </div>

        </div>


        <div className="dashboard-card">

          <div className="dashboard-card-top">
            <div className="card-icon card-icon-red">
              !
            </div>

            <span className="card-badge card-badge-alert">
              Atención
            </span>
          </div>

          <div className="dashboard-card-info">
            <p>Productos con stock bajo</p>

            <h2>
              {datos.productos_stock_bajo}
            </h2>
          </div>

        </div>

      </div>


      {/* =====================================================
          GRÁFICOS
      ====================================================== */}
      <div className="dashboard-graficos">

        {/* VENTAS POR DÍA */}
        <div className="dashboard-panel grafico-principal">

          <div className="panel-header">
            <div>
              <h2>Ventas por día</h2>

              <p>
                Evolución de los ingresos
              </p>
            </div>

            <span className="panel-etiqueta">
              Ventas
            </span>
          </div>


          <div className="grafico">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={datos.ventas_por_dia}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#eeeaf5"
                />

                <XAxis
                  dataKey="fecha"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#9ca3af',
                    fontSize: 11,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#9ca3af',
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  formatter={(value) =>
                    formatearDinero(value)
                  }
                  contentStyle={{
                    borderRadius: '10px',
                    border: '1px solid #eeeaf5',
                    boxShadow:
                      '0 8px 20px rgba(31, 41, 55, 0.08)',
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: '#ffffff',
                    stroke: '#8b5cf6',
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />

              </LineChart>
            </ResponsiveContainer>

          </div>

        </div>


        {/* VENTAS POR VENDEDOR */}
        <div className="dashboard-panel">

          <div className="panel-header">
            <div>
              <h2>Ventas por vendedor</h2>

              <p>
                Operaciones realizadas
              </p>
            </div>
          </div>


          <div className="grafico">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={datos.ventas_por_vendedor}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#eeeaf5"
                />

                <XAxis
                  dataKey="nombre"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#9ca3af',
                    fontSize: 11,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#9ca3af',
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: '10px',
                    border: '1px solid #eeeaf5',
                    boxShadow:
                      '0 8px 20px rgba(31, 41, 55, 0.08)',
                  }}
                />

                <Bar
                  dataKey="cantidad_ventas"
                  fill="#c084fc"
                  radius={[7, 7, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>

        </div>

      </div>


      {/* =====================================================
          TABLAS
      ====================================================== */}
      <div className="dashboard-tablas">

        {/* PRODUCTOS MÁS VENDIDOS */}
        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h2>
                Productos más vendidos
              </h2>

              <p>
                Productos con mayor movimiento
              </p>
            </div>

          </div>


          <div className="tabla-contenedor">

            <table className="dashboard-tabla">

              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Total vendido</th>
                </tr>
              </thead>

              <tbody>

                {datos.productos_mas_vendidos.map(
                  (producto) => (
                    <tr key={producto.producto_id}>

                      <td>
                        <div className="producto-tabla">

                          <div className="producto-icono">
                            ◇
                          </div>

                          <span>
                            {producto.nombre}
                          </span>

                        </div>
                      </td>

                      <td>
                        {producto.cantidad_vendida}
                      </td>

                      <td className="tabla-dinero">
                        {formatearDinero(
                          producto.total_vendido
                        )}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* STOCK BAJO */}
        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h2>Stock bajo</h2>

              <p>
                Productos que requieren atención
              </p>
            </div>

            <span className="stock-alerta">
              {datos.productos_stock_bajo}
            </span>

          </div>


          <div className="stock-lista">

            {datos.stock_bajo.map(
              (producto) => (
                <div
                  className="stock-item"
                  key={producto.producto_id}
                >

                  <div className="stock-producto">

                    <div className="stock-icono">
                      !
                    </div>

                    <div>
                      <strong>
                        {producto.nombre}
                      </strong>

                      <span>
                        Stock disponible
                      </span>
                    </div>

                  </div>


                  <div className="stock-cantidad">
                    {producto.stock}
                  </div>

                </div>
              )
            )}

          </div>

        </div>

      </div>

    </div>
  )
}


export default Dashboard