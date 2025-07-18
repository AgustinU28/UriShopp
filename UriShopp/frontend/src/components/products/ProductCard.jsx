// frontend/src/components/cart/Cart.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaTrash, FaCreditCard } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
import cartService from '../../services/cartService';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const { dispatch } = useCart();
  const navigate = useNavigate();

  // Cargar carrito
  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await cartService.getCurrentCart();
      setCart(response.data);
      
      // Actualizar contexto
      dispatch({ type: 'LOAD_CART', payload: response.data });
    } catch (err) {
      setError(err.message);
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cantidad
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(true);
      const response = await cartService.updateCurrentCartQuantity(productId, newQuantity);
      setCart(response.data);
      
      // Actualizar contexto
      dispatch({ 
        type: 'UPDATE_QUANTITY', 
        payload: { productId, quantity: newQuantity }
      });
    } catch (err) {
      setError(err.message);
      console.error('Error updating quantity:', err);
    } finally {
      setUpdating(false);
    }
  };

  // Eliminar producto
  const handleRemoveProduct = async (productId) => {
    try {
      setUpdating(true);
      const response = await cartService.removeFromCurrentCart(productId);
      setCart(response.data);
      
      // Actualizar contexto
      dispatch({ 
        type: 'REMOVE_ITEM', 
        payload: productId 
      });
    } catch (err) {
      setError(err.message);
      console.error('Error removing product:', err);
    } finally {
      setUpdating(false);
    }
  };

  // Vaciar carrito
  const handleClearCart = async () => {
    try {
      setUpdating(true);
      await cartService.clearCurrentCart();
      setCart({ products: [], total: 0 });
      
      // Actualizar contexto
      dispatch({ type: 'CLEAR_CART' });
    } catch (err) {
      setError(err.message);
      console.error('Error clearing cart:', err);
    } finally {
      setUpdating(false);
    }
  };

  // Proceder al checkout
  const handleCheckout = () => {
    if (!cart || cart.products.length === 0) return;
    navigate('/checkout');
  };

  // Continuar comprando
  const handleContinueShopping = () => {
    navigate('/shop');
  };

  // Calcular totales
  const calculateTotals = () => {
    if (!cart || !cart.products) {
      return { subtotal: 0, itemCount: 0, total: 0 };
    }

    return cartService.calculateCartTotals(cart);
  };

  const totals = calculateTotals();

  useEffect(() => {
    loadCart();
  }, []);

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status" className="me-2">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p>Cargando carrito...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Error al cargar el carrito</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={loadCart}>
            Reintentar
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <FaShoppingCart className="me-2" />
              Mi Carrito
              {totals.itemCount > 0 && (
                <Badge bg="primary" className="ms-2">
                  {totals.itemCount}
                </Badge>
              )}
            </h2>
            
            {cart && cart.products && cart.products.length > 0 && (
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={handleClearCart}
                disabled={updating}
              >
                <FaTrash className="me-1" />
                Vaciar carrito
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {!cart || !cart.products || cart.products.length === 0 ? (
        <Row>
          <Col>
            <Card className="text-center py-5">
              <Card.Body>
                <FaShoppingCart size={64} className="text-muted mb-3" />
                <h4>Tu carrito está vacío</h4>
                <p className="text-muted">
                  Agrega algunos productos para comenzar a comprar
                </p>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleContinueShopping}
                >
                  Continuar comprando
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          {/* Lista de productos */}
          <Col lg={8}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Productos en tu carrito</h5>
              </Card.Header>
              <Card.Body className="p-0">
                {cart.products.map((item, index) => (
                  <div key={`${item.id}-${index}`}>
                    <CartItem
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveProduct}
                      disabled={updating}
                    />
                    {index < cart.products.length - 1 && <hr className="m-0" />}
                  </div>
                ))}
              </Card.Body>
            </Card>

            <div className="mt-3">
              <Button 
                variant="outline-primary" 
                onClick={handleContinueShopping}
              >
                Continuar comprando
              </Button>
            </div>
          </Col>

          {/* Resumen del carrito */}
          <Col lg={4}>
            <Card className="cart-summary">
              <Card.Header>
                <h5 className="mb-0">Resumen del pedido</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Productos ({totals.itemCount})</span>
                  <span>{formatPrice(totals.subtotal)}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Envío</span>
                  <span className="text-success">Gratis</span>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total</strong>
                  <strong className="text-primary fs-4">
                    {formatPrice(totals.total)}
                  </strong>
                </div>

                <Button 
                  variant="success" 
                  size="lg" 
                  className="w-100"
                  onClick={handleCheckout}
                  disabled={updating || totals.itemCount === 0}
                >
                  <FaCreditCard className="me-2" />
                  Proceder al pago
                </Button>

                <div className="mt-3 text-center">
                  <small className="text-muted">
                    Envío gratis en compras superiores a $50.000
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Cart;