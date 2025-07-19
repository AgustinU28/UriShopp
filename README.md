# ===== README.md =====
# 🎮 UriShop Frontend

Aplicación frontend de UriShop - Tu tienda de computadoras gamer de confianza.

## 🚀 Tecnologías

- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Build tool y dev server
- **React Bootstrap** - Componentes UI
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **React Icons** - Iconos

## 📦 Instalación

```bash
npm install
```

## 🏃‍♂️ Desarrollo

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── admin/          # Componentes de administración
│   ├── auth/           # Componentes de autenticación
│   ├── cart/           # Componentes del carrito
│   ├── common/         # Componentes comunes
│   ├── orders/         # Componentes de órdenes
│   ├── products/       # Componentes de productos
│   └── tickets/        # Componentes de tickets
├── context/            # Contextos de React
├── hooks/              # Custom hooks
├── pages/              # Páginas principales
├── services/           # Servicios API
├── styles/             # Estilos globales
└── utils/              # Utilidades
```

## 🌟 Características

- ✅ Catálogo de productos
- ✅ Carrito de compras
- ✅ Sistema de autenticación
- ✅ Panel de administración
- ✅ Gestión de órdenes
- ✅ Sistema de tickets
- ✅ Diseño responsivo
- ✅ Tema claro/oscuro

## 🔧 Variables de Entorno

Crea un archivo `.env` con:

```
REACT_APP_API_URL=http://localhost:5000/api