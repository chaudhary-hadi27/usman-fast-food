'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

interface OrderItem {
  menuItem?: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  deliveryAddress: string;
  specialInstructions?: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('orders');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Burger',
    image: '',
  });

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      router.push('/admin/login');
      return;
    }

    fetchMenuItems();
    fetchOrders();
  }, [router]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/menu');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setMenuItems(data);
      } else {
        console.error('Menu items response is not an array:', data);
        setMenuItems([]);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      setMenuItems([]);
      setError('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/orders?all=true');
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data.message) {
        // API returned a message (e.g., no orders)
        console.log('API Message:', data.message);
        setOrders([]);
      } else {
        console.error('Unexpected orders response:', data);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin/login');
  };

  const handleMenuFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem 
        ? { id: editingItem._id, ...menuForm } 
        : menuForm;

      const res = await fetch('/api/menu', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert(editingItem ? 'Item updated!' : 'Item added!');
        setShowMenuForm(false);
        setEditingItem(null);
        setMenuForm({ name: '', description: '', price: 0, category: 'Burger', image: '' });
        fetchMenuItems();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to save item');
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Failed to save item');
    }
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
    });
    setShowMenuForm(true);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`/api/menu?id=${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        alert('Item deleted!');
        fetchMenuItems();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });

      if (res.ok) {
        alert('Order status updated!');
        fetchOrders();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Cooking': return 'bg-orange-100 text-orange-800';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-yellow-400">Admin Dashboard</h1>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'orders' ? 'bg-yellow-400 text-black' : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            Orders {orders.length > 0 && `(${orders.length})`}
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'menu' ? 'bg-yellow-400 text-black' : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            Menu Items {menuItems.length > 0 && `(${menuItems.length})`}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-700 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">All Orders</h2>
              <button 
                onClick={fetchOrders}
                className="bg-black text-yellow-400 px-4 py-2 rounded-lg hover:bg-gray-900 transition"
              >
                🔄 Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-gray-600">Loading orders...</p>
              </div>
            ) : !Array.isArray(orders) || orders.length === 0 ? (
              <div className="text-center py-12 card">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold mb-2">No Orders Yet</h3>
                <p className="text-gray-600">Orders will appear here once customers place them.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order._id} className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">Order #{order.orderId}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-gray-600 font-semibold">{order.customerName}</p>
                        {order.customerEmail && (
                          <p className="text-gray-500 text-sm">📧 {order.customerEmail}</p>
                        )}
                        <p className="text-gray-500 text-sm">📞 {order.customerPhone}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          🕒 {new Date(order.createdAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className="text-3xl font-black text-yellow-600">Rs. {order.totalAmount}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <p className="font-semibold mb-2 flex items-center gap-2">
                        🍔 Order Items:
                      </p>
                      <div className="space-y-1">
                        {Array.isArray(order.items) && order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                            <span className="text-gray-700">
                              <span className="font-semibold">{item.name}</span> × {item.quantity}
                            </span>
                            <span className="font-bold text-yellow-600">
                              Rs. {item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <p className="font-semibold mb-1 flex items-center gap-2">
                        📍 Delivery Address:
                      </p>
                      <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">
                        {order.deliveryAddress}
                      </p>
                    </div>

                    {order.specialInstructions && (
                      <div className="border-t border-gray-200 pt-4 mb-4">
                        <p className="font-semibold mb-1 flex items-center gap-2">
                          📝 Special Instructions:
                        </p>
                        <p className="text-gray-600 text-sm bg-yellow-50 p-3 rounded border border-yellow-200">
                          {order.specialInstructions}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2 border-t border-gray-200 pt-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.orderId, e.target.value)}
                        className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none font-semibold"
                        disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cooking">Cooking</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MENU TAB */}
        {activeTab === 'menu' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Menu Items</h2>
              <button
                onClick={() => {
                  setShowMenuForm(true);
                  setEditingItem(null);
                  setMenuForm({ name: '', description: '', price: 0, category: 'Burger', image: '' });
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Item
              </button>
            </div>

            {showMenuForm && (
              <div className="card p-6 mb-8 border-2 border-yellow-400">
                <h3 className="text-2xl font-bold mb-4">{editingItem ? 'Edit' : 'Add'} Menu Item</h3>
                <form onSubmit={handleMenuFormSubmit} className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={menuForm.name}
                    onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                    className="input-field"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={menuForm.price}
                    onChange={(e) => setMenuForm({ ...menuForm, price: Number(e.target.value) })}
                    className="input-field"
                    min="0"
                    required
                  />
                  <select
                    value={menuForm.category}
                    onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="Burger">Burger</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Fries">Fries</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={menuForm.image}
                    onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })}
                    className="input-field"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={menuForm.description}
                    onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                    className="input-field md:col-span-2"
                    rows={3}
                    required
                  />
                  <div className="md:col-span-2 flex gap-4">
                    <button type="submit" className="btn-primary">
                      {editingItem ? 'Update' : 'Add'} Item
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowMenuForm(false);
                        setEditingItem(null);
                      }} 
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-gray-600">Loading menu items...</p>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="text-center py-12 card">
                <div className="text-6xl mb-4">🍔</div>
                <h3 className="text-2xl font-bold mb-2">No Menu Items</h3>
                <p className="text-gray-600 mb-4">Add your first menu item to get started!</p>
                <button
                  onClick={() => setShowMenuForm(true)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add First Item
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map(item => (
                  <div key={item._id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop';
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-yellow-400 text-black px-3 py-1 rounded-full font-black">
                        Rs. {item.price}
                      </div>
                      {!item.available && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase">{item.category}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">{item.description}</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditItem(item)} 
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                        >
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteItem(item._id)} 
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}