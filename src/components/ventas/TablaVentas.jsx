import React, { useState } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";
import Paginacion from "../ordenamiento/paginacion";

const TablaVentas = ({
  ventas,
  cargando,
  abrirModalEdicion,
  abrirModalEliminacion,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
}) => {

  if (cargando) return <div className="text-center">cargando ventas...</div>;

  const [orden, setOrden] = useState({
    campo: "id_venta",
    direccion: "asc",
  });

  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion:
        prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  const ventasOrdenadas = [...ventas].sort((a, b) => {
    const aVal = a[orden.campo];
    const bVal = b[orden.campo];
    return orden.direccion === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  if (cargando) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <BotonOrden campo="id_venta" orden={orden} manejarOrden={manejarOrden}>
              ID
            </BotonOrden>
            <BotonOrden campo="idCliente" orden={orden} manejarOrden={manejarOrden}>
              Cliente
            </BotonOrden>
            <BotonOrden campo="fecha_venta" orden={{campo: 'fecha_venta', direccion: 'asc'}} manejarOrden={manejarOrden}>
              Fecha
            </BotonOrden>
            <BotonOrden campo="total_venta" orden={orden} manejarOrden={manejarOrden}>
              Total
            </BotonOrden>
            <BotonOrden campo="estado_venta" orden={orden} manejarOrden={manejarOrden}>
              Estado
            </BotonOrden>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {ventasOrdenadas.map((v) => (
            <tr key={v.id_venta}>
              <td>{v.id_venta}</td>
              <td>{v.idCliente}</td>
              <td>{new Date(v.fecha_venta).toLocaleString()}</td>
              <td>C${parseFloat(v.total_venta).toFixed(2)}</td>
              <td>{v.estado_venta}</td>
              <td>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(v)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(v)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Paginacion
        elementosPorPagina={elementosPorPagina}
        totalElementos={totalElementos}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />
    </>
  );
};

export default TablaVentas;