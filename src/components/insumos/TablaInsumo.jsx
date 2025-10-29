import { Table, Spinner } from "react-bootstrap";
import { useState } from "react";
import BotonOrden from "../ordenamiento/BotonOrden";

const TablaInsumos = ({ insumos, cargando }) => {
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
          <BotonOrden
              campo="id_insumo"
              orden={orden}
              manejarOrden={manejarOrden}
            >
              ID Insumo
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
        {insumosOrdenados.map((insumo) => {
          return (
          <tr key={insumo.id_insumo}>
            <td>{insumo.id_insumo}</td>
            <td>{insumo.fecha_insumo}</td>
            <td>{insumo.total_insumo}</td>
            <td>Acción</td>
          </tr>
            );    
        })}
        </tbody>
      </Table>
    </>
  );
}

export default TablaInsumos;  
