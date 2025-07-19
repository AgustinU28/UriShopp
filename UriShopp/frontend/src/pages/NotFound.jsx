// ===== frontend/src/pages/NotFound.jsx =====
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center">
        <Col md={6}>
          <h1 className="display-1">404</h1>
          <h2>Página no encontrada</h2>
          <p className="lead">
            La página que buscas no existe o ha sido movida.
          </p>
          <Button as={Link} to="/" variant="primary" size="lg">
            Volver al Inicio
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;