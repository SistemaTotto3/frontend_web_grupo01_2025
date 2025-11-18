import React from "react";
import { Col, Card, Badge } from "react-bootstrap";
import { Zoom } from "react-awesome-reveal";

const Tarjeta = ({
  id_categoria,
  nombre_producto,
  precio_costo,
  precio_venta,
  existencia,
  imagen,
}) => {
  return (
    <Col xs={12} sm={6} md={6} lg={3} className="mt-3">
      <Zoom cascade triggerOnce delay={10} duration={600}>
        <Card border=" ">
          <Card.Img variant="top" src={`data:image/png;base64,${imagen}`} />
          <Card.Body>
            <Card.Title>
              <strong>{nombre_producto}</strong>
            </Card.Title>
            <Badge pill bg="success" className="m-1">
              <i className="bi-cash"></i> Costo: c$ {precio_costo?.toFixed(2)}
            </Badge>
            <Badge pill bg="info" className="m-1">
              <i className="bi-tag"></i> Venta: c$ {precio_venta?.toFixed(2)}
            </Badge>
            <Badge pill bg="secondary" className="m-1">
              <i className="bi-box"></i> Existencia: {existencia}
            </Badge>
            <Badge pill bg="warning" className="m-1">
              <i className="bi-tag"></i> Categoría: {id_categoria}
            </Badge>
          </Card.Body>
        </Card>
      </Zoom>
    </Col>
  );
};

export default Tarjeta;