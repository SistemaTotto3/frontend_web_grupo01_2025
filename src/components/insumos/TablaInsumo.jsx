// TablaInsumos.jsx - Tabla para mostrar insumos con columnas para ID, fecha y total.
// Se guía por TablaClientes: incluye BotonOrden para cada columna, spinner para carga,
// y columna de Acciones con botones para editar y eliminar (usando icons de Bootstrap).
// Props: abrirModalEdicion y abrirModalEliminacion (pasados desde padre, similar a clientes).

import { Table, Spinner, Button } from "react-bootstrap";
import React, { useState } from "react";
import BotonOrden from "../ordenamiento/BotonOrden";
import Paginacion from "../ordenamiento/Paginacion";

const TablaInsumo = ({
  insumos,
  cargando,
  abrirModalEdicion,
  abrirModalEliminacion,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual
}) => {
  const [orden, setOrden] = useState({ campo: "id_insumo", direccion: "asc" });

  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  const insumosOrdenados = [...insumos].sort((a, b) => {
    const valorA = a[orden.campo] ?? "";
    const valorB = b[orden.campo] ?? "";
    if (typeof valorA === "number" && typeof valorB === "number") {
      return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
    }
     const comparacion = String(valorA).localeCompare(String(valorB));
    return orden.direccion === "asc" ? comparacion : -comparacion;
  });

  if (cargando) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      <Table striped bordered hover className="mt-3">
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
              Total
            </BotonOrden>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {insumosOrdenados.map((ins) => (
            <tr key={ins.id_insumo}>
              <td>{ins.id_insumo}</td>
              <td>
                {new Date(ins.fecha_insumo).toLocaleString("es-NI", {
                  timeZone: "America/Managua",
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </td>
              <td>{ins.total_insumo}</td>
              <td>
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

      <Paginacion
        elementosPorPagina={elementosPorPagina}
        totalElementos={totalElementos}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />
    </>
  );
};

export default TablaInsumo;