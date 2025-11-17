import { Table, Button, Pagination, Spinner } from "react-bootstrap";
import { useState } from "react";
import BotonOrden from "../ordenamiento/BotonOrden";

const TablaInsumo = ({
  insumos,
  cargando,
  obtenerDetalles,
  abrirModalEdicion,
  abrirModalEliminacion,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
}) => {
  if (cargando) return <div className="text-center">Cargando insumos...</div>;

  const totalPaginas = Math.ceil(totalElementos / elementosPorPagina);
  const [orden, setOrden] = useState({
    campo: "id_insumo",
    direccion: "asc",
  });
  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion:
        prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  const insumosOrdenados = [...insumos].sort((a, b) => {
    const valorA = a[orden.campo];
    const valorB = b[orden.campo];

    if (typeof valorA === "number" && typeof valorB === "number") {
      return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
    }

    const comparacion = String(valorA).localeCompare(String(valorB));
    return orden.direccion === "asc" ? comparacion : -comparacion;
  });

  if (cargando) {
    return (
      <>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </>
    );
  }

  return (
    <>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <BotonOrden
              campo="id_insumo"
              orden={orden}
              manejarOrden={manejarOrden}
            >
              ID
            </BotonOrden>
            <BotonOrden
              campo="fecha_insumo"
              orden={orden}
              manejarOrden={manejarOrden}
            >
              Fecha Insumo
            </BotonOrden>
            <BotonOrden
              campo="total_insumo"
              orden={orden}
              manejarOrden={manejarOrden}
            >
              Total Insumo
            </BotonOrden>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {insumosOrdenados.map((ins) => (
            <tr key={ins.id_insumo}>
              <td>{ins.id_insumo}</td>
              <td>
                {new Date(ins.fecha_insumo).toLocaleDateString("es-NI", {
                  timeZone: "America/Managua",
                })}
              </td>
              <td>C$ {parseFloat(ins.total_insumo).toFixed(2)}</td>
              <td>
                <Button
                  size="sm"
                  variant="outline-info"
                  onClick={() => obtenerDetalles(ins.id_insumo)}
                >
                  Detalles
                </Button>{" "}
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(ins)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(ins)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {[...Array(totalPaginas)].map((_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === paginaActual}
            onClick={() => establecerPaginaActual(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </>
  );
};

export default TablaInsumo;
