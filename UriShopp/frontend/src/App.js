import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Cargar productos desde la API
    fetch('/api/products')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data.slice(0, 6)) // Mostrar solo 6 productos
        } else {
          setError('Error al cargar productos')
        }
      })
      .catch(err => {
        setError('Error de conexión')
        console.error('Error:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  return (
    <div className="App">
      {/* Header */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand mb-0 h1">🎮 UriShop</span>
          <span className="navbar-text">Tu tienda gamer</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <Container>
          <Row>
            <Col>
              <h1 className="display-4 fw-bold mb-4">
                🎮 Las Mejores Computadoras Gamer
              </h1>
              <p className="lead">
                Descubre nuestra selección de PCs gamer de alta gama
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Products Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5">💫 Productos Destacados</h2>
          
          {loading && (
            <div className="text-center">
              <Spinner animation="border" />
              <p className="mt-3">Cargando productos desde MongoDB...</p>
            </div>
          )}

          {error && (
            <Alert variant="danger" className="text-center">
              <Alert.Heading>Error</Alert.Heading>
              <p>{error}</p>
              <Button variant="outline-danger" onClick={() => window.location.reload()}>
                🔄 Reintentar
              </Button>
            </Alert>
          )}

          <Row>
            {products.map(product => (
              <Col key={product.id} md={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Img 
                    variant="top" 
                    src={product.thumbnail} 
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200/6c757d/ffffff?text=Sin+Imagen'
                    }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="h6">{product.title}</Card.Title>
                    <Card.Text className="flex-grow-1 text-muted small">
                      {product.description?.substring(0, 100)}...
                    </Card.Text>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="text-success mb-0">{formatPrice(product.price)}</h5>
                        <small className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin Stock'}
                        </small>
                      </div>
                      <Button 
                        variant="primary" 
                        className="w-100" 
                        disabled={product.stock === 0}
                      >
                        {product.stock > 0 ? '🛒 Agregar al Carrito' : 'Sin Stock'}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {!loading && !error && products.length === 0 && (
            <Alert variant="info" className="text-center">
              <h4>🤔 No hay productos disponibles</h4>
              <p>Verifica que el backend esté ejecutándose</p>
            </Alert>
          )}
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <Container>
          <Row>
            <Col className="text-center">
              <p>&copy; 2024 UriShop - Tu tienda gamer de confianza</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  )
}

export default App