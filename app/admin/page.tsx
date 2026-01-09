'use client';

import { useState, useEffect } from 'react';
import RetroButton from '../components/RetroButton';
import OrdersChart from '../components/OrdersChart';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  freeDownloads: number;
  paidOrders: number;
  uniqueCustomers: number;
  totalDownloads: number;
  marketingSubscribers: number;
}

interface Order {
  id: number;
  email: string;
  amount_total: number;
  plugins: string;
  created_at: string;
  download_count: number;
  license_key?: string;
  tape_bloom_license_key?: string;
  payment_provider?: string;
}

interface PluginStat {
  name: string;
  count: number;
}

interface ChartData {
  date: string;
  totalOrders: number;
  paidOrders: number;
  freeOrders: number;
  revenue: number;
}

interface ProviderBreakdown {
  provider: string;
  orders: number;
  revenue: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [pluginStats, setPluginStats] = useState<PluginStat[]>([]);
  const [providerBreakdown, setProviderBreakdown] = useState<ProviderBreakdown[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [generatingLicense, setGeneratingLicense] = useState(false);
  const [newLicenseEmail, setNewLicenseEmail] = useState('');
  const [generatedLicense, setGeneratedLicense] = useState('');
  const [generatingTapeBloomLicense, setGeneratingTapeBloomLicense] = useState(false);
  const [newTapeBloomLicenseEmail, setNewTapeBloomLicenseEmail] = useState('');
  const [generatedTapeBloomLicense, setGeneratedTapeBloomLicense] = useState('');
  const [addingSubscriber, setAddingSubscriber] = useState(false);
  const [newSubscriberEmail, setNewSubscriberEmail] = useState('');
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [oldEmail, setOldEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');

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
      const [statsResponse, chartResponse] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/chart-data'),
      ]);

      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
        setPluginStats(data.pluginStats);
        setProviderBreakdown(data.providerBreakdown || []);
      }

      if (chartResponse.ok) {
        const data = await chartResponse.json();
        setChartData(data.chartData);
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

  const exportSubscribers = async () => {
    try {
      const response = await fetch('/api/admin/export-subscribers');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `marketing-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export subscribers:', err);
      alert('Failed to export subscribers');
    }
  };

  const generateManualLicense = async () => {
    if (!newLicenseEmail || !newLicenseEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setGeneratingLicense(true);
    try {
      const response = await fetch('/api/admin/generate-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newLicenseEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedLicense(data.licenseKey);
        alert(`License generated and emailed to ${newLicenseEmail}!`);
        setNewLicenseEmail('');
        fetchAdminData(); // Refresh data
      } else {
        const errorData = await response.json();
        alert(`Failed to generate license: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Failed to generate license:', err);
      alert('Failed to generate license');
    } finally {
      setGeneratingLicense(false);
    }
  };

  const generateTapeBloomManualLicense = async () => {
    if (!newTapeBloomLicenseEmail || !newTapeBloomLicenseEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setGeneratingTapeBloomLicense(true);
    try {
      const response = await fetch('/api/admin/generate-tapebloom-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newTapeBloomLicenseEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedTapeBloomLicense(data.licenseKey);
        alert(`TapeBloom license generated and emailed to ${newTapeBloomLicenseEmail}!`);
        setNewTapeBloomLicenseEmail('');
        fetchAdminData(); // Refresh data
      } else {
        const errorData = await response.json();
        alert(`Failed to generate license: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Failed to generate TapeBloom license:', err);
      alert('Failed to generate license');
    } finally {
      setGeneratingTapeBloomLicense(false);
    }
  };

  const addManualSubscriber = async () => {
    if (!newSubscriberEmail || !newSubscriberEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setAddingSubscriber(true);
    try {
      const response = await fetch('/api/admin/add-subscriber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newSubscriberEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`${newSubscriberEmail} added to marketing list!`);
        setNewSubscriberEmail('');
        fetchAdminData(); // Refresh data
      } else {
        const errorData = await response.json();
        alert(`Failed to add subscriber: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Failed to add subscriber:', err);
      alert('Failed to add subscriber');
    } finally {
      setAddingSubscriber(false);
    }
  };

  const updateCustomerEmail = async () => {
    if (!oldEmail || !oldEmail.includes('@')) {
      alert('Please enter a valid old email address');
      return;
    }
    if (!newEmail || !newEmail.includes('@')) {
      alert('Please enter a valid new email address');
      return;
    }

    setUpdatingEmail(true);
    try {
      const response = await fetch('/api/admin/update-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldEmail, newEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setOldEmail('');
        setNewEmail('');
        fetchAdminData(); // Refresh data
      } else {
        const errorData = await response.json();
        alert(`Failed to update email: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Failed to update email:', err);
      alert('Failed to update email');
    } finally {
      setUpdatingEmail(false);
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
            <RetroButton onClick={exportEmails}>Export All Emails</RetroButton>
            <RetroButton onClick={exportSubscribers}>Export Subscribers</RetroButton>
            <RetroButton onClick={handleLogout}>Logout</RetroButton>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            <div className="bg-[#87CEEB] border-4 border-black p-6">
              <h3 className="text-lg font-bold mb-2">Marketing Subscribers</h3>
              <p className="text-4xl font-bold">{stats.marketingSubscribers}</p>
              <p className="text-sm mt-2">Opted in for updates</p>
            </div>
          </div>
        )}

        {/* Payment Provider Breakdown */}
        {providerBreakdown.length > 0 && (
          <div className="bg-white border-4 border-black p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">💳 Payment Provider Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providerBreakdown.map((provider) => (
                <div key={provider.provider} className="bg-gray-100 border-2 border-black p-4">
                  <h3 className="text-lg font-bold mb-3 uppercase">
                    {provider.provider === 'stripe' ? '💳 Stripe' : '🅿️ PayPal'}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Orders:</span>
                      <span className="font-bold">{provider.orders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Revenue:</span>
                      <span className="font-bold text-green-700">${(provider.revenue / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Order:</span>
                      <span className="font-bold">${(provider.revenue / provider.orders / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Chart */}
        <OrdersChart data={chartData} />

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

        {/* VocalFelt License Management */}
        <div className="bg-white border-4 border-black p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">🎫 VocalFelt License Management</h2>

          <div className="bg-[#FFD700] border-2 border-black p-4 mb-4">
            <h3 className="font-bold mb-2">Manual License Generation</h3>
            <p className="text-sm mb-3">
              Generate a new license for a customer who lost their original code.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                value={newLicenseEmail}
                onChange={(e) => setNewLicenseEmail(e.target.value)}
                placeholder="customer@email.com"
                className="flex-1 px-3 py-2 border-2 border-black focus:outline-none"
              />
              <RetroButton onClick={generateManualLicense} disabled={generatingLicense}>
                {generatingLicense ? 'Generating...' : 'Generate & Email License'}
              </RetroButton>
            </div>
            {generatedLicense && (
              <div className="mt-3 p-3 bg-white border-2 border-black">
                <p className="text-xs font-bold mb-1">Generated License:</p>
                <p className="font-mono text-sm font-bold">{generatedLicense}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-bold mb-2">Recent VocalFelt Licenses</h3>
            {recentOrders
              .filter(order => order.license_key)
              .slice(0, 5)
              .map((order) => (
                <div key={order.id} className="bg-gray-100 border border-black p-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm">{order.email}</p>
                    <p className="text-xs text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="font-mono text-xs bg-white border border-black px-2 py-1">
                      {order.license_key}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(order.license_key!);
                        alert('License copied!');
                      }}
                      className="px-2 py-1 bg-white border-2 border-black hover:bg-gray-200 text-xs font-bold"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            {recentOrders.filter(order => order.license_key).length === 0 && (
              <p className="text-sm text-gray-600">No VocalFelt licenses issued yet.</p>
            )}
          </div>
        </div>

        {/* TapeBloom License Management */}
        <div className="bg-white border-4 border-black p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">🎫 TapeBloom License Management</h2>

          <div className="bg-[#87CEEB] border-2 border-black p-4 mb-4">
            <h3 className="font-bold mb-2">Manual License Generation</h3>
            <p className="text-sm mb-3">
              Generate a new TapeBloom license for a customer who lost their original code.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                value={newTapeBloomLicenseEmail}
                onChange={(e) => setNewTapeBloomLicenseEmail(e.target.value)}
                placeholder="customer@email.com"
                className="flex-1 px-3 py-2 border-2 border-black focus:outline-none"
              />
              <RetroButton onClick={generateTapeBloomManualLicense} disabled={generatingTapeBloomLicense}>
                {generatingTapeBloomLicense ? 'Generating...' : 'Generate & Email License'}
              </RetroButton>
            </div>
            {generatedTapeBloomLicense && (
              <div className="mt-3 p-3 bg-white border-2 border-black">
                <p className="text-xs font-bold mb-1">Generated TapeBloom License:</p>
                <p className="font-mono text-sm font-bold">{generatedTapeBloomLicense}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-bold mb-2">Recent TapeBloom Licenses</h3>
            {recentOrders
              .filter(order => order.tape_bloom_license_key)
              .slice(0, 5)
              .map((order) => (
                <div key={order.id} className="bg-gray-100 border border-black p-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm">{order.email}</p>
                    <p className="text-xs text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="font-mono text-xs bg-white border border-black px-2 py-1">
                      {order.tape_bloom_license_key}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(order.tape_bloom_license_key!);
                        alert('License copied!');
                      }}
                      className="px-2 py-1 bg-white border-2 border-black hover:bg-gray-200 text-xs font-bold"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            {recentOrders.filter(order => order.tape_bloom_license_key).length === 0 && (
              <p className="text-sm text-gray-600">No TapeBloom licenses issued yet.</p>
            )}
          </div>
        </div>

        {/* Marketing Subscriber Management */}
        <div className="bg-white border-4 border-black p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">📧 Marketing Subscriber Management</h2>

          <div className="bg-[#87CEEB] border-2 border-black p-4 mb-4">
            <h3 className="font-bold mb-2">Add Manual Subscriber</h3>
            <p className="text-sm mb-3">
              Manually add someone to the marketing opt-in list.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                value={newSubscriberEmail}
                onChange={(e) => setNewSubscriberEmail(e.target.value)}
                placeholder="subscriber@email.com"
                className="flex-1 px-3 py-2 border-2 border-black focus:outline-none"
              />
              <RetroButton onClick={addManualSubscriber} disabled={addingSubscriber}>
                {addingSubscriber ? 'Adding...' : 'Add Subscriber'}
              </RetroButton>
            </div>
          </div>
        </div>

        {/* Customer Email Fix */}
        <div className="bg-white border-4 border-black p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">🔧 Fix Customer Email</h2>

          <div className="bg-[#FFB6C1] border-2 border-black p-4">
            <h3 className="font-bold mb-2">Update Order Email</h3>
            <p className="text-sm mb-3">
              Fix a customer&apos;s email address if they made a typo during checkout.
              This will update all orders with the old email.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">Old Email (incorrect):</label>
                <input
                  type="email"
                  value={oldEmail}
                  onChange={(e) => setOldEmail(e.target.value)}
                  placeholder="customer@gmial.com"
                  className="w-full px-3 py-2 border-2 border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">New Email (correct):</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="customer@gmail.com"
                  className="w-full px-3 py-2 border-2 border-black focus:outline-none"
                />
              </div>
              <RetroButton onClick={updateCustomerEmail} disabled={updatingEmail}>
                {updatingEmail ? 'Updating...' : 'Update Email'}
              </RetroButton>
            </div>
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
                  <th className="text-left p-2 font-bold">Payment</th>
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
                      <span className={`px-2 py-1 text-xs font-bold border-2 border-black ${
                        order.payment_provider === 'paypal' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {order.payment_provider === 'paypal' ? 'PayPal' : 'Stripe'}
                      </span>
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
