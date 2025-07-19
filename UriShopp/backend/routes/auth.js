// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// @route   GET /api/auth/test
// @desc    Test auth routes
// @access  Public
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// @route   POST /api/auth/register
// @desc    Register user (placeholder)
// @access  Public
router.post('/register', (req, res) => {
  res.json({
    success: false,
    message: 'Registro no implementado aún. Próximamente disponible.'
  });
});

// @route   POST /api/auth/login
// @desc    Login user (placeholder)
// @access  Public
router.post('/login', (req, res) => {
  res.json({
    success: false,
    message: 'Login no implementado aún. Próximamente disponible.'
  });
});

// @route   GET /api/auth/me
// @desc    Get current user (placeholder)
// @access  Private
router.get('/me', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Usuario autenticado',
    user: req.user
  });
});

module.exports = router;