// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// Importar componentes comunes (con nombres exactos)
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Importar páginas principales (con nombres exactos)
import Home from './pages/Home';
import Shop from './pages/Shop';
import NotFound from './pages/NotFound';

// Importar componentes de productos (con nombres exactos)
import ProductDetail from './components/products/ProductDetail';

// Importar componentes de carrito (con nombres exactos)
import Cart from './components/cart/Cart';
import Checkout from './components/cart/Checkout';

// Importar componentes de autenticación (crear si no existen)
// import Login from './components/auth/Login';
// import Register from './components/auth/Register';

// Importar componentes de órdenes (usar los que creamos)
import OrderList from './components/orders/OrderList';
import OrderDetail from './components/orders/OrderDetail';

// Importar componentes de admin (con nombre exacto)
import Dashboard from './components/admin/Dashboard';

// Importar estilos
import 'bootstrap/dist/css/bootstrap.min.css';


// Componente de Layout principal
const Layout = ({ children }) => (
  <div className="App d-flex flex-column min-vh-100">
    <Navbar />
    <main className="flex-grow-1">
      {children}
    </main>
    <Footer />
  </div>
);

// Componente de Layout para Admin
const AdminLayout = ({ children }) => (
  <div className="App d-flex flex-column min-vh-100">
    <Navbar />
    <main className="flex-grow-1 bg-light">
      {children}
    </main>
  </div>
);

// Componente de Layout simple (sin header/footer para auth)
const SimpleLayout = ({ children }) => (
  <div className="App min-vh-100 bg-light">
    <main className="h-100 d-flex align-items-center justify-content-center">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Rutas principales con layout completo */}
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />
          
          <Route path="/shop" element={
            <Layout>
              <Shop />
            </Layout>
          } />
          
          <Route path="/products/:id" element={
            <Layout>
              <ProductDetail />
            </Layout>
          } />
          
          <Route path="/cart" element={
            <Layout>
              <Cart />
            </Layout>
          } />

          <Route path="/checkout" element={
            <Layout>
              <Checkout />
            </Layout>
          } />

          {/* Rutas de órdenes con layout completo */}
          <Route path="/orders" element={
            <Layout>
              <OrderList />
            </Layout>
          } />
          
          <Route path="/orders/:id" element={
            <Layout>
              <OrderDetail />
            </Layout>
          } />

          {/* Rutas de administración con layout de admin */}
          <Route path="/admin" element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          } />

          {/* Rutas adicionales */}
          <Route path="/contact" element={
            <Layout>
              <div className="container py-5">
                <h1>📞 Contacto</h1>
                <p>Próximamente página de contacto...</p>
              </div>
            </Layout>
          } />

          <Route path="/about" element={
            <Layout>
              <div className="container py-5">
                <h1>ℹ️ Acerca de UriShop</h1>
                <p>Tu tienda de confianza para equipos gaming...</p>
              </div>
            </Layout>
          } />

          {/* Ruta 404 */}
          <Route path="*" element={
            <Layout>
              <NotFound />
            </Layout>
          } />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;