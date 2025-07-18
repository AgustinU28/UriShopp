// backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body Parser Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static('uploads'));

// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Opcional: Poblar base de datos si está vacía
    await initializeDatabase();
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Función para inicializar la base de datos
const initializeDatabase = async () => {
  try {
    const Product = require('./models/Product');
    const productCount = await Product.countDocuments();
    
    if (productCount === 0) {
      console.log('📦 Base de datos vacía, iniciando seeding...');
      const { seedProducts, seedCarts } = require('./config/seeder');
      
      await seedProducts();
      await seedCarts();
      
      console.log('🎉 Base de datos inicializada con datos de ejemplo');
    } else {
      console.log(`📊 Base de datos ya contiene ${productCount} productos`);
    }
  } catch (error) {
    console.log('⚠️  Error inicializando base de datos:', error.message);
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/carts', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/tickets', require('./routes/tickets'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Test endpoint
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

// Database stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const Cart = require('./models/Cart');
    
    const [productCount, cartCount, activeCarts] = await Promise.all([
      Product.countDocuments(),
      Cart.countDocuments(),
      Cart.countDocuments({ status: 'active', totalItems: { $gt: 0 } })
    ]);

    res.json({
      success: true,
      data: {
        products: productCount,
        totalCarts: cartCount,
        activeCarts: activeCarts,
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

// Error handling middleware
app.use(require('./middleware/errorHandler'));

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Ruta no encontrada' 
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await mongoose.connection.close();
  console.log('✅ Conexión a MongoDB cerrada');
  process.exit(0);
});

module.exports = app;