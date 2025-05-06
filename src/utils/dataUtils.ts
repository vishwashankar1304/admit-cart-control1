
import { Product, Order, User } from "@/types";

// Seed initial product data
export const initializeProducts = () => {
  const existingProducts = localStorage.getItem('products');
  if (!existingProducts) {
    const initialProducts: Product[] = [
      {
        id: '1',
        name: 'Laptop Pro X1',
        description: 'High-performance laptop with 16GB RAM and 512GB SSD',
        price: 1299.99,
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop',
        category: 'Laptops',
        inStock: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Smartphone Ultra Z',
        description: '6.7-inch display, 128GB storage, triple camera system',
        price: 799.99,
        imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=2070&auto=format&fit=crop',
        category: 'Smartphones',
        inStock: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'Premium sound quality with 20 hours battery life',
        price: 249.99,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
        category: 'Audio',
        inStock: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        name: '4K Smart TV 55"',
        description: 'Ultra HD resolution with smart features and HDR',
        price: 649.99,
        imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1957&auto=format&fit=crop',
        category: 'TVs',
        inStock: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Wireless Gaming Mouse',
        description: 'High precision optical sensor with programmable buttons',
        price: 79.99,
        imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=2065&auto=format&fit=crop',
        category: 'Gaming',
        inStock: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '6',
        name: 'Smart Home Speaker',
        description: 'Voice-controlled speaker with built-in assistant',
        price: 129.99,
        imageUrl: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=1974&auto=format&fit=crop',
        category: 'Smart Home',
        inStock: true,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('products', JSON.stringify(initialProducts));
  }
};

// Get all products
export const getProducts = (): Product[] => {
  return JSON.parse(localStorage.getItem('products') || '[]');
};

// Get product by id
export const getProductById = (id: string): Product | undefined => {
  const products = getProducts();
  return products.find(product => product.id === id);
};

// Add new product
export const addProduct = (product: Omit<Product, 'id' | 'createdAt'>): Product => {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  localStorage.setItem('products', JSON.stringify(products));
  return newProduct;
};

// Update product
export const updateProduct = (product: Product): Product => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  
  if (index !== -1) {
    products[index] = product;
    localStorage.setItem('products', JSON.stringify(products));
  }
  
  return product;
};

// Delete product
export const deleteProduct = (id: string): boolean => {
  const products = getProducts();
  const filteredProducts = products.filter(product => product.id !== id);
  
  if (filteredProducts.length < products.length) {
    localStorage.setItem('products', JSON.stringify(filteredProducts));
    return true;
  }
  
  return false;
};

// Get all orders
export const getOrders = (): Order[] => {
  return JSON.parse(localStorage.getItem('orders') || '[]');
};

// Get order by id
export const getOrderById = (id: string): Order | undefined => {
  const orders = getOrders();
  return orders.find(order => order.id === id);
};

// Get orders by user id
export const getOrdersByUserId = (userId: string): Order[] => {
  const orders = getOrders();
  return orders.filter(order => order.userId === userId);
};

// Update order status
export const updateOrderStatus = (id: string, status: Order['status']): Order | null => {
  const orders = getOrders();
  const orderIndex = orders.findIndex(order => order.id === id);
  
  if (orderIndex === -1) return null;
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    status,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem('orders', JSON.stringify(orders));
  return orders[orderIndex];
};

// Get all users (for admin)
export const getUsers = (): Omit<User, 'password'>[] => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.map(({ password, ...user }: User) => user);
};

// Get stats for admin dashboard
export const getAdminStats = () => {
  const users = getUsers();
  const orders = getOrders();
  const products = getProducts();
  
  const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const lowStockProducts = products.filter(product => !product.inStock).length;
  
  return {
    totalUsers: users.length,
    totalOrders: orders.length,
    totalProducts: products.length,
    totalSales,
    pendingOrders,
    lowStockProducts
  };
};
