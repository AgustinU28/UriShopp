// frontend/src/components/products/ProductCard.jsx
import React, { useState } from 'react';
import { Card, Button, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import cartService from '../../services/cartService';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product, onProductUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { dispatch } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const response = await cartService.addToCurrentCart(product.id, 1);
      
      // Actualizar contexto del carrito
      dispatch({
        type: 'ADD_ITEM',
        payload: response.data
      });

      setMessage({ type: 'success', text: 'Producto agregado al carrito' });
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(null), 3000);
      
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const getStockBadge = () => {
    if (product.stock === 0) {
      return <Badge bg="danger">Sin Stock</Badge>;
    } else if (product.stock <= 5) {
      return <Badge bg="warning">Últimas {product.stock} unidades</Badge>;
    } else {
      return <Badge bg="success">Stock: {product.stock}</Badge>;
    }
  };

  return (
    <Card className="h-100 shadow-sm product-card">
      {/* Badge destacado */}
      {product.featured && (
        <div className="position-absolute top-0 start-0 m-2">
          <Badge bg="primary">Destacado</Badge>
        </div>
      )}

      {/* Imagen del producto */}
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={product.thumbnail} 
          style={{ height: '200px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200/6c757d/ffffff?text=Sin+Imagen';
          }}
        />
        
        {/* Overlay con botón de ver detalles */}
        <div className="position-absolute top-50 start-50 translate-middle opacity-0 product-overlay">
          <Button 
            as={Link} 
            to={`/products/${product.id}`}
            variant="light"
            size="sm"
            className="me-2"
          >
            <FaEye /> Ver Detalles
          </Button>
        </div>
      </div>

      <Card.Body className="d-flex flex-column">
        {/* Título y categoría */}
        <div className="mb-2">
          <Card.Title className="h6 mb-1">
            <Link 
              to={`/products/${product.id}`}
              className="text-decoration-none text-dark"
            >
              {product.title}
            </Link>
          </Card.Title>
          <small className="text-muted">{product.category}</small>
        </div>

        {/* Descripción */}
        <Card.Text className="flex-grow-1 text-muted small">
          {product.description?.substring(0, 100)}...
        </Card.Text>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mb-2">
            {product.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} bg="secondary" className="me-1 mb-1">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Precio y stock */}
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="text-primary mb-0">{formatPrice(product.price)}</h5>
            {getStockBadge()}
          </div>

          {/* Mensaje de estado */}
          {message && (
            <Alert 
              variant={message.type === 'success' ? 'success' : 'danger'} 
              className="py-1 px-2 small mb-2"
            >
              {message.text}
            </Alert>
          )}

          {/* Botón agregar al carrito */}
          <Button 
            variant="primary" 
            className="w-100" 
            disabled={product.stock === 0 || loading}
            onClick={handleAddToCart}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Agregando...
              </>
            ) : product.stock > 0 ? (
              <>
                <FaShoppingCart className="me-1" />
                Agregar al Carrito
              </>
            ) : (
              'Sin Stock'
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;