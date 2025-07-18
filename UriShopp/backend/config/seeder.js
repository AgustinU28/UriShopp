// backend/config/seeder.js
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
require('dotenv').config();

// Datos de productos de tu JSON
const productsData = [
  {
    id: 1,
    title: "Computadora Gamer 1",
    description: "Potente computadora gamer para una experiencia de juego inmersiva.",
    price: 1499.99,
    thumbnail: "https://http2.mlstatic.com/D_NQ_NP_2X_625116-MLA46651622515_072021-F.jpg",
    code: "CG1",
    stock: 10,
    category: "Gaming",
    featured: true,
    tags: ["gaming", "alta gama", "RTX"],
    specifications: [
      { name: "Procesador", value: "Intel Core i7-12700K" },
      { name: "Tarjeta Gráfica", value: "NVIDIA RTX 4070" },
      { name: "RAM", value: "32GB DDR4" },
      { name: "Almacenamiento", value: "1TB SSD NVMe" }
    ]
  },
  {
    id: 2,
    title: "Computadora Gamer 2",
    description: "Computadora de alta gama diseñada para juegos exigentes.",
    price: 1999.99,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4E6lSDWXHW_KYWUyKcimnXqFnLVOS_gy8eNyS4u7AsMsbWoTI1nySfeKkcVizsl0Y1oY&usqp=CAU",
    code: "CG2",
    stock: 5,
    category: "Gaming",
    featured: true,
    tags: ["gaming", "premium", "4K"],
    specifications: [
      { name: "Procesador", value: "Intel Core i9-13900K" },
      { name: "Tarjeta Gráfica", value: "NVIDIA RTX 4080" },
      { name: "RAM", value: "64GB DDR5" },
      { name: "Almacenamiento", value: "2TB SSD NVMe" }
    ]
  },
  {
    id: 3,
    title: "Computadora Gamer 3",
    description: "Rendimiento excepcional para jugadores serios.",
    price: 1299.99,
    thumbnail: "https://http2.mlstatic.com/D_NQ_NP_2X_625116-MLA46651622515_072021-F.jpg",
    code: "CG3",
    stock: 8,
    category: "Gaming",
    featured: false,
    tags: ["gaming", "rendimiento", "competitivo"],
    specifications: [
      { name: "Procesador", value: "AMD Ryzen 7 7700X" },
      { name: "Tarjeta Gráfica", value: "NVIDIA RTX 4060 Ti" },
      { name: "RAM", value: "16GB DDR5" },
      { name: "Almacenamiento", value: "512GB SSD NVMe" }
    ]
  },
  {
    id: 4,
    title: "Computadora Gamer 4",
    description: "Diseñada para jugar a los juegos más nuevos con fluidez.",
    price: 1699.99,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4E6lSDWXHW_KYWUyKcimnXqFnLVOS_gy8eNyS4u7AsMsbWoTI1nySfeKkcVizsl0Y1oY&usqp=CAU",
    code: "CG4",
    stock: 7,
    category: "Gaming",
    featured: false,
    tags: ["gaming", "fluido", "VR ready"],
    specifications: [
      { name: "Procesador", value: "Intel Core i7-13700K" },
      { name: "Tarjeta Gráfica", value: "NVIDIA RTX 4070 Ti" },
      { name: "RAM", value: "32GB DDR5" },
      { name: "Almacenamiento", value: "1TB SSD NVMe + 2TB HDD" }
    ]
  },
  {
    id: 5,
    title: "Computadora Gamer 5",
    description: "Excelente rendimiento gráfico y potencia de procesamiento.",
    price: 1799.99,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtCIYI2HaLQiPdi86UU6qQZ3iJC3VkckU7zA&usqp=CAU",
    code: "CG5",
    stock: 12,
    category: "Gaming",
    featured: true,
    tags: ["gaming", "potencia", "streaming"],
    specifications: [
      { name: "Procesador", value: "AMD Ryzen 9 7900X" },
      { name: "Tarjeta Gráfica", value: "NVIDIA RTX 4070 Ti" },
      { name: "RAM", value: "32GB DDR5" },
      { name: "Almacenamiento", value: "2TB SSD NVMe" }
    ]
  },
  {
    id: 6,
    title: "Computadora Gamer 6",
    description: "Rendimiento superior para jugadores competitivos.",
    price: 1599.99,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYzbDQPUXHf-T9LFoecXmbWg-ufUbdpQG2og&usqp=CAU",
    code: "CG6",
    stock: 6,
    category: "Gaming",
    featured: false,
    tags: ["gaming", "competitivo", "144Hz"],
    specifications: [
      { name: "Procesador", value: "Intel Core i5-13600K" },
      { name: "Tarjeta Gráfica", value: "NVIDIA RTX 4060 Ti" },
      { name: "RAM", value: "16GB DDR5" },
      { name: "Almacenamiento", value: "1TB SSD NVMe" }
    ]
  },
  {
    id: 7,
    title: "Computadora Gamer 7",
    description: "Diseñada para una experiencia de juego fluida y sin problemas.",
    price: 1399.99,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_ntuVdbyZgCBVVIGRqPeaUoTJ24ID5IbP2g&usqp=CAU",
    code: "CG7",
    stock: 9,
    category: "Gaming",
    featured: false,
    tags: ["gaming", "fluido", "balance"],
    specifications: [
      { name: "Procesador", value: "AMD Ryzen 5 7600X" },
      { name: "Tarjeta Gráfica", value: "NVIDIA RTX 4060" },
      { name: "RAM", value: "16GB DDR4" },
      { name: "Almacenamiento", value: "512GB SSD NVMe + 1TB HDD" }
    ]
  },
  {
    id: 8,
    title: "Computadora Gamer 8",
    description: "Rendimiento confiable para juegos de alta gama.",
    price: 1699.99,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8vZyqRXx8ZO7GxiackXaK7T-q8vx2d2UMwQ&usqp=CAU",
    code: "CG8",
    stock: 4,
    category: "Gaming",
    featured: false,
    tags: ["gaming", "confiable", "alta gama"],
    specifications: [
      { name: "Procesador", value: "Intel Core i7-12700K" },
      { name: "Tarjeta Gráfica", value: "NVIDIA RTX 4070" },
      { name: "RAM", value: "32GB DDR4" },
      { name: "Almacenamiento", value: "1TB SSD NVMe" }
    ]
  },
  {
    id: 9,
    title: "Computadora Gamer 9",
    description: "Potencia y calidad gráfica excepcionales para entusiastas del gaming.",
    price: 1999.99,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsGM9FqDAKbzE6CmXcLAjRG-yIs_iIXkVgCg&usqp=CAU",
    code: "CG9",
    stock: 11,
    category: "Gaming",
    featured: true,
    tags: ["gaming", "entusiasta", "máximo rendimiento"],
    specifications: [
      { name: "Procesador", value: "Intel Core i9-13900K" },
      { name: "Tarjeta Gráfica", value: "NVIDIA RTX 4090" },
      { name: "RAM", value: "64GB DDR5" },
      { name: "Almacenamiento", value: "4TB SSD NVMe" }
    ]
  }
];

