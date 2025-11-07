import { useState, useEffect } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import TablaCliente from "../components/clientes/TablaCliente";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroCliente from "../components/clientes/ModalRegistroCliente";
import ModalRegistroCliente from "../components/clientes/ModalRegistroCliente";
import ModalEdicionCliente from "../components/clientes/ModalEdicionCliente";

const Clientes = () => {

  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

  const [clienteEditada, setClienteEditada] = useState(null);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);

 const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre_1: '',
    apellido_1: '',
    direccion_cliente: '',
    telefono_cliente: ''
  });
 const abrirModalEdicion = (cliente) => {
    setClienteEditada({ ...cliente });
    setMostrarModalEdicion(true);
  };
   const guardarEdicion = async () => {
    if (!clienteEditada.nombre_1.trim()) return;

    try {
      const respuesta = await fetch(
        `http://localhost:3002/api/actualizarclientepatch/${clienteEditada.id_cliente}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clienteEditada),
        }
      );

      if (!respuesta.ok) throw new Error('Error al actualizar');

      setMostrarModalEdicion(false);
      await obtenerClientes();
    } catch (error) {
      console.error("Error al editar cliente:", error);
      alert("No se pudo actualizar la cliente.");
    }
  };

  
  const abrirModalEliminacion = (cliente) => {
    setClienteAEliminar(categoria);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminacion = async () => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/eliminarcliente/${clienteAEliminar.id_cliente}`,
        {
          method: 'DELETE',
        }
      );

      if (!respuesta.ok) throw new Error('Error al eliminar');

      setMostrarModalEliminar(false);
      setClienteAEliminar(null);
      await obtenerClientes();
    } catch (error) {
      console.error("Error al eliminar clientes:", error);
      alert("No se pudo eliminar la cliente.");
    }
  };


    const agregarCliente = async () => {
    if (!nuevoCliente.nombre_1.trim()) return;

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarcliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoCliente)
      });

      if (!respuesta.ok) throw new Error('Error al guardar');

      // Limpiar y cerrar el modal
      setNuevoCliente({
        nombre_1: '',
        apellido_1: '',
        direccion_cliente: '',
        telefono_cliente: ''
       });

      setMostrarModal(false);
      await obtenerClientes(); // Refresca la lista
    } catch (error) {
      console.error("Error al agregar cliente:", error);
      alert("No se pudo guardar la cliente. Revisa la consola.");
    }
  };

   const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoCliente(prev => ({ ...prev, [name]: value }));
  };

  const obtenerClientes= async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/Clientes");
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

            <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => setMostrarModal(true)}
          >
            + Nuevo Cliente
          </Button>
        </Col>

        <TablaCliente
          clientes={clientesFiltrados}
          cargando={cargando}
          abrirModalEdicion={abrirModalEdicion}
          abrirModalEliminacion={abrirModalEliminacion}
        />

                <ModalRegistroCliente
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevaCliente={nuevaCliente}
          manejarCambioInput={manejarCambioInput}
          agregarCliente={agregarCliente}
        />

                <ModalEdicionCliente
          mostrar={mostrarModalEdicion}
          setMostrar={setMostrarModalEdicion}
          clienteEditada={clienteEditada}
          setClienteEditada={setClienteEditada}
          guardarEdicion={guardarEdicion}
        />

       
         <ModalRegistroCliente
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoCliente={nuevoCliente}
          manejarCambioInput={manejarCambioInput}
          agregarCliente={agregarCliente}
        />
        
      </Container>
    </>
  );
};

export default Clientes;

