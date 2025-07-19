// frontend/src/services/cartService.js
import api from './api';

class CartService {
  // Crear un nuevo carrito
  async createCart() {
    try {
      const response = await api.post('/carts');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear carrito');
    }
  }

  // Obtener carrito por ID
  async getCartById(cartId) {
    try {
      const response = await api.get(`/carts/${cartId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener carrito');
    }
  }

  // Agregar producto al carrito
  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const response = await api.post(`/carts/${cartId}/products`, {
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al agregar producto al carrito');
    }
  }

  // Actualizar cantidad de producto en el carrito
  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const response = await api.put(`/carts/${cartId}/products/${productId}`, {
        quantity
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar cantidad');
    }
  }

  // Eliminar producto del carrito
  async removeProductFromCart(cartId, productId) {
    try {
      const response = await api.delete(`/carts/${cartId}/products/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar producto del carrito');
    }
  }

  // Vaciar carrito
  async clearCart(cartId) {
    try {
      const response = await api.delete(`/carts/${cartId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al vaciar carrito');
    }
  }

  // Obtener todos los carritos (Admin)
  async getAllCarts() {
    try {
      const response = await api.get('/carts');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener carritos');
    }
  }

  // Métodos locales para manejo de carrito en localStorage
  getLocalCartId() {
    return localStorage.getItem('cartId');
  }

  setLocalCartId(cartId) {
    localStorage.setItem('cartId', cartId);
  }

  removeLocalCartId() {
    localStorage.removeItem('cartId');
  }

  // Inicializar carrito (crear si no existe)
  async initializeCart() {
    let cartId = this.getLocalCartId();
    
    if (!cartId) {
      try {
        const response = await this.createCart();
        cartId = response.data.id;
        this.setLocalCartId(cartId);
      } catch (error) {
        console.error('Error al inicializar carrito:', error);
        throw error;
      }
    }
    
    return cartId;
  }

  // Obtener carrito actual (del localStorage)
  async getCurrentCart() {
    try {
      const cartId = await this.initializeCart();
      return await this.getCartById(cartId);
    } catch (error) {
      console.error('Error al obtener carrito actual:', error);
      throw error;
    }
  }

  // Agregar producto al carrito actual
  async addToCurrentCart(productId, quantity = 1) {
    try {
      const cartId = await this.initializeCart();
      return await this.addProductToCart(cartId, productId, quantity);
    } catch (error) {
      console.error('Error al agregar al carrito actual:', error);
      throw error;
    }
  }

  // Actualizar cantidad en carrito actual
  async updateCurrentCartQuantity(productId, quantity) {
    try {
      const cartId = this.getLocalCartId();
      if (!cartId) {
        throw new Error('No hay carrito activo');
      }
      return await this.updateProductQuantity(cartId, productId, quantity);
    } catch (error) {
      console.error('Error al actualizar cantidad en carrito actual:', error);
      throw error;
    }
  }

  // Eliminar producto del carrito actual
  async removeFromCurrentCart(productId) {
    try {
      const cartId = this.getLocalCartId();
      if (!cartId) {
        throw new Error('No hay carrito activo');
      }
      return await this.removeProductFromCart(cartId, productId);
    } catch (error) {
      console.error('Error al eliminar del carrito actual:', error);
      throw error;
    }
  }

  // Vaciar carrito actual
  async clearCurrentCart() {
    try {
      const cartId = this.getLocalCartId();
      if (!cartId) {
        throw new Error('No hay carrito activo');
      }
      const response = await this.clearCart(cartId);
      return response;
    } catch (error) {
      console.error('Error al vaciar carrito actual:', error);
      throw error;
    }
  }

  // Calcular totales del carrito
  calculateCartTotals(cart) {
    if (!cart || !cart.products) {
      return {
        subtotal: 0,
        itemCount: 0,
        total: 0
      };
    }

    const subtotal = cart.products.reduce((total, item) => {
      return total + (item.subtotal || 0);
    }, 0);

    const itemCount = cart.products.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    // Por ahora el total es igual al subtotal (sin impuestos ni envío)
    const total = subtotal;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      itemCount,
      total: parseFloat(total.toFixed(2))
    };
  }

  // Validar stock antes de agregar al carrito
  async validateStock(productId, quantity) {
    try {
      const productResponse = await api.get(`/products/${productId}`);
      const product = productResponse.data.data;
      
      if (product.stock < quantity) {
        throw new Error(`Stock insuficiente. Disponible: ${product.stock}`);
      }
      
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Error al validar stock');
    }
  }
}

export default new CartService();