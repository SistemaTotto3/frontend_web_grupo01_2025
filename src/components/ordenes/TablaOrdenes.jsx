import React, { useState } from "react";
import { Table, Button, Pagination, Spinner } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";

const TablaOrdenes = ({
  ordenes,
  cargando,
  abrirModalEdicion,
  abrirModalEliminacion,
  obtenerDetalles,       
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
}) => {
  if (cargando) return <div className="text-center">Cargando órdenes...</div>;

  const totalPaginas = Math.ceil(totalElementos / elementosPorPagina);

  const [orden, setOrden] = useState({ campo: "idOrden", direccion: "asc" });

  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion:
        prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  const ordenesOrdenadas = [...ordenes].sort((a, b) => {
    const aVal = a[orden.campo];
    const bVal = b[orden.campo];

    if (typeof aVal === "number" && typeof bVal === "number") {
      return orden.direccion === "asc" ? aVal - bVal : bVal - aVal;
    }

    const comp = String(aVal).localeCompare(String(bVal));
    return orden.direccion === "asc" ? comp : -comp;
  });

  return (
    <>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <BotonOrden campo="idOrden" orden={orden} manejarOrden={manejarOrden}>
              ID Orden
            </BotonOrden>
            <BotonOrden campo="id_venta" orden={orden} manejarOrden={manejarOrden}>
              ID Venta
            </BotonOrden>
            <BotonOrden campo="fecha_orden" orden={orden} manejarOrden={manejarOrden}>
              Fecha Orden
            </BotonOrden>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {ordenesOrdenadas.map((orden) => (
            <tr key={orden.idOrden}>
              <td>{orden.idOrden}</td>
              <td>{orden.id_venta}</td>
              <td>{new Date(orden.fecha_orden).toLocaleString()}</td>

              <td>
                <Button
                  size="sm"
                  variant="outline-info"
                  className="me-2"
                  onClick={() => obtenerDetalles(orden.idOrden)}   
                >
                  Detalles
                </Button>

                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(orden)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(orden)}
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

export default TablaOrdenes;