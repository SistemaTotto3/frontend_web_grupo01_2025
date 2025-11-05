import React, { useState } from "react";
import { Table, Spinner } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";

const TablaProducto = ({ productos = [], cargando }) => {
  const [orden, setOrden] = useState({ campo: "id_producto", direccion: "asc" });

  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  const productosOrdenados = [...(productos || [])].sort((a, b) => {
    const valorA = a?.[orden.campo];
    const valorB = b?.[orden.campo];

    if (typeof valorA === "number" && typeof valorB === "number") {
      return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
    }

    const comparacion = String(valorA ?? "").localeCompare(String(valorB ?? ""));
    return orden.direccion === "asc" ? comparacion : -comparacion;
  });

  if (cargando) {
    return (
      <>
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      </>
    );
  }

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <BotonOrden campo="id_producto" orden={orden} manejarOrden={manejarOrden}>
              ID Producto
            </BotonOrden>

            <BotonOrden campo="id_categoria" orden={orden} manejarOrden={manejarOrden}>
              ID Categoría
            </BotonOrden>

            <BotonOrden campo="nombre_producto" orden={orden} manejarOrden={manejarOrden}>
              Nombre Producto
            </BotonOrden>

            <BotonOrden campo="precio_costo" orden={orden} manejarOrden={manejarOrden}>
              Precio Costo
            </BotonOrden>

            <BotonOrden campo="precio_venta" orden={orden} manejarOrden={manejarOrden}>
              Precio Venta
            </BotonOrden>

            <BotonOrden campo="existencia" orden={orden} manejarOrden={manejarOrden}>
              Existencia
            </BotonOrden>

            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosOrdenados.length > 0 ? (
            productosOrdenados.map((prod) => (
              <tr key={prod.id_producto}>
                <td>{prod.id_producto}</td>
                <td>{prod.id_categoria}</td>
                <td>{prod.nombre_producto}</td>
                <td>{prod.precio_costo}</td>
                <td>{prod.precio_venta}</td>
                <td>{prod.existencia}</td>
                <td>Acciones</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                No hay productos
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};

export default TablaProducto;
