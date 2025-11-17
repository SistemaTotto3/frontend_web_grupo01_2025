import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionUsuario = ({
  mostrar,
  setMostrar,
  usuarioEditado,
  setUsuarioEditado,
  guardarEdicion,
}) => {
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setUsuarioEditado((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal backdrop="static" show={mostrar} onHide={() => setMostrar(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="nombreUsuario">
            <Form.Label>Nombre Usuario</Form.Label>
            <Form.Control
              type="text"
              name="nombre_usuario"
              value={usuarioEditado?.nombre_usuario || ""}
              onChange={manejarCambio}
              placeholder="Ej: juan"
              maxLength={50}
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="contrasena">
            <Form.Label>Contraseña (hash)</Form.Label>
            <Form.Control
              type="text"
              name="contraseña_hash"
              value={usuarioEditado?.contraseña_hash || ""}
              onChange={manejarCambio}
              placeholder="hash..."
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="rol">
            <Form.Label>Rol</Form.Label>
            <Form.Control
              type="text"
              name="rol"
              value={usuarioEditado?.rol || ""}
              onChange={manejarCambio}
              placeholder="Ej: admin"
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={guardarEdicion}
          disabled={!usuarioEditado?.nombre_usuario?.trim()}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionUsuario;
