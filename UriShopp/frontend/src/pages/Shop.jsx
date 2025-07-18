
// ===== frontend/src/pages/Shop.jsx =====
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data.data || []);
      } catch (err) {
        setError('Error al cargar productos');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Cargando productos...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Nuestra Tienda</h1>
      <p className="lead mb-4">Encuentra la computadora gamer perfecta para ti</p>
      
      <Row>
        {products.map(product => (
          <Col key={product.id} lg={3} md={4} sm={6} className="mb-4">
            <Card className="h-100">
              <Card.Img 
                variant="top" 
                src={product.thumbnail} 
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="h6">{product.title}</Card.Title>
                <Card.Text className="flex-grow-1 small">
                  {product.description.substring(0, 80)}...
                </Card.Text>
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="text-primary mb-0">{formatPrice(product.price)}</h6>
                    <small className="text-muted">Stock: {product.stock}</small>
                  </div>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="w-100"
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      {products.length === 0 && (
        <Alert variant="info" className="text-center">
          No hay productos disponibles en este momento.
        </Alert>
      )}
    </Container>
  );
};

export default Shop;