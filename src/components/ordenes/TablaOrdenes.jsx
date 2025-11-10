import React, {useState} from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";


const TablaOrdenes = ({ ordenes, cargando, cargando, abrirModalEdicion, abrirModalEliminacion}) => {

  const [orden, setOrden] = useState({ campo: "idOrden", direccion: "asc" });

  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion:
        prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };


  const ordenesOrdenadas = [...ordenes].sort((a, b) => {
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
        <Spinner animation="border">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </>
    );
  }

  return (
    <>
      <Table variant="primary" striped bordered hover>
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
          {ordenes.map((orden) => {
            return(
              <tr key={orden.idOrden}>
                <td>{orden.idOrden}</td>
                <td>{orden.id_venta}</td>
                <td>{orden.fecha_orden}</td>
                <td>
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
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default TablaOrdenes;
