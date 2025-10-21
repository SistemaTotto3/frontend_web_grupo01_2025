import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import TablaProducto from "../components/productos/TablaProducto";

const Productos = () => {
  const [producto, setProducto] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/Productos");
      if (!respuesta.ok) {
        throw new Error("Error al obtener los productos");
      }

      const datos = await respuesta.json();
      setProducto(datos);
      setCargando(false);
    } catch (error) {
      console.error(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <>
      <Container className = "mt-4">
        <h4> Productos </h4>
        <TablaProducto producto={producto}
        cargando={cargando}/>
      </Container>
    </>
  );
}

export default Productos;