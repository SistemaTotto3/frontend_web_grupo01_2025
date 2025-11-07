import React, {useState} from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";

const TablaCliente = ({ clientes, cargando }) => {

  const [orden, setOrden] = useState({ campo: "id_cliente", direccion: "asc" });

  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion:
        prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  const ClientesOrdenados = [...clientes].sort((a, b) => {
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
      <Table striped bordered hover>
        <thead>
          <tr>
            <BotonOrden campo="id_cliente" orden={orden} manejarOrden={manejarOrden}>
              ID
            </BotonOrden>

            <BotonOrden campo="nombre_1" orden={orden} manejarOrden={manejarOrden}>
              Primer Nombre
            </BotonOrden>

            <BotonOrden campo="apellido_1" orden={orden} manejarOrden={manejarOrden}>
              Segundo Nombre
            </BotonOrden>

            <BotonOrden campo="direccion_cliente" orden={orden} manejarOrden={manejarOrden}>
              Direccion cliente
            </BotonOrden>

            <BotonOrden campo="telefono_cliente" orden={orden} manejarOrden={manejarOrden}>
              Telefono Cliente
  
            </BotonOrden>

            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ClientesOrdenados.map((cliente) => {
            return (
              <tr key={cliente.idCliente}>
                <td>{cliente.idCliente}</td>
                <td>{cliente.nombre_1}</td>
                <td>{cliente.apellido_1}</td>
                <td>{cliente.direccion_cliente}</td>
                <td>{cliente.telefono_cliente}</td>

                <td>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2"
                    onClick={() => abrirModalEdicion(cliente)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => abrirModalEliminacion(cliente)}
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

export default TablaCliente;
