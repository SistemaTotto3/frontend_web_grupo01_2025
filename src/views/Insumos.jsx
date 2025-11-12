import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import TablaInsumo from '../components/insumos/TablaInsumo';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import ModalRegistroInsumo from '../components/insumos/ModalRegistroInsumo';
import ModalEdicionInsumo from '../components/insumos/ModalEdicionInsumo';
import ModalEliminacionInsumo from '../components/insumos/ModalEliminacionInsumo';

const Insumos = () => {
   const [insumos, setInsumo] = useState([]);
   const [cargando, setCargando] = useState(true);

   const [insumosFiltrados, setInsumosFiltrados] = useState([]);
   const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [insumoEditado, setInsumoEditado] = useState(null);

  const [insumoAEliminar, setInsumoAEliminar] = useState(null);
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  // Fecha actual en formato YYYY-MM-DD (para input type="date")
 const fechaHoraActual = new Date().toISOString().slice(0, 16);

  const [nuevoInsumo, setNuevoInsumo] = useState({
    fecha_insumo: new Date().toISOString().slice(0, 16),
        total_insumo: ''
  });

  const insumosPaginados = insumosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoInsumo(prev => ({ ...prev, [name]: value }));
  };

  const agregarInsumo = async () => {
    if (!nuevoInsumo.total_insumo.trim() ) return;
    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarinsumo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoInsumo)
      });
      if (!respuesta.ok) throw new Error('Error al guardar');
      setNuevoInsumo({
        fecha_insumo: new Date().toISOString().slice(0, 16),
        total_insumo: ''
      });
      setMostrarModal(false);
      await obtenerInsumos();
    } catch (error) {
      console.error("Error al agregar insumo:", error);
      alert("No se pudo guardar el insumo. Revisa la consola.");
    }
  };

  const obtenerInsumos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/insumo');
      if (!respuesta.ok) throw new Error('Error al obtener insumos');
      const datos = await respuesta.json();
      setInsumo(datos);
      setInsumosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      console.error(error.message);
      setCargando(false);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    const filtrados = insumos.filter(ins =>
      ins.total_insumo.toLowerCase().includes(texto) 
    );
    setInsumosFiltrados(filtrados);
  };

  const abrirModalEdicion = (insumo) => {
    setInsumoEditado({ ...insumo }); // ← Carga fecha tal como está en BD
    setMostrarModalEdicion(true);
  };

  const guardarEdicion = async () => {
    if (!insumoEditado.total_insumo.trim()) return;
    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarInsumoPatch/${insumoEditado.id_insumo}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(insumoEditado)
      });
      if (!respuesta.ok) throw new Error('Error al actualizar');
      setMostrarModalEdicion(false);
      await obtenerInsumos();
    } catch (error) {
      console.error("Error al editar insumo:", error);
      alert("No se pudo actualizar el insumo.");
    }
  };

  const abrirModalEliminacion = (insumo) => {
    setInsumoAEliminar(insumo);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminacion = async () => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarinsumo${insumoAEliminar.id_insumo}`, {
        method: 'DELETE',
      });
      if (!respuesta.ok) throw new Error('Error al eliminar');
      setMostrarModalEliminar(false);
      setEmpleadoAEliminar(null);
      await obtenerInsumos();
    } catch (error) {
      console.error("Error al eliminar insumo:", error);
      alert("No se pudo eliminar el insumo. Puede estar en uso.");
    }
  };

  useEffect(() => {
    obtenerInsumos();
   }, []);

   return (
    <>
      <Container className="mt-4">
        <h4>Insumos</h4>
         <Row>
          <Col lg={5} md={6} sm={8} xs={12}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>
          <Col className="text-end">
            <Button
              className='color-boton-registro'
              onClick={() => setMostrarModal(true)}
            >
              + Nuevo Insumo
            </Button>
          </Col>
        </Row>

        <TablaInsumo
          insumos={insumosPaginados}
          cargando={cargando}
          abrirModalEdicion={abrirModalEdicion}
          abrirModalEliminacion={abrirModalEliminacion}
          totalElementos={insumos.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
        />

        <ModalRegistroInsumo
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoInsumo={nuevoInsumo}
          manejarCambioInput={manejarCambioInput}
          agregarInsumo={agregarInsumo}
        />

        <ModalEdicionInsumo
          mostrar={mostrarModalEdicion}
          setMostrar={setMostrarModalEdicion}
          insumoEditado={insumoEditado}
          setInsumoEditado={setInsumoEditado}
          guardarEdicion={guardarEdicion}
        />

        <ModalEliminacionInsumo
          mostrar={mostrarModalEliminar}
          setMostrar={setMostrarModalEliminar}
          insumo={insumoAEliminar}
          confirmarEliminacion={confirmarEliminacion}
        />
      </Container>
    </>
  );
};

export default Insumos;