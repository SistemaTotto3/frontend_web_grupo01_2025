import { useState, useEffect } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import TablaCliente from "../components/clientes/TablaCliente";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Clientes = () => {

  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const obtenerClientes= async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/cliente");
      if (!respuesta.ok) {
        throw new Error("Error al obtener los clientes");
      }
      const datos = await respuesta.json();
      setClientes(datos);
      setClientesFiltrados(datos);
      setCargando(false);
    } catch (error) {
      console.error(error.message);
      setCargando(false);
    }
  };
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    if (texto.trim() === "") {
    setClientesFiltrados(clientes);
    return;
  }
    const filtrados = clientes.filter(
      (cliente) =>
        cliente.nombre_1.toLowerCase().includes(texto) ||
         cliente.apellido_1.toLowerCase().includes(texto) ||
         cliente.direccion_cliente.toLowerCase().includes(texto) ||
         cliente.telefono_cliente.toLowerCase().includes(texto) 
    );
    setClientesFiltrados(filtrados);
  }

  useEffect(() => {
    obtenerClientes();
  }, []);
  return (
    <>
      <Container className="mt-4">
        <h4> Clientes </h4>

        <Row>
          <Col lg={5} md={8} sm={8} xs={7}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>
        </Row>

        <TablaClientes
         clientes={clientesFiltrados} 
         cargando={cargando}
       />
      </Container>
    </>
  );
};

export default Clientes;

