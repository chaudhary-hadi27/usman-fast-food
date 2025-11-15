// src/app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import OptimizedImage from '../../../../components/OptimizedImage';
import { trackEvent } from '../../../../lib/monitoring';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  items: any[];
  totalAmount: number;
  status: string;
  createdAt: string;
  deliveryAddress: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('orders');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Burger',
    image: '',
  });

  useEffect(() => {
    fetchMenuItems();
    fetchOrders();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/menu');
      const data = await res.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders?all=true');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      trackEvent('auth', 'logout', 'admin');
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
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

      const data = await res.json();

      if (res.ok) {
        alert(editingItem ? 'Item updated!' : 'Item added!');
        trackEvent('admin', editingItem ? 'menu_update' : 'menu_create', menuForm.name);
        setShowMenuForm(false);
        setEditingItem(null);
        setMenuForm({ name: '', description: '', price: 0, category: 'Burger', image: '' });
        fetchMenuItems();
      } else {
        alert(data.message || 'Failed to save item');
      }
    } catch (error) {
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

  const handleDeleteItem = async (id: string, name: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`/api/menu?id=${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        alert('Item deleted!');
        trackEvent('admin', 'menu_delete', name);
        fetchMenuItems();
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
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
        trackEvent('admin', 'order_status_update', status);
        fetchOrders();
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-yellow-400">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                fetchMenuItems();
                fetchOrders();
              }}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg transition"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'orders' ? 'bg-yellow-400 text-black' : 'bg-white text-black'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'menu' ? 'bg-yellow-400 text-black' : 'bg-white text-black'
            }`}
          >
            Menu Items ({menuItems.length})
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

        {activeTab === 'orders' && !loading && (
          <div>
            <h2 className="text-3xl font-bold mb-6">All Orders</h2>
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">Order #{order.orderId}</h3>
                      <p className="text-gray-600">{order.customerName} - {order.customerPhone}</p>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-yellow-600">Rs. {order.totalAmount}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Cooking' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-semibold mb-2">Items:</p>
                    {order.items.map((item, idx) => (
                      <p key={idx} className="text-gray-600">
                        {item.name} x{item.quantity} - Rs. {item.price * item.quantity}
                      </p>
                    ))}
                  </div>

                  <div className="mb-4">
                    <p className="font-semibold">Delivery Address:</p>
                    <p className="text-gray-600">{order.deliveryAddress}</p>
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.orderId, e.target.value)}
                      className="input-field"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Cooking">Cooking</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              ))}
              
              {orders.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-600 text-lg">No orders yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'menu' && !loading && (
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
              <div className="card p-6 mb-8">
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
                    <button type="submit" className="btn-primary">Save</button>
                    <button type="button" onClick={() => setShowMenuForm(false)} className="btn-secondary">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map(item => (
                <div key={item._id} className="card overflow-hidden">
                  <div className="relative h-48">
                    <OptimizedImage
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                    <p className="text-yellow-600 font-bold mb-4">Rs. {item.price}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditItem(item)} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button onClick={() => handleDeleteItem(item._id, item.name)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {menuItems.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-600 text-lg mb-4">No menu items yet</p>
                  <button
                    onClick={() => setShowMenuForm(true)}
                    className="btn-primary"
                  >
                    <Plus className="w-5 h-5 inline mr-2" />
                    Add First Item
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}