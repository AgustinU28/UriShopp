// backend/server-working.js - Servidor completo funcional
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected');
  checkProducts();
})
.catch(err => {
  console.error('❌ MongoDB Error:', err.message);
  process.exit(1);
});

// Check products
async function checkProducts() {
  try {
    const Product = require('./models/Product');
    const count = await Product.countDocuments();
    console.log(`📊 Base de datos contiene ${count} productos`);
  } catch (error) {
    console.log('⚠️ Error verificando productos:', error.message);
  }
}

// Import Product model
const Product = require('./models/Product');

// ===== ROUTES =====

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: '🚀 UriShop Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// API Test
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: '🎮 UriShop API funcionando con Vite + MongoDB',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /health - Health check',
      'GET /api/test - API test', 
      'GET /api/products - Todos los productos',
      'GET /api/products/:id - Producto por ID',
      'GET /api/stats - Estadísticas'
    ],
    database: {
      status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      host: mongoose.connection.host,
      name: mongoose.connection.name
    }
  });
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
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
      limit = 20
    } = req.query;

    // Build filter
    const filter = { status: 'active' };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
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

    // Sort options
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

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    console.log(`📦 Returning ${products.length} products of ${total} total`);

    res.json({
      success: true,
      message: 'Productos obtenidos correctamente',
      count: products.length,
      total,
      page: parseInt(page),
      totalPages,
      data: products
    });
  } catch (error) {
    console.error('❌ Error getting products:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message
    });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    
    if (!productId || isNaN(productId)) {
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

    console.log(`📦 Returning product: ${product.title}`);

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('❌ Error getting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      error: error.message
    });
  }
});

// Search products
app.get('/api/products/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Parámetro de búsqueda requerido'
      });
    }

    const products = await Product.find({
      $and: [
        { status: 'active' },
        {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { code: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    })
    .limit(parseInt(limit));

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('❌ Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error en la búsqueda',
      error: error.message
    });
  }
});

// Stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const [productCount, activeProducts, lowStockProducts] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Product.countDocuments({ stock: { $lte: 5, $gt: 0 } })
    ]);

    res.json({
      success: true,
      data: {
        products: {
          total: productCount,
          active: activeProducts,
          lowStock: lowStockProducts
        },
        database: {
          status: 'Connected',
          host: mongoose.connection.host,
          name: mongoose.connection.name
        },
        server: {
          status: 'Running',
          environment: process.env.NODE_ENV,
          port: PORT
        }
      }
    });
  } catch (error) {
    console.error('❌ Error getting stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas',
      error: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: `Endpoint no encontrado: ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'GET /health',
      'GET /api/test',
      'GET /api/products',
      'GET /api/products/:id',
      'GET /api/stats'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: err.message
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('🚀 UriShop Backend Started!');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log('');
  console.log('🔗 Available URLs:');
  console.log(`   🩺 Health: http://localhost:${PORT}/health`);
  console.log(`   🧪 API Test: http://localhost:${PORT}/api/test`);
  console.log(`   📦 Products: http://localhost:${PORT}/api/products`);
  console.log(`   📊 Stats: http://localhost:${PORT}/api/stats`);
  console.log('');
  console.log('🎮 Frontend should connect automatically via Vite proxy');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
  });
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  console.log('💥 Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.log('💥 Uncaught Exception:', err.message);
  process.exit(1);
});