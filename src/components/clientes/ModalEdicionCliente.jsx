import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionCliente = ({
  mostrar,
  setMostrar,
  clienteEditada,
  setClienteEditada,
  guardarEdicion,
}) => {
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setClienteEditada((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      backdrop="static"
      show={mostrar}
      onHide={() => setMostrar(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Cliente</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="nombre_1">
            <Form.Label>Nombre </Form.Label>
            <Form.Control
              type="text"
              name="nombre_1"
              value={clienteEditada?.nombre_1 || ""}
              onChange={manejarCambio}
              placeholder="Ej: Herramientas"
              maxLength={20}
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="apellido_1">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="apellido_1"
              value={clienteEditada?.apellido_1|| ""}
              onChange={manejarCambio}
              placeholder="Descripción opcional (máx. 100 caracteres)"
              maxLength={100}
            />
          </Form.Group>

                    <Form.Group className="mb-3" controlId="direccion_cliente">
            <Form.Label>Direccion cliente</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="direccion_cliente"
              value={clienteEditada?.direccion_cliente|| ""}
              onChange={manejarCambio}
              placeholder="Descripción opcional (máx. 100 caracteres)"
              maxLength={100}
            />
          </Form.Group>

          
                    <Form.Group className="mb-3" controlId="telefono_cliente">
            <Form.Label>Telefono cliente</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="telefono_cliente"
              value={clienteEditada?.telefono_cliente|| ""}
              onChange={manejarCambio}
              placeholder="Descripción opcional (máx. 100 caracteres)"
              maxLength={100}
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
          disabled={!clienteEditada?.nombre_1?.trim()}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCliente;