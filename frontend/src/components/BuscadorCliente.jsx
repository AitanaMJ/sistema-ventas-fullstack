import { useEffect, useState } from 'react'

import { obtenerClientes } from '../services/clienteService'

import './BuscadorCliente.css'


function BuscadorCliente({
  clienteSeleccionado,
  onSeleccionar,
  permitirConsumidorFinal = false,
}) {
  const [busqueda, setBusqueda] = useState('')
  const [resultados, setResultados] = useState([])
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [cargando, setCargando] = useState(false)


  // =========================================================
  // BUSCAR CLIENTES
  // =========================================================
  useEffect(() => {
    if (!busqueda.trim()) {
      setResultados([])
      return
    }

    const timeout = setTimeout(async () => {
      try {
        setCargando(true)

        const respuesta = await obtenerClientes(
          busqueda,
          1,
          10
        )

        setResultados(respuesta.clientes)
      } catch (error) {
        console.error(
          'Error al buscar clientes:',
          error
        )
      } finally {
        setCargando(false)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [busqueda])


  // =========================================================
  // SELECCIONAR CLIENTE
  // =========================================================
  const seleccionarCliente = (cliente) => {
    onSeleccionar(cliente)

    setBusqueda('')
    setResultados([])
    setMostrarResultados(false)
  }


  // =========================================================
  // CONSUMIDOR FINAL
  // =========================================================
  const seleccionarConsumidorFinal = () => {
    onSeleccionar(null)

    setBusqueda('')
    setResultados([])
    setMostrarResultados(false)
  }


  // =========================================================
  // CAMBIAR CLIENTE
  // =========================================================
  const cambiarCliente = () => {
    onSeleccionar(null)

    setBusqueda('')
    setResultados([])
    setMostrarResultados(false)
  }


  return (
    <div className="buscador-cliente">

      {/* SI HAY UN CLIENTE SELECCIONADO */}
      {clienteSeleccionado ? (

        <div className="cliente-seleccionado">

          <div className="cliente-seleccionado-info">

            <strong>
              {clienteSeleccionado.nombre}
            </strong>

            <span>
              {clienteSeleccionado.email}
            </span>

          </div>

          <button
            type="button"
            onClick={cambiarCliente}
          >
            Cambiar
          </button>

        </div>

      ) : (

        <>
          {/* BUSCADOR */}
          <div className="buscador-cliente-input-contenedor">

            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value)
                setMostrarResultados(true)
              }}
              onFocus={() => {
                if (busqueda.trim()) {
                  setMostrarResultados(true)
                }
              }}
              autoComplete="off"
            />

            {busqueda && (
              <button
                type="button"
                className="buscador-cliente-limpiar"
                onClick={() => {
                  setBusqueda('')
                  setResultados([])
                  setMostrarResultados(false)
                }}
              >
                ×
              </button>
            )}

          </div>


          {/* CONSUMIDOR FINAL */}
          {permitirConsumidorFinal && (
  <button
    type="button"
    className="consumidor-final-card"
    onClick={seleccionarConsumidorFinal}
  >
    <span className="consumidor-final-icono">
      ✓
    </span>

    <span className="consumidor-final-texto">
      <strong>Consumidor final</strong>
      <small>Venta sin cliente registrado</small>
    </span>
  </button>
)}


          {/* RESULTADOS */}
          {mostrarResultados && busqueda.trim() && (

            <div className="buscador-cliente-resultados">

              {cargando ? (

                <div className="buscador-cliente-mensaje">
                  Buscando...
                </div>

              ) : resultados.length > 0 ? (

                resultados.map((cliente) => (

                  <button
                    type="button"
                    key={cliente.id}
                    className="buscador-cliente-resultado"
                    onClick={() =>
                      seleccionarCliente(cliente)
                    }
                  >

                    <strong>
                      {cliente.nombre}
                    </strong>

                    <span>
                      {cliente.email}
                    </span>

                  </button>

                ))

              ) : (

                <div className="buscador-cliente-mensaje">
                  No se encontraron clientes
                </div>

              )}

            </div>

          )}

        </>

      )}

    </div>
  )
}


export default BuscadorCliente