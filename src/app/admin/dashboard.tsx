import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { LogOut, Plus, Edit, Trash2, Package } from 'lucide-react';

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
  const router = useRouter();

  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Burger',
    image: '',
  });

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      router.push('/admin/login');
      return;
    }

    fetchMenuItems();
    fetchOrders();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders?all=true');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
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

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await fetch(`/api/menu?id=${id}`, { method: 'DELETE' });
      alert('Item deleted!');
      fetchMenuItems();
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
        fetchOrders();
      }
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard - Usman Fast Food</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-black text-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-yellow-400">Admin Dashboard</h1>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'orders' ? 'bg-yellow-400 text-black' : 'bg-white text-black'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'menu' ? 'bg-yellow-400 text-black' : 'bg-white text-black'
              }`}
            >
              Menu Items
            </button>
          </div>

          {/* Orders Tab */}
          {activeTab === 'orders' && (
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
              </div>
            </div>
          )}

          {/* Menu Tab */}
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
                  <div key={item._id} className="card">
                    <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-2">{item.description}</p>
                      <p className="text-yellow-600 font-bold mb-4">Rs. {item.price}</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditItem(item)} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button onClick={() => handleDeleteItem(item._id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}