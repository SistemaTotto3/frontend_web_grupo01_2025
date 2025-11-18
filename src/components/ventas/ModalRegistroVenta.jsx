import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import AsyncSelect from "react-select/async";

const ModalRegistroVenta = ({
  mostrarModal,
  setMostrarModal,
  nuevaVenta,
  manejarCambioInput,
  setNuevaVenta,
  clientes = [],
  hoy,
  agregarVenta,
}) => {

  const cargarClientes = (inputValue) => {
    const filtrados = clientes.filter((c) => {
      const nombre = `${c.primer_nombre || c.nombre_1 || c.nombre || ""}`;
      const apellido = `${c.primer_apellido || c.apellido_1 || c.apellido || ""}`;
      return `${nombre} ${apellido}`.toLowerCase().includes((inputValue || "").toLowerCase());
    });

    return Promise.resolve(
      filtrados.map((c) => ({
        value: c.idCliente ?? c.id_cliente ?? c.id,
        label: `${c.primer_nombre || c.nombre_1 || c.nombre || ""} ${c.primer_apellido || c.apellido_1 || c.apellido || ""}`.trim(),
      }))
    );
  };

  const selectedOption = (() => {
    if (!nuevaVenta?.idCliente) return null;
    const cli = clientes.find(
      (c) => (c.idCliente ?? c.id_cliente ?? c.id) == nuevaVenta.idCliente
    );
    if (!cli) return { value: nuevaVenta.idCliente, label: String(nuevaVenta.idCliente) };
    return {
      value: cli.idCliente ?? cli.id_cliente ?? cli.id,
      label: `${cli.primer_nombre || cli.nombre_1 || cli.nombre || ""} ${cli.primer_apellido || cli.apellido_1 || cli.apellido || ""}`.trim(),
    };
  })();
  return (
    <Modal
      backdrop="static"
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Registrar Venta</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3" controlId="idCliente">
                <Form.Label>Cliente *</Form.Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={cargarClientes}
                  placeholder="Buscar cliente..."
                  value={selectedOption}
                  onChange={(sel) =>
                    setNuevaVenta((prev) => ({ ...prev, idCliente: sel?.value || "" }))
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="fecha_venta">
                <Form.Label>Fecha Venta *</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha_venta"
                  value={nuevaVenta.fecha_venta}
                  onChange={manejarCambioInput}
                  max={hoy}
                  required
                />
              </Form.Group>
            </Col>



            <Col md={6}>
              <Form.Group className="mb-3" controlId="total_venta">
                <Form.Label>Total Venta *</Form.Label>
                <Form.Control
                  type="number"
                  name="total_venta"
                  step="0.01"
                  value={nuevaVenta.total_venta}
                  onChange={manejarCambioInput}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="estado_venta">
            <Form.Label>Estado *</Form.Label>
            <Form.Select
              name="estado_venta"
              value={nuevaVenta.estado_venta}
              onChange={manejarCambioInput}
              required
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Pagado">Pagado</option>
              <option value="Cancelado">Cancelado</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>

        <Button
          variant="primary"
          onClick={agregarVenta}
          disabled={!nuevaVenta.idCliente || !nuevaVenta.total_venta}
        >
          Guardar Venta
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroVenta;