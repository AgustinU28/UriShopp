// backend/app.js - Versión que funciona
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Security Middlewares
app.use(helmet());

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

// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Verificar productos
    await checkProducts();
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Función para verificar productos
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

// Connect to database
connectDB();

// ===== ROUTES BÁSICAS (sin archivos externos problemáticos) =====

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

// Products endpoint
app.get('/api/products', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const {
      search,
      minPrice,
      maxPrice,
      inStock,
      category,
      featured,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    // Construir filtro
    const filter = { status: 'active' };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    if (category) {
      filter.category = category;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    // Opciones de ordenamiento
    const sortOptions = {};
    switch (sortBy) {
      case 'name':
        sortOptions.title = order === 'asc' ? 1 : -1;
        break;
      case 'price':
        sortOptions.price = order === 'asc' ? 1 : -1;
        break;
      case 'stock':
        sortOptions.stock = order === 'asc' ? 1 : -1;
        break;
      default:
        sortOptions.createdAt = order === 'asc' ? 1 : -1;
    }

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      totalPages,
      data: products
    });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message
    });
  }
});

// Single product endpoint
app.get('/api/products/:id', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const productId = parseInt(req.params.id);
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto inválido'
      });
    }

    const product = await Product.findOne({ id: productId });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      error: error.message
    });
  }
});

// Database stats endpoint
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

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Ruta no encontrada' 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Error del servidor'
  });
});

module.exports = app;