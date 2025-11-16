import { useState } from "react";
import { Modal, Form, Button, Table, Row, Col, FormControl } from "react-bootstrap";
import AsyncSelect from 'react-select/async';



const ModalRegistroInsumo = ({
  mostrar, setMostrar, nuevoInsumo, setNuevoInsumo,
  detalles, setDetalles, productos,
  agregarInsumo, hoy
}) => {
  const [productoSel, setProductoSel] = useState(null);
  const [nuevoDetalle, setNuevoDetalle] = useState({ id_producto: '', nombre_insumo: '', cantidad_insumo: '', precio_insumo: '' });
  const total = (detalles || []).reduce(
    (s, d) => s + (Number(d.cantidad_insumo || 0) * Number(d.precio_insumo || 0)),
    0
  );

  const cargarOpciones = (lista, campo) => (input, callback) => {
    const filtrados = lista.filter(item =>
      String(item[campo] || item.nombre_producto || "").toLowerCase().includes(input.toLowerCase())
    );
    callback(filtrados.map(item => ({
      value: item.id_producto,
      label: item[campo] || `${item.nombre_producto}`,
      precio_insumo: item.precio_insumo ?? item.precio_costo ?? item.precio ?? 0,
      stock: item.stock ?? item.existencia ?? 0
    })));
  };

  const manejarProducto = (option) => {
    if (!option) {
      setProductoSel(null);
      setNuevoDetalle(prev => ({ ...prev, id_producto: '', precio_insumo: '' }));
      return;
    }
    setProductoSel(option);
    setNuevoDetalle(prev => ({
      ...prev,
      id_producto: option.value,
      precio_insumo: option.precio_insumo ?? prev.precio_insumo
    }));
  };

  const agregarDetalle = () => {
    if (!nuevoDetalle.id_producto || !nuevoDetalle.nombre_insumo || !nuevoDetalle.cantidad_insumo || Number(nuevoDetalle.cantidad_insumo) <= 0) {
      alert("Selecciona producto, ingresa nombre de insumo y cantidad válida.");
      return;
    }
    const prod = productos.find(p => Number(p.id_producto) === Number(nuevoDetalle.id_producto));
    if (prod && Number(nuevoDetalle.cantidad_insumo) > Number(prod.stock || 0)) {
      alert(`Stock insuficiente: ${prod.stock}`);
      return;
    }

    setDetalles(prev => [...prev, {
      id_producto: Number(nuevoDetalle.id_producto),
      nombre_insumo: nuevoDetalle.nombre_insumo,
      cantidad_insumo: Number(nuevoDetalle.cantidad_insumo),
      precio_insumo: Number(nuevoDetalle.precio_insumo ?? (prod && prod.precio_insumo) ?? 0),
    }]);

    setNuevoDetalle({ id_producto: '', nombre_insumo: '', cantidad_insumo: '', precio_insumo: '' });
    setProductoSel(null);
  };

  return (
    <Modal backdrop="static" show={mostrar} onHide={() => setMostrar(false)} size="xl" fullscreen="lg-down">
      <Modal.Header closeButton><Modal.Title>Nuevo Insumo</Modal.Title></Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Fecha Insumo</Form.Label>
                <Form.Control
                  type="date"
                  value={nuevoInsumo.fecha_insumo}
                  onChange={e => setNuevoInsumo(prev => ({ ...prev, fecha_insumo: e.target.value }))}
                  disabled
                  max={hoy}
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />
          <h5>Agregar Detalle de Insumo</h5>
          <Row>
            <Col md={4}>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={cargarOpciones(productos, 'nombre_producto')}
                onChange={manejarProducto}
                value={productoSel}
                placeholder="Buscar producto..."
                isClearable
              />
            </Col>
            <Col md={3}>
              <FormControl
                type="text"
                placeholder="Nombre Insumo"
                value={nuevoDetalle.nombre_insumo}
                onChange={e => setNuevoDetalle(prev => ({ ...prev, nombre_insumo: e.target.value }))}
              />
            </Col>
            <Col md={2}>
              <FormControl
                type="number"
                placeholder="Cantidad"
                value={nuevoDetalle.cantidad_insumo}
                onChange={e => setNuevoDetalle(prev => ({ ...prev, cantidad_insumo: e.target.value }))}
                min="1"
              />
            </Col>
            <Col md={3}>
              <Button variant="success" onClick={agregarDetalle} style={{ width: '100%' }}>
                Agregar
              </Button>
            </Col>
          </Row>

          {detalles && detalles.length > 0 && (
            <Table striped className="mt-3">
              <thead><tr><th>Nombre Insumo</th><th>Cant.</th><th>Precio</th><th>Subtotal</th><th></th></tr></thead>
              <tbody>
                {detalles.map((d, i) => (
                  <tr key={i}>
                    <td>{d.nombre_insumo}</td>
                    <td>{d.cantidad_insumo}</td>
                    <td>C$ {(Number(d.precio_insumo || 0)).toFixed(2)}</td>
                    <td>C$ {(Number(d.cantidad_insumo || 0) * Number(d.precio_insumo || 0)).toFixed(2)}</td>
                    <td>
                      <Button size="sm" variant="danger" onClick={() => setDetalles(prev => prev.filter((_, idx) => idx !== i))}>
                        X
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-end"><strong>Total:</strong></td>
                  <td colSpan={2}><strong>C$ {total.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </Table>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>Cancelar</Button>
        <Button variant="primary" onClick={agregarInsumo}>Guardar Insumo</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroInsumo;