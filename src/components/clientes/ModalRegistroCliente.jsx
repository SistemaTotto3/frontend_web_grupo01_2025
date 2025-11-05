import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroCliente = ({
  mostrarModal,
  setMostrarModal,
  nuevoCliente,
  manejarCambioInput,
  agregarCliente,
}) => {
  return (
    <Modal backdrop='static'
     show={mostrarModal} onHide={() => setMostrarModal(false)} 
     centered
     >
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Cliente</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>

          <Form.Group className="mb-3" controlId="nombre_1">
            <Form.Label>Primer Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre_1"
              value={nuevoCliente.nombre_1}
              onChange={manejarCambioInput}
              placeholder="Ej: Angelly"
              maxLength={20}
              required
              autoFocus
            />
          </Form.Group>

    <Form.Group className="mb-3" controlId="apellido_1">
            <Form.Label>Primer apellido </Form.Label>
            <Form.Control
              type="text"
              name="apellido_1"
              value={nuevoCliente.apellido_1}
              onChange={manejarCambioInput}
              placeholder="Ej: Gonzalez"
              maxLength={20}
              required
              autoFocus
            />
          </Form.Group>

              <Form.Group className="mb-3" controlId="direccion_cliente">
            <Form.Label>direccion cliente </Form.Label>
            <Form.Control
              type="text"
              name="direccion_cliente"
              value={ nuevoCliente.direccion_cliente}
              onChange={manejarCambioInput}
              placeholder="Ej: Por alla"
              maxLength={20}
              required
              autoFocus
            />
          </Form.Group>

              <Form.Group className="mb-3" controlId="telefono_cliente">
            <Form.Label>telefono cliente </Form.Label>
            <Form.Control
              type="text"
              name="telefono_cliente"
              value={ nuevoCliente.telefono_cliente}
              onChange={manejarCambioInput}
              placeholder="Ej: 2545874"
              maxLength={20}
              required
              autoFocus
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
          onClick={agregarCliente}
          disabled={!nuevoCliente.nombre_1?.trim()}
        >
          Guardar Cliente
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCliente;