'use client';

import { useState, useEffect } from 'react';
import RetroButton from '../components/RetroButton';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  freeDownloads: number;
  paidOrders: number;
  uniqueCustomers: number;
  totalDownloads: number;
}

interface Order {
  id: number;
  email: string;
  amount_total: number;
  plugins: string;
  created_at: string;
  download_count: number;
}

interface PluginStat {
  name: string;
  count: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [pluginStats, setPluginStats] = useState<PluginStat[]>([]);

  useEffect(() => {
    // Check if already authenticated (session storage)
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchAdminData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        sessionStorage.setItem('admin_authenticated', 'true');
        setIsAuthenticated(true);
        fetchAdminData();
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
        setPluginStats(data.pluginStats);
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setPassword('');
  };

  const exportEmails = async () => {
    try {
      const response = await fetch('/api/admin/export-emails');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `turnt-plugins-emails-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export emails:', err);
      alert('Failed to export emails');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#5DADE2] flex items-center justify-center p-4">
        <div className="bg-white border-4 border-black w-full max-w-md">
          <div className="bg-[#000080] border-b-4 border-black p-4">
            <h1 className="text-2xl font-bold text-white">ADMIN LOGIN</h1>
          </div>
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border-2 border-black focus:outline-none"
                required
              />
            </div>
            {error && (
              <div className="bg-red-200 border-2 border-red-600 p-3 text-sm font-bold">
                {error}
              </div>
            )}
            <RetroButton type="submit" disabled={loading} className="w-full">
              {loading ? 'Authenticating...' : 'LOGIN'}
            </RetroButton>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#5DADE2]">
      {/* Header */}
      <header className="bg-white border-b-4 border-black px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold">TURNT PLUGINS ADMIN</h1>
          <div className="flex gap-4">
            <RetroButton onClick={exportEmails}>Export Emails</RetroButton>
            <RetroButton onClick={handleLogout}>Logout</RetroButton>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#FFE66D] border-4 border-black p-6">
              <h3 className="text-lg font-bold mb-2">Total Orders</h3>
              <p className="text-4xl font-bold">{stats.totalOrders}</p>
              <p className="text-sm mt-2">
                {stats.paidOrders} paid • {stats.freeDownloads} free
              </p>
            </div>
            <div className="bg-[#90EE90] border-4 border-black p-6">
              <h3 className="text-lg font-bold mb-2">Total Revenue</h3>
              <p className="text-4xl font-bold break-words">${(stats.totalRevenue / 100).toFixed(2)}</p>
              <p className="text-sm mt-2">From {stats.paidOrders} paid orders</p>
            </div>
            <div className="bg-[#FFB6C1] border-4 border-black p-6">
              <h3 className="text-lg font-bold mb-2">Unique Customers</h3>
              <p className="text-4xl font-bold">{stats.uniqueCustomers}</p>
              <p className="text-sm mt-2">{stats.totalDownloads} total downloads</p>
            </div>
          </div>
        )}

        {/* Plugin Stats */}
        <div className="bg-white border-4 border-black p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Plugin Popularity</h2>
          <div className="space-y-3">
            {pluginStats.map((plugin, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="font-bold w-8">{index + 1}.</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">{plugin.name}</span>
                    <span className="font-bold">{plugin.count} orders</span>
                  </div>
                  <div className="bg-gray-200 border-2 border-black h-6">
                    <div
                      className="bg-[#000080] h-full"
                      style={{
                        width: `${(plugin.count / Math.max(...pluginStats.map(p => p.count))) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border-4 border-black p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left p-2 font-bold">Date</th>
                  <th className="text-left p-2 font-bold">Email</th>
                  <th className="text-left p-2 font-bold">Amount</th>
                  <th className="text-left p-2 font-bold">Plugins</th>
                  <th className="text-left p-2 font-bold">Downloads</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-300">
                    <td className="p-2">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="p-2">{order.email}</td>
                    <td className="p-2 font-bold">
                      {order.amount_total === 0 ? 'FREE' : `$${(order.amount_total / 100).toFixed(2)}`}
                    </td>
                    <td className="p-2">
                      {JSON.parse(order.plugins).map((p: { name: string }) => p.name).join(', ')}
                    </td>
                    <td className="p-2">{order.download_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
