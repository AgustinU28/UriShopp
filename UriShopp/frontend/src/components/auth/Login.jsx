// ===== frontend/src/components/auth/Login.jsx =====
import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener la ruta a la que debe redirigir después del login
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones básicas
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Por favor ingresa un email válido');
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión. Verifica tu internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <Card className="shadow-lg border-0">
            <Card.Header className="text-center bg-primary text-white">
              <h4 className="mb-0">
                <FaUser className="me-2" />
                Iniciar Sesión
              </h4>
              <small>Bienvenido de vuelta a UriShop</small>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="mb-3">
                  <small>{error}</small>
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaUser className="me-2 text-muted" />
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="form-control-lg"
                    disabled={loading}
                    required
                  />
                </Form.Group>

                {/* Contraseña */}
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaLock className="me-2 text-muted" />
                    Contraseña
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Tu contraseña"
                      className="form-control-lg"
                      disabled={loading}
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                {/* Botón de login */}
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 btn-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>
              </Form>

              {/* Links adicionales */}
              <div className="text-center mt-4">
                <div className="mb-2">
                  <Link 
                    to="/reset-password" 
                    className="text-decoration-none text-muted"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <hr className="my-3" />
                <div>
                  <span className="text-muted">¿No tienes cuenta? </span>
                  <Link 
                    to="/register" 
                    className="text-decoration-none fw-bold"
                  >
                    Regístrate aquí
                  </Link>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Demo credentials */}
          <Card className="mt-3 border-warning">
            <Card.Body className="py-2">
              <small className="text-muted">
                <strong>Demo:</strong><br />
                Email: admin@urishop.com<br />
                Contraseña: 123456
              </small>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Login;