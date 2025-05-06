
import { Product, Order, User, Review, Address } from "@/types";

// Seed initial product data
export const initializeProducts = () => {
  const existingProducts = localStorage.getItem('products');
  if (!existingProducts) {
    const initialProducts: Product[] = [
      {
        id: '1',
        name: 'Laptop Pro X1',
        description: 'High-performance laptop with 16GB RAM and 512GB SSD',
        price: 89999,
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop',
        category: 'Laptops',
        inStock: true,
        createdAt: new Date().toISOString(),
        reviews: [],
        avgRating: 0
      },
      {
        id: '2',
        name: 'Smartphone Ultra Z',
        description: '6.7-inch display, 128GB storage, triple camera system',
        price: 49999,
        imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=2070&auto=format&fit=crop',
        category: 'Smartphones',
        inStock: true,
        createdAt: new Date().toISOString(),
        reviews: [],
        avgRating: 0
      },
      {
        id: '3',
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'Premium sound quality with 20 hours battery life',
        price: 15999,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
        category: 'Audio',
        inStock: true,
        createdAt: new Date().toISOString(),
        reviews: [],
        avgRating: 0
      },
      {
        id: '4',
        name: '4K Smart TV 55"',
        description: 'Ultra HD resolution with smart features and HDR',
        price: 42999,
        imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1957&auto=format&fit=crop',
        category: 'TVs',
        inStock: true,
        createdAt: new Date().toISOString(),
        reviews: [],
        avgRating: 0
      },
      {
        id: '5',
        name: 'Wireless Gaming Mouse',
        description: 'High precision optical sensor with programmable buttons',
        price: 4999,
        imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=2065&auto=format&fit=crop',
        category: 'Gaming',
        inStock: true,
        createdAt: new Date().toISOString(),
        reviews: [],
        avgRating: 0
      },
      {
        id: '6',
        name: 'Smart Home Speaker',
        description: 'Voice-controlled speaker with built-in assistant',
        price: 7999,
        imageUrl: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=1974&auto=format&fit=crop',
        category: 'Smart Home',
        inStock: true,
        createdAt: new Date().toISOString(),
        reviews: [],
        avgRating: 0
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
export const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'reviews' | 'avgRating'>): Product => {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    reviews: [],
    avgRating: 0
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

// Add a review to a product
export const addReview = (
  productId: string, 
  reviewData: { userId: string; userName: string; rating: number; comment: string }
): Review | null => {
  const products = getProducts();
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) return null;
  
  // Create review
  const review: Review = {
    id: Date.now().toString(),
    userId: reviewData.userId,
    userName: reviewData.userName,
    rating: reviewData.rating,
    comment: reviewData.comment,
    createdAt: new Date().toISOString(),
    likes: 0
  };
  
  // Add review to product
  if (!products[productIndex].reviews) {
    products[productIndex].reviews = [];
  }
  
  products[productIndex].reviews?.push(review);
  
  // Update average rating
  const reviews = products[productIndex].reviews || [];
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  products[productIndex].avgRating = totalRating / reviews.length;
  
  localStorage.setItem('products', JSON.stringify(products));
  return review;
};

// Like a review
export const likeReview = (productId: string, reviewId: string): boolean => {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  
  if (!product || !product.reviews) return false;
  
  const reviewIndex = product.reviews.findIndex(r => r.id === reviewId);
  
  if (reviewIndex === -1) return false;
  
  product.reviews[reviewIndex].likes += 1;
  localStorage.setItem('products', JSON.stringify(products));
  
  return true;
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

// Add new order with address
export const addOrder = (
  userId: string, 
  items: Order['items'], 
  totalPrice: number,
  address: Address
): Order => {
  const orders = getOrders();
  
  const newOrder: Order = {
    id: `order_${Date.now()}`,
    userId,
    items,
    totalPrice,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    address
  };
  
  orders.push(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  return newOrder;
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
