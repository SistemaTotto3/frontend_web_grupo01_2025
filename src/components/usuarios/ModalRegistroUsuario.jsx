import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroUsuario = ({
  mostrarModal,
  setMostrarModal,
  nuevoUsuario,
  manejarCambioInput,
  agregarUsuario,
}) => {

  return (
    <Modal
      backdrop="static"
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Cliente</Modal.Title>
      </Modal.Header>
        <Modal.Body>
          <Row className="g-2">
            <Col md={6}>
              <Form.Group controlId="nombre_usuario">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre_usuario"
                  value={nuevoUsuario.nombre_usuario}
                  onChange={manejarCambioInput}
                  placeholder="Nombre"
                  required
                  autoFocus
                />
              </Form.Group>
            </Col>


            <Col md={6} className="mt-3">
              <Form.Group controlId="contraseña_hash">
                <Form.Label>contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="contraseña_hash"
                  value={nuevoUsuario.contraseña_hash}
                  onChange={manejarCambioInput}
                  placeholder="Ej: admin"
                />
              </Form.Group>
            </Col>


            <Col md={6} className="mt-3">
              <Form.Group controlId="rol">
                <Form.Label>Rol</Form.Label>
                <Form.Control
                  type="text"
                  name="rol"
                  value={nuevoUsuario.rol}
                  onChange={manejarCambioInput}
                  placeholder="Ej: admin"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={agregarUsuario}
            disabled={!nuevoUsuario.nombre_usuario?.trim()}
          >
            Guardar Usuario
          </Button>
        </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroUsuario;