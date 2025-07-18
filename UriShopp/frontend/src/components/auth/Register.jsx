// ===== frontend/src/components/auth/Register.jsx =====
import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner, InputGroup, ProgressBar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return false;
    }

    if (formData.name.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return false;
    }

    if (!formData.email || !formData.email.includes('@')) {
      setError('Por favor ingresa un email válido');
      return false;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (!formData.acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      return false;
    }

    return true;
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    let strength = 0;
    
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    
    return strength;
  };

  const getPasswordStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength < 50) return 'danger';
    if (strength < 75) return 'warning';
    return 'success';
  };

  const getPasswordStrengthText = () => {
    const strength = getPasswordStrength();
    if (strength < 25) return 'Muy débil';
    if (strength < 50) return 'Débil';
    if (strength < 75) return 'Media';
    return 'Fuerte';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Error al registrarse');
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
        <div className="col-md-6 col-lg-5">
          <Card className="shadow-lg border-0">
            <Card.Header className="text-center bg-success text-white">
              <h4 className="mb-0">
                <FaUserPlus className="me-2" />
                Crear Cuenta
              </h4>
              <small>Únete a la comunidad UriShop</small>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="mb-3">
                  <small>{error}</small>
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                {/* Nombre */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaUser className="me-2 text-muted" />
                    Nombre completo
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className="form-control-lg"
                    disabled={loading}
                    required
                  />
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaEnvelope className="me-2 text-muted" />
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
                <Form.Group className="mb-3">
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
                      placeholder="Mínimo 6 caracteres"
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
                  
                  {/* Indicador de fortaleza de contraseña */}
                  {formData.password && (
                    <div className="mt-2">
                      <ProgressBar 
                        now={getPasswordStrength()} 
                        variant={getPasswordStrengthColor()}
                        size="sm"
                      />
                      <small className={`text-${getPasswordStrengthColor()}`}>
                        Fortaleza: {getPasswordStrengthText()}
                      </small>
                    </div>
                  )}
                </Form.Group>

                {/* Confirmar contraseña */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaLock className="me-2 text-muted" />
                    Confirmar contraseña
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repite tu contraseña"
                      className="form-control-lg"
                      disabled={loading}
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                  
                  {/* Validación visual de coincidencia */}
                  {formData.confirmPassword && (
                    <small className={
                      formData.password === formData.confirmPassword 
                        ? 'text-success' 
                        : 'text-danger'
                    }>
                      {formData.password === formData.confirmPassword 
                        ? '✓ Las contraseñas coinciden' 
                        : '✗ Las contraseñas no coinciden'
                      }
                    </small>
                  )}
                </Form.Group>

                {/* Términos y condiciones */}
                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    label={
                      <span>
                        Acepto los{' '}
                        <Link to="/terms" target="_blank" className="text-decoration-none">
                          términos y condiciones
                        </Link>
                        {' '}y la{' '}
                        <Link to="/privacy" target="_blank" className="text-decoration-none">
                          política de privacidad
                        </Link>
                      </span>
                    }
                    disabled={loading}
                    required
                  />
                </Form.Group>

                {/* Botón de registro */}
                <Button 
                  variant="success" 
                  type="submit" 
                  className="w-100 btn-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear Cuenta'
                  )}
                </Button>
              </Form>

              {/* Link para login */}
              <div className="text-center mt-4">
                <hr className="my-3" />
                <div>
                  <span className="text-muted">¿Ya tienes cuenta? </span>
                  <Link 
                    to="/login" 
                    className="text-decoration-none fw-bold"
                  >
                    Inicia sesión aquí
                  </Link>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Register;