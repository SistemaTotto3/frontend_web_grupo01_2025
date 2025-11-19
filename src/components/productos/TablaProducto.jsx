import React, { useState } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";
import Paginacion from "../ordenamiento/Paginacion";

const TablaProducto = ({
  productos = [],
  cargando,
  abrirModalEdicion,
  abrirModalEliminacion,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
}) => {
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

            <BotonOrden campo="imagen" orden={orden} manejarOrden={manejarOrden}>
              Imagen
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
                <td>
                  {prod.imagen ? (
                    <img
                      src={`data:image/png;base64,${prod.imagen}`}
                      alt={prod.nombre_producto}
                      width={50}
                      height={50}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    "Sin imagen"
                  )}
                </td>
                <td>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2"
                    onClick={() => abrirModalEdicion(prod)}
                    aria-label={`Editar producto ${prod.id_producto}`}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => abrirModalEliminacion(prod)}
                    aria-label={`Eliminar producto ${prod.id_producto}`}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
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
      <Paginacion
        elementosPorPagina={elementosPorPagina}
        totalElementos={totalElementos}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />
    </>
  );
};

export default TablaProducto;
