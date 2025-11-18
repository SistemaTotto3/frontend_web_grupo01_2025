import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalEdicionVenta = ({
  mostrar,
  setMostrar,
  ventaEditada,
  setVentaEditada,
  guardarEdicion,
}) => {
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setVentaEditada((prev) => ({ ...prev, [name]: value }));
  };

  const hoy = new Date().toISOString().split("T")[0];


  return (
    <Modal centered backdrop="static" show={mostrar} onHide={() => setMostrar(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Venta</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="idCliente">
                <Form.Label>ID Cliente *</Form.Label>
                <Form.Control
                  type="number"
                  name="idCliente"
                  value={ventaEditada?.idCliente || ""}
                  onChange={manejarCambio}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group >
                <Form.Label> Fecha </Form.Label>
                <Form.Control
                  type="text"
                  value={ventaEditada?.fecha_venta || ""}
                  readOnly
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3" controlId="total_venta">
                <Form.Label>Total Venta *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="total_venta"
                  value={ventaEditada?.total_venta || ""}
                  onChange={manejarCambio}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="estado_venta">
            <Form.Label>Estado *</Form.Label>
            <Form.Select
              name="estado_venta"
              value={ventaEditada?.estado_venta || ""}
              onChange={manejarCambio}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Pagado">Pagado</option>
              <option value="Cancelado">Cancelado</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>

        <Button variant="primary" onClick={guardarEdicion}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionVenta;