import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaUsuarios from "../components/usuarios/TablaUsuarios";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroUsuario from "../components/usuarios/ModalRegistroUsuario";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre_usuario: "",
    contraseña_hash: "",
    rol: "",
  });

  const obtenerUsuarios = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/Usuarios");
      if (!respuesta.ok) throw new Error("Error al obtener usuarios");
      const datos = await respuesta.json();
      setUsuarios(datos);
      setUsuariosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      console.error(error);
      setCargando(false);
    }
  };

  const agregarUsuario = async () => {
    if (!nuevoUsuario.nombre_usuario?.trim())
      return;

    try {
      const respuesta = await fetch("http://localhost:3000/api/registrarUsuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });

      if (!respuesta.ok) throw new Error("Error al guardar");

      setNuevoUsuario({
    nombre_usuario: "",
    contraseña_hash: "",
    rol: "",
      });

      setMostrarModal(false);
      await obtenerUsuarios();
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      alert("No se pudo guardar el usuario. Revisa la consola.");
    }
  };

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    if (texto.trim() === "") {
      setUsuariosFiltrados(usuarios);
      return;
    }

    const filtrados = usuarios.filter((usuario) => {
      return (
        usuario.nombre_usuario?.toLowerCase().includes(texto) ||
        usuario.contraseña_hash?.toLowerCase().includes(texto) ||
        usuario.rol?.toLowerCase().includes(texto) 
      );
    });

    setUsuariosFiltrados(filtrados);
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return (
    <Container className="mt-4">
      <h4> Usuarios </h4>

      <Row>
        <Col lg={5} md={8} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>

      <Col className="text-end">
        <Button variant="primary" onClick={() => setMostrarModal(true)}>
          + Nuevo Usuario
        </Button>
      </Col>

      <TablaUsuarios usuarios={usuariosFiltrados} cargando={cargando} />

      <ModalRegistroUsuario
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoUsuario={nuevoUsuario}
        manejarCambioInput={manejarCambioInput}
        agregarUsuario={agregarUsuario}
      />
    </Container>
  );
};

export default Usuarios;