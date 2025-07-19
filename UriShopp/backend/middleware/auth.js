// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verificar si el usuario está autenticado
const auth = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Acceso denegado. No se proporcionó token.' 
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user by id (cuando implementes el modelo User)
      // const user = await User.findById(decoded.id).select('-password');
      
      // Por ahora, simulamos un usuario
      const user = {
        _id: decoded.id,
        email: decoded.email,
        role: decoded.role || 'user'
      };
      
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Token no válido. Usuario no encontrado.' 
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ 
        success: false,
        message: 'Token no válido.' 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error del servidor en autenticación.' 
    });
  }
};

// Grant access to specific roles
const adminAuth = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'moderator')) {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador.' 
    });
  }
};

// Strict admin only
const strictAdminAuth = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Acceso denegado. Solo administradores.' 
    });
  }
};

module.exports = { 
  auth, 
  adminAuth, 
  strictAdminAuth 
};