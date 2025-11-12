import { Modal, Form, Button, Row, Col } from "react-bootstrap";

// helper: convertir a formato yyyy-MM-ddThh:mm para datetime-local
const toDatetimeLocal = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d)) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const ModalEdicionInsumo = ({
  mostrar,
  setMostrar,
  insumoEditado,
  setInsumoEditado,
  guardarEdicion,
}) => {

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setInsumoEditado((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal backdrop="static" show={mostrar} onHide={() => setMostrar(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Insumo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="fecha_insumo">
            <Form.Label>Fecha Insumo*</Form.Label>
            <Form.Control
              type="datetime-local"
              name="fecha_insumo"
              value={toDatetimeLocal(insumoEditado?.fecha_insumo)}
              onChange={manejarCambio}
              required
            />
          </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="total_insumo">
                <Form.Label>  Total</Form.Label>
                <Form.Control
                  type="text"
                  name="total_insumo"
                  value={insumoEditado?.total_insumo || ''}
                  onChange={manejarCambio}
                  maxLength={20}
                />
              </Form.Group>
            </Col>
          </Row>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={guardarEdicion}
          disabled={
            !insumoEditado?.total_insumo ||
            !insumoEditado?.fecha_insumo
          }
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionInsumo;