import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import Tarjeta from "../components/catalogo/Tarjeta";

const CatalogoProductos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Obtener productos
  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/productos");
      if (!respuesta.ok) throw new Error("Error al cargar los productos");
      const datos = await respuesta.json();
      setListaProductos(datos);
      setCargando(false);
    } catch (error) {
      console.log("Error al cargar los productos.");
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  if (cargando) return <div>Cargando...</div>;

  return (
    <Container className="mt-5">
      <h4>Catálogo de Productos</h4>
      <Row>
        {listaProductos.map((producto) => (
          <Tarjeta
            key={producto.id_producto}
            id_categoria={producto.id_categoria}
            nombre_producto={producto.nombre_producto}
            precio_costo={producto.precio_costo}
            precio_venta={producto.precio_venta}
            existencia={producto.existencia}
            imagen={producto.imagen}
          />
        ))}
      </Row>
    </Container>
  );
};

export default CatalogoProductos;