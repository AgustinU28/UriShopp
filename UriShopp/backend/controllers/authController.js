// ===== backend/controllers/authController.js =====
const register = (req, res) => {
  res.json({
    success: false,
    message: 'Registro no implementado aún'
  });
};

const login = (req, res) => {
  res.json({
    success: false,
    message: 'Login no implementado aún'
  });
};

const getMe = (req, res) => {
  res.json({
    success: true,
    message: 'Usuario autenticado (placeholder)',
    user: { id: 'temp', email: 'temp@example.com' }
  });
};

module.exports = {
  register,
  login,
  getMe
};




