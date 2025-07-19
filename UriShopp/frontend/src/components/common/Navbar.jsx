// frontend/src/components/common/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { 
  Navbar as BootstrapNavbar, 
  Nav, 
  Container, 
  Button, 
  Badge, 
  Form, 
  InputGroup,
  Dropdown,
  Offcanvas
} from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaHome, 
  FaStore, 
  FaUser, 
  FaSearch,
  FaBars,
  FaSignInAlt,
  FaUserPlus,
  FaBoxOpen,
  FaHeadset,
  FaCog,
  FaSignOutAlt,
  FaHeart
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Cargar usuario desde localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Manejar scroll para cambiar estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowMobileMenu(false);
    }
  };

  // Manejar logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  // Verificar si la ruta está activa
  const isActiveRoute = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Top Bar - Solo en desktop */}
      <div className="top-bar bg-dark text-white py-1 d-none d-md-block">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <small className="me-3">
                📞 +54 11 1234-5678
              </small>
              <small>
                ✉️ info@urishop.com
              </small>
            </div>
            <div className="d-flex align-items-center">
              <small className="me-3">
                🚚 Envío gratis en compras +$50.000
              </small>
              <small>
                🎮 La mejor tecnología gamer
              </small>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navbar */}
      <BootstrapNavbar 
        bg="white" 
        variant="light" 
        expand="lg" 
        sticky="top"
        className={`main-navbar shadow-sm ${isScrolled ? 'navbar-scrolled' : ''}`}
      >
        <Container>
          {/* Brand */}
          <BootstrapNavbar.Brand as={Link} to="/" className="brand-logo fw-bold">
            <span className="brand-icon me-2">🎮</span>
            <span className="brand-text">UriShop</span>
            <small className="brand-tagline d-none d-sm-inline ms-2 text-muted">
              Gaming Store
            </small>
          </BootstrapNavbar.Brand>

          {/* Search Bar - Desktop */}
          <div className="search-container d-none d-lg-flex mx-4 flex-grow-1">
            <Form onSubmit={handleSearch} className="w-100">
              <InputGroup>
                <Form.Control
                  type="search"
                  placeholder="Buscar productos, marcas, modelos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={!searchQuery.trim()}
                >
                  <FaSearch />
                </Button>
              </InputGroup>
            </Form>
          </div>

          {/* Desktop Navigation */}
          <div className="d-none d-lg-flex align-items-center">
            {/* Navigation Links */}
            <Nav className="me-4">
              <Nav.Link 
                as={Link} 
                to="/" 
                className={`nav-item px-3 ${isActiveRoute('/') ? 'active' : ''}`}
              >
                <FaHome className="me-1" />
                Inicio
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/shop" 
                className={`nav-item px-3 ${isActiveRoute('/shop') ? 'active' : ''}`}
              >
                <FaStore className="me-1" />
                Tienda
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/contact" 
                className={`nav-item px-3 ${isActiveRoute('/contact') ? 'active' : ''}`}
              >
                <FaHeadset className="me-1" />
                Contacto
              </Nav.Link>
            </Nav>

            {/* Action Buttons */}
            <div className="d-flex align-items-center gap-2">
              {/* Wishlist - Placeholder */}
              <Button
                variant="outline-secondary"
                size="sm"
                className="position-relative"
                title="Lista de deseos"
              >
                <FaHeart />
                <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle badge-sm">
                  0
                </Badge>
              </Button>

              {/* Cart */}
              <Button
                as={Link}
                to="/cart"
                variant="outline-primary"
                size="sm"
                className="position-relative me-2"
                title="Carrito de compras"
              >
                <FaShoppingCart />
                {itemCount > 0 && (
                  <Badge bg="primary" className="position-absolute top-0 start-100 translate-middle">
                    {itemCount > 99 ? '99+' : itemCount}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              {user ? (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="outline-dark" size="sm">
                    <FaUser className="me-1" />
                    {user.name || user.email}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Header>
                      <small className="text-muted">
                        {user.email}
                      </small>
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/orders">
                      <FaBoxOpen className="me-2" />
                      Mis Órdenes
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/profile">
                      <FaCog className="me-2" />
                      Mi Perfil
                    </Dropdown.Item>
                    {user.role === 'admin' && (
                      <>
                        <Dropdown.Divider />
                        <Dropdown.Item as={Link} to="/admin">
                          <FaCog className="me-2" />
                          Administración
                        </Dropdown.Item>
                      </>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      <FaSignOutAlt className="me-2" />
                      Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div className="d-flex gap-2">
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline-primary"
                    size="sm"
                  >
                    <FaSignInAlt className="me-1" />
                    Ingresar
                  </Button>
                  <Button
                    as={Link}
                    to="/register"
                    variant="primary"
                    size="sm"
                  >
                    <FaUserPlus className="me-1" />
                    Registrarse
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Toggle Button */}
          <Button
            variant="outline-dark"
            className="d-lg-none"
            onClick={() => setShowMobileMenu(true)}
          >
            <FaBars />
          </Button>
        </Container>
      </BootstrapNavbar>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas 
        show={showMobileMenu} 
        onHide={() => setShowMobileMenu(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <span className="brand-icon me-2">🎮</span>
            UriShop
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Mobile Search */}
          <Form onSubmit={handleSearch} className="mb-4">
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                variant="primary"
                disabled={!searchQuery.trim()}
              >
                <FaSearch />
              </Button>
            </InputGroup>
          </Form>

          {/* Mobile Navigation */}
          <Nav className="flex-column">
            <Nav.Link 
              as={Link} 
              to="/" 
              onClick={() => setShowMobileMenu(false)}
              className={`py-3 ${isActiveRoute('/') ? 'active' : ''}`}
            >
              <FaHome className="me-2" />
              Inicio
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/shop" 
              onClick={() => setShowMobileMenu(false)}
              className={`py-3 ${isActiveRoute('/shop') ? 'active' : ''}`}
            >
              <FaStore className="me-2" />
              Tienda
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/contact" 
              onClick={() => setShowMobileMenu(false)}
              className={`py-3 ${isActiveRoute('/contact') ? 'active' : ''}`}
            >
              <FaHeadset className="me-2" />
              Contacto
            </Nav.Link>
          </Nav>

          <hr />

          {/* Mobile User Section */}
          {user ? (
            <div>
              <div className="mb-3">
                <h6>Hola, {user.name || user.email}!</h6>
                <small className="text-muted">{user.email}</small>
              </div>
              <Nav className="flex-column">
                <Nav.Link 
                  as={Link} 
                  to="/orders" 
                  onClick={() => setShowMobileMenu(false)}
                  className="py-2"
                >
                  <FaBoxOpen className="me-2" />
                  Mis Órdenes
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/profile" 
                  onClick={() => setShowMobileMenu(false)}
                  className="py-2"
                >
                  <FaCog className="me-2" />
                  Mi Perfil
                </Nav.Link>
                {user.role === 'admin' && (
                  <Nav.Link 
                    as={Link} 
                    to="/admin" 
                    onClick={() => setShowMobileMenu(false)}
                    className="py-2"
                  >
                    <FaCog className="me-2" />
                    Administración
                  </Nav.Link>
                )}
                <Nav.Link 
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="py-2 text-danger"
                >
                  <FaSignOutAlt className="me-2" />
                  Cerrar Sesión
                </Nav.Link>
              </Nav>
            </div>
          ) : (
            <div className="d-grid gap-2">
              <Button
                as={Link}
                to="/login"
                variant="outline-primary"
                onClick={() => setShowMobileMenu(false)}
              >
                <FaSignInAlt className="me-1" />
                Iniciar Sesión
              </Button>
              <Button
                as={Link}
                to="/register"
                variant="primary"
                onClick={() => setShowMobileMenu(false)}
              >
                <FaUserPlus className="me-1" />
                Registrarse
              </Button>
            </div>
          )}

          {/* Mobile Cart Summary */}
          <div className="mt-4 pt-4 border-top">
            <Button
              as={Link}
              to="/cart"
              variant="primary"
              className="w-100"
              onClick={() => setShowMobileMenu(false)}
            >
              <FaShoppingCart className="me-2" />
              Carrito ({itemCount})
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <style jsx>{`
        .top-bar {
          font-size: 0.8rem;
          transition: all 0.3s ease;
        }

        .main-navbar {
          transition: all 0.3s ease;
        }

        .navbar-scrolled {
          box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
        }

        .brand-logo {
          font-size: 1.5rem;
          text-decoration: none !important;
          color: #495057 !important;
        }

        .brand-icon {
          font-size: 1.8rem;
        }

        .brand-tagline {
          font-size: 0.75rem;
          font-weight: 400;
        }

        .search-input {
          border-radius: 25px 0 0 25px;
          border-right: none;
        }

        .search-input:focus {
          border-color: #0d6efd;
          box-shadow: none;
          border-right: none;
        }

        .btn-primary[type="submit"] {
          border-radius: 0 25px 25px 0;
          border-left: none;
        }

        .nav-item {
          border-radius: 8px;
          transition: all 0.2s ease;
          text-decoration: none !important;
          color: #495057 !important;
        }

        .nav-item:hover {
          background-color: #f8f9fa;
          color: #0d6efd !important;
        }

        .nav-item.active {
          background-color: #e3f2fd;
          color: #0d6efd !important;
          font-weight: 600;
        }

        .badge-sm {
          font-size: 0.6rem;
          padding: 0.2em 0.4em;
        }

        .position-relative .badge {
          font-size: 0.65rem;
        }

        @media (max-width: 991.98px) {
          .top-bar {
            display: none !important;
          }
        }

        .offcanvas-body {
          padding: 1.5rem;
        }

        .offcanvas .nav-link.active {
          background-color: #e3f2fd;
          border-radius: 8px;
          color: #0d6efd !important;
          font-weight: 600;
        }
      `}</style>
    </>
  );
};

export default Navbar;