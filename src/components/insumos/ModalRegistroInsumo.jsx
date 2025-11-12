import { Modal, Form, Button, Row, Col } from "react-bootstrap";

// helper: convertir cualquier valor de fecha a formato compatible con input type="datetime-local"
const toDatetimeLocal = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d)) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const ModalRegistroInsumo = ({
  mostrarModal,
  setMostrarModal,
  nuevoInsumo,
  manejarCambioInput,
  agregarInsumo,
 }) => {
  return (
    <Modal
      backdrop="static"
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Insumo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="fecha_insumo">
            <Form.Label>Fecha Insumo *</Form.Label>
            <Form.Control
              type="datetime-local"
              name="fecha_insumo"
              value={toDatetimeLocal(nuevoInsumo.fecha_insumo)}
              onChange={manejarCambioInput}
              required
            />
            <Form.Text className="text-muted">
              Por defecto es hoy, pero puedes cambiarla.
            </Form.Text>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="total_insumo">
                <Form.Label>Total</Form.Label>
                <Form.Control
                  type="text"
                  name="total_insumo"
                  value={nuevoInsumo.total_insumo}
                  onChange={manejarCambioInput}
                  maxLength={20}
                  placeholder="Ej: 5"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={agregarInsumo}
          disabled={
            !nuevoInsumo.fecha_insumo || !nuevoInsumo.total_insumo.trim()
          }
        >
          Guardar Insumo
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroInsumo;
