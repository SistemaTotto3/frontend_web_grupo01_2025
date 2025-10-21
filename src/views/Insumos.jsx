import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import TablaInsumos from "../components/insumos/TablaInsumo";

const Insumos = () => {
  const [insumos, setinsumos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/insumo");
      if (!respuesta.ok) {
        throw new Error("Error al obtener los insumos");
      }
      const datos = await respuesta.json();
      setinsumos(datos);
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
      <Container className="mt-4">
        <h4> Insumos </h4>
        <TablaInsumos insumos={insumos} cargando={cargando} />
      </Container>
    </>
  );
};
export default Insumos;
