import { Order, User, Address } from "@/types";

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
  // Get user info for this order
  const users = getUsers();
  // Try to match by id, fallback to currentUser in localStorage
  let user = users.find(u => u.id === userId);
  if (!user) {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      user = JSON.parse(currentUser);
    }
  }

  // Always try to get email from localStorage currentUser if not found in users
  if (!user || !user.email) {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const parsed = JSON.parse(currentUser);
      if (parsed.email) {
        user = { ...user, email: parsed.email, name: parsed.name };
      }
    }
  }

  const newOrder: Order = {
    id: `order_${Date.now()}`,
    userId: user && user.id ? user.id : userId,
    items,
    totalPrice,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    address,
    userName: user ? user.name : undefined,
    userEmail: user ? user.email : undefined
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
export const getUsers = (): User[] => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users;
};

// Get stats for admin dashboard
export const getAdminStats = () => {
  const users = getUsers();
  const orders = getOrders();

  return {
    totalUsers: users.length,
    totalOrders: orders.length,
    totalProducts: 0, // Not available from local data
    totalSales: orders.reduce((sum, order) => sum + order.totalPrice, 0),
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    lowStockProducts: 0 // Not available from local data
  };
};
