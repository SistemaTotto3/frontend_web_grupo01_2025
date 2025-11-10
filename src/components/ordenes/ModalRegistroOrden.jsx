import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroOrden = ({
  mostrarModal,
  setMostrarModal,
  nuevaOrden,
  manejarCambioInput,
  agregarOrden,
}) => {
  return (
    <Modal
     backdrop ='static'
      show={mostrarModal} onHide={() => setMostrarModal(false)} 
      centered
      
      >
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nueva Orden</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="id_venta">
            <Form.Label> ID de la Venta</Form.Label>
            <Form.Control
              type="text"
              name="id_venta"
              value={nuevaOrden.id_venta}
              onChange={manejarCambioInput}
              placeholder="1 , 2, 3 ..."
              maxLength={4}
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="fecha_orden">
            <Form.Label>Fecha de la Orden</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="fecha_orden"
              value={nuevaOrden.fecha_orden}
              onChange={manejarCambioInput}
              placeholder="2025-10-10"
              maxLength={50}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={agregarOrden}
          disabled={!nuevaOrden.id_venta.trim()}
        >
          Guardar Orden
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroOrden;