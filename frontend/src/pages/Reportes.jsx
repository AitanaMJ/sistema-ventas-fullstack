import { useEffect, useState } from 'react'

import {
  obtenerResumenVentas,
  exportarVentasExcel,
} from '../services/reporteService'

import { obtenerVendedores } from '../services/usuarioService'

import './Reportes.css'


function Reportes() {
  const [resumen, setResumen] = useState({
    cantidad_ventas: 0,
    total_vendido: 0,
  })

  const [vendedores, setVendedores] = useState([])

  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [vendedorId, setVendedorId] = useState('')

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [exportando, setExportando] = useState(false)


  // =========================================================
  // CARGAR VENDEDORES
  // =========================================================
  useEffect(() => {
    const cargarVendedores = async () => {
      try {
        const respuesta = await obtenerVendedores()

        setVendedores(respuesta)
      } catch (error) {
        console.error(
          'Error al cargar vendedores:',
          error
        )
      }
    }

    cargarVendedores()
  }, [])


  // =========================================================
  // CARGAR REPORTE
  // =========================================================
  useEffect(() => {
    const cargarReporte = async () => {
      try {
        setCargando(true)
        setError('')

        const respuesta = await obtenerResumenVentas({
          fechaDesde,
          fechaHasta,
          usuarioId: vendedorId,
        })

        setResumen(respuesta)
      } catch (error) {
        setError(error.message)
      } finally {
        setCargando(false)
      }
    }

    cargarReporte()
  }, [
    fechaDesde,
    fechaHasta,
    vendedorId,
  ])


  // =========================================================
  // FORMATEAR DINERO
  // =========================================================
  const formatearDinero = (valor) => {
    return Number(valor).toLocaleString(
      'es-AR',
      {
        style: 'currency',
        currency: 'ARS',
      }
    )
  }


  // =========================================================
  // LIMPIAR FILTROS
  // =========================================================
  const limpiarFiltros = () => {
    setFechaDesde('')
    setFechaHasta('')
    setVendedorId('')
  }


  // =========================================================
  // EXPORTAR EXCEL
  // =========================================================
  const exportarExcel = async () => {
    try {
      setExportando(true)
      setError('')

      await exportarVentasExcel({
        fechaDesde,
        fechaHasta,
        usuarioId: vendedorId,
      })
    } catch (error) {
      setError(error.message)
    } finally {
      setExportando(false)
    }
  }


  return (
    <div className="reportes">

      {/* HEADER */}
      <div className="reportes-header">

        <div>
          <h1>Reportes</h1>

          <p>
            Consultá el rendimiento de las ventas
          </p>
        </div>


        <button
          type="button"
          className="btn-exportar-excel"
          onClick={exportarExcel}
          disabled={exportando}
        >
          {exportando
            ? 'Exportando...'
            : 'Exportar a Excel'}
        </button>

      </div>


      {/* FILTROS */}
      <div className="reportes-filtros">

        <div className="reporte-filtro">
          <label>Desde</label>

          <input
            type="date"
            value={fechaDesde}
            onChange={(e) =>
              setFechaDesde(e.target.value)
            }
          />
        </div>


        <div className="reporte-filtro">
          <label>Hasta</label>

          <input
            type="date"
            value={fechaHasta}
            onChange={(e) =>
              setFechaHasta(e.target.value)
            }
          />
        </div>


        <div className="reporte-filtro">
          <label>Vendedor</label>

          <select
            value={vendedorId}
            onChange={(e) =>
              setVendedorId(e.target.value)
            }
          >
            <option value="">
              Todos los vendedores
            </option>

            {vendedores.map((vendedor) => (
              <option
                key={vendedor.id}
                value={vendedor.id}
              >
                {vendedor.nombre}
              </option>
            ))}

          </select>
        </div>


        <button
          type="button"
          className="btn-limpiar-reporte"
          onClick={limpiarFiltros}
        >
          Limpiar filtros
        </button>

      </div>


      {/* ERROR */}
      {error && (
        <div className="reportes-error">
          {error}
        </div>
      )}


      {/* RESUMEN */}
      <div className="reportes-resumen">

        <div className="reporte-card">

          <span>
            Ventas realizadas
          </span>

          <strong>
            {cargando
              ? '...'
              : resumen.cantidad_ventas}
          </strong>

          <small>
            Cantidad total de operaciones
          </small>

        </div>


        <div className="reporte-card">

          <span>
            Total vendido
          </span>

          <strong>
            {cargando
              ? '...'
              : formatearDinero(
                  resumen.total_vendido
                )}
          </strong>

          <small>
            Importe total de las ventas
          </small>

        </div>

      </div>

    </div>
  )
}


export default Reportes