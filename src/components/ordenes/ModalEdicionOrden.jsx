import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionOrden = ({
  mostrar,
  setMostrar,
  ordenEnEdicion,
  setOrdenEnEdicion,
  actualizarOrden,
}) => {
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setOrdenEnEdicion((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      backdrop="static"
      show={mostrar}
      onHide={() => setMostrar(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Orden</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="id_venta">
            <Form.Label>ID de la venta</Form.Label>
            <Form.Control
              type="text"
              name="id_venta"
              value={ordenEnEdicion?.id_venta || ""}
              onChange={manejarCambio}
              placeholder="1, 2, 3 ..."
              maxLength={4}
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="fecha_orden">
            <Form.Label>Fecha de la orden</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="fecha_orden"
              value={ordenEnEdicion?.fecha_orden || ""}
              onChange={manejarCambio}
              placeholder="2025-10-10"
              maxLength={50}
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
          onClick={actualizarOrden}
          disabled={!String(ordenEnEdicion?.id_venta ?? "").trim()}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionOrden;