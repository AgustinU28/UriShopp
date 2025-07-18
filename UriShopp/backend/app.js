// backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// 🔐 Security Middlewares
app.use(helmet());

// 🌐 CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// 📦 Body Parser Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 📋 Logging (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 🔗 Importar rutas externas
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

// 📌 Registrar rutas externas
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// 🔄 Conexión a MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await checkProducts();

  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// 🧪 Verificar si hay productos
const checkProducts = async () => {
  try {
    const Product = require('./models/Product');
    const productCount = await Product.countDocuments();

    if (productCount === 0) {
      console.log('📦 No hay productos - ejecuta: npm run seed');
    } else {
      console.log(`📊 Base de datos contiene ${productCount} productos`);
    }
  } catch (error) {
    console.log('⚠️  Error verificando productos:', error.message);
  }
};

// 📞 Iniciar conexión a DB
connectDB();

// ✅ Endpoint de verificación general
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente con MongoDB',
    timestamp: new Date().toISOString(),
    database: {
      status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      host: mongoose.connection.host,
      name: mongoose.connection.name
    }
  });
});

// 🔍 Estadísticas de base de datos
app.get('/api/stats', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const Cart = require('./models/Cart');

    const [productCount, cartCount] = await Promise.all([
      Product.countDocuments(),
      Cart.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        products: productCount,
        carts: cartCount,
        database: {
          status: 'Connected',
          host: mongoose.connection.host,
          name: mongoose.connection.name
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas',
      error: error.message
    });
  }
});

// 🔎 Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// 🚫 Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// ❗ Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Error del servidor'
  });
});

module.exports = app;
