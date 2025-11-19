import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroProductos = ({
  mostrarModal,
  setMostrarModal,
  nuevoProducto,
  manejarCambioInput,
  agregarProducto,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    agregarProducto();
  };

  return (
    <Modal
      backdrop="static"
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      centered
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Producto</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="g-2">
            <Col md={6}>
              <Form.Group controlId="id_categoria">
                <Form.Label>Categoría (ID)</Form.Label>
                <Form.Control
                  type="text"
                  name="id_categoria"
                  value={nuevoProducto.id_categoria}
                  onChange={manejarCambioInput}
                  placeholder="Ej: 1"
                  maxLength={10}
                  required
                  autoFocus
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="nombre_producto">
                <Form.Label>Nombre del producto</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre_producto"
                  value={nuevoProducto.nombre_producto}
                  onChange={manejarCambioInput}
                  placeholder="Ej: Arroz"
                  maxLength={100}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="precio_costo" className="mt-3">
                <Form.Label>Precio costo</Form.Label>
                <Form.Control
                  type="number"
                  name="precio_costo"
                  value={nuevoProducto.precio_costo}
                  onChange={manejarCambioInput}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="precio_venta" className="mt-3">
                <Form.Label>Precio venta</Form.Label>
                <Form.Control
                  type="number"
                  name="precio_venta"
                  value={nuevoProducto.precio_venta}
                  onChange={manejarCambioInput}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="existencia" className="mt-3">
                <Form.Label>Existencia</Form.Label>
                <Form.Control
                  type="number"
                  name="existencia"
                  value={nuevoProducto.existencia}
                  onChange={manejarCambioInput}
                  placeholder="0"
                  min="0"
                  step="1"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formImagenProducto">
                <Form.Label>Imagen</Form.Label>
                <Form.Control
                  type="file"
                  name="imagen"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        manejarCambioInput({
                          target: {
                            name: "imagen",
                            value: reader.result.split(",")[1],
                          }, // Extrae solo la parte Base64
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
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
            type="submit"
            disabled={!nuevoProducto.nombre_producto?.trim()}
          >
            Guardar Producto
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalRegistroProductos;