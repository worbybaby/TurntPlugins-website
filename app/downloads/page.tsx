'use client';

import { useState } from 'react';
import Link from 'next/link';
import RetroButton from '../components/RetroButton';

export default function DownloadsPage() {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#5DADE2]">
      {/* Header Bar */}
      <header className="bg-white border-b-4 border-black px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <h1 className="text-3xl font-bold cursor-pointer hover:text-gray-700">
              TURNT PLUGINS
            </h1>
          </Link>
          <Link href="/">
            <RetroButton>Back to Home</RetroButton>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white border-4 border-black p-8">
          <div className="bg-[#000080] px-4 py-3 mb-6 border-b-4 border-black -m-8 mb-8">
            <span className="text-white font-bold text-lg">My Downloads</span>
          </div>

          <p className="text-base leading-loose mb-6">
            Enter your email address to access your purchased plugins and download links.
          </p>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-2 border-2 border-black focus:outline-none text-base"
              />
              <RetroButton type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Get My Downloads'}
              </RetroButton>
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </form>

          {orders.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4">Your Orders</h2>
              {orders.map((order) => (
                <div key={order.id} className="border-2 border-black p-4 bg-[#FFE66D]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-bold">
                        Order #{order.stripe_session_id.slice(-8)}
                      </p>
                      <p className="text-xs text-gray-700">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-bold">
                      ${(order.amount_total / 100).toFixed(2)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {order.downloads && order.downloads[0] && order.downloads[0].plugin_id && order.downloads.map((download: any, idx: number) => {
                      const isExpired = new Date(download.expires_at) < new Date();

                      return (
                        <div
                          key={idx}
                          className="bg-white border border-black p-3 flex justify-between items-center"
                        >
                          <div>
                            <p className="font-bold text-sm">{download.plugin_name}</p>
                            <p className="text-xs text-gray-600">
                              {isExpired
                                ? 'Link expired - contact support'
                                : `Expires: ${new Date(download.expires_at).toLocaleDateString()}`}
                            </p>
                            <p className="text-xs text-gray-600">
                              Downloaded: {download.download_count} time(s)
                            </p>
                          </div>
                          {!isExpired && (
                            <a
                              href={download.download_url}
                              className="px-4 py-2 bg-white border-2 border-black hover:bg-gray-200 font-bold text-sm"
                            >
                              Download
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {orders.length === 0 && email && !loading && !error && (
            <p className="text-center text-gray-600 py-8">
              No orders found for this email address.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