// Datos de carritos de ejemplo de tu JSON
const cartsData = [
  {
    cartId: "7737e00e-71f2-4f9f-bfe7-2f30a7e7ff85",
    items: [
      { productId: 1, quantity: 16 }
    ]
  },
  {
    cartId: "c95f37ec-7b33-4979-a07c-6623a7a473bf",
    items: [
      { productId: 2, quantity: 2 },
      { productId: 5, quantity: 5 }
    ]
  },
  {
    cartId: "c4a060c5-d88c-4faf-9019-3d31ec150c63",
    items: [
      { productId: 5, quantity: 5 },
      { productId: 7, quantity: 2 },
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 3 }
    ]
  },
  {
    cartId: "8ded6a2a-3ecb-4fbe-a6ae-052ace4e7014",
    items: []
  },
  {
    cartId: "e20ffcb0-5f4a-4061-bd95-a2081efaeaf2",
    items: []
  }
];

// Función para poblar productos
const seedProducts = async () => {
  try {
    console.log('🌱 Eliminando productos existentes...');
    await Product.deleteMany({});

    console.log('📦 Creando productos...');
    const products = await Product.insertMany(productsData);
    console.log(`✅ ${products.length} productos creados exitosamente`);

    return products;
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
};

// Función para poblar carritos
const seedCarts = async () => {
  try {
    console.log('🛒 Eliminando carritos existentes...');
    await Cart.deleteMany({});

    console.log('🛒 Creando carritos...');
    
    const carts = [];
    for (const cartData of cartsData) {
      const cartItems = [];
      
      // Procesar items del carrito
      for (const item of cartData.items) {
        const product = await Product.findOne({ id: item.productId });
        if (product) {
          cartItems.push({
            product: product._id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
            subtotal: product.price * item.quantity
          });
        }
      }

      // Crear carrito
      const cart = new Cart({
        cartId: cartData.cartId,
        items: cartItems,
        status: cartItems.length > 0 ? 'active' : 'active'
      });

      // Calcular totales
      cart.calculateTotals();
      await cart.save();
      carts.push(cart);
    }

    console.log(`✅ ${carts.length} carritos creados exitosamente`);
    return carts;
  } catch (error) {
    console.error('❌ Error seeding carts:', error);
    throw error;
  }
};

// Función principal de seeding
const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seeding de la base de datos...');
    
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB');

    // Poblar productos
    await seedProducts();

    // Poblar carritos
    await seedCarts();

    console.log('🎉 Seeding completado exitosamente!');
    console.log('📊 Resumen:');
    console.log(`   - ${productsData.length} productos`);
    console.log(`   - ${cartsData.length} carritos`);
    
  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Desconectado de MongoDB');
  }
};

// Función para limpiar la base de datos
const clearDatabase = async () => {
  try {
    console.log('🧹 Limpiando base de datos...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Product.deleteMany({});
    await Cart.deleteMany({});

    console.log('✅ Base de datos limpiada');
  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error);
  } finally {
    await mongoose.disconnect();
  }
};

// Ejecutar según argumento de línea de comandos
const command = process.argv[2];

switch (command) {
  case 'seed':
    seedDatabase();
    break;
  case 'clear':
    clearDatabase();
    break;
  case 'reset':
    clearDatabase().then(() => seedDatabase());
    break;
  default:
    console.log('📋 Comandos disponibles:');
    console.log('   npm run seed        - Poblar base de datos');
    console.log('   npm run seed:clear  - Limpiar base de datos');
    console.log('   npm run seed:reset  - Limpiar y repoblar');
}

module.exports = {
  seedDatabase,
  clearDatabase,
  seedProducts,
  seedCarts
};