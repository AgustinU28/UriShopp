// ===== frontend/src/components/common/Navbar.jsx =====
import React from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaShoppingCart, FaHome, FaStore } from 'react-icons/fa';

const NavbarComponent = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <strong>UriShop</strong>
          </Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link><FaHome className="me-1" />Inicio</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/shop">
              <Nav.Link><FaStore className="me-1" />Tienda</Nav.Link>
            </LinkContainer>
          </Nav>
          
          <Nav>
            <LinkContainer to="/cart">
              <Nav.Link>
                <FaShoppingCart className="me-1" />
                Carrito
                <Badge bg="primary" className="ms-1">0</Badge>
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;