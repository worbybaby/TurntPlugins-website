'use client';

import { useState, useCallback, useTransition } from 'react';
import Link from 'next/link';
import RetroButton from '../components/RetroButton';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    startTransition(() => {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#5DADE2]">
      {/* Header Bar */}
      <header className="bg-white border-b-4 border-black px-3 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold cursor-pointer hover:opacity-80">
              TURNT PLUG-INS
            </h1>
          </Link>
          <Link href="/">
            <RetroButton className="!px-2.5 sm:!px-6 md:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base md:!text-lg">
              Back to Store
            </RetroButton>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="bg-white border-4 border-black p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Support</h2>
          <p className="text-base sm:text-lg leading-relaxed mb-6">
            Need help? Send us a message and we'll get back to you as soon as possible.
          </p>

          {status === 'success' ? (
            <div className="bg-green-100 border-4 border-green-600 p-6 mb-6">
              <p className="text-lg font-bold mb-2">Message sent!</p>
              <p className="text-base leading-loose">
                Thanks for reaching out. We'll get back to you soon at the email address you provided.
              </p>
              <RetroButton
                onClick={() => setStatus('idle')}
                className="mt-4 !px-6 !py-3"
              >
                Send Another Message
              </RetroButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-base font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={status === 'loading'}
                  className="w-full border-4 border-black px-4 py-3 text-base focus:outline-none focus:border-blue-600 disabled:bg-gray-200"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-base font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={status === 'loading'}
                  className="w-full border-4 border-black px-4 py-3 text-base focus:outline-none focus:border-blue-600 disabled:bg-gray-200"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-base font-bold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={status === 'loading'}
                  className="w-full border-4 border-black px-4 py-3 text-base focus:outline-none focus:border-blue-600 disabled:bg-gray-200"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-base font-bold mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  disabled={status === 'loading'}
                  className="w-full border-4 border-black px-4 py-3 text-base focus:outline-none focus:border-blue-600 disabled:bg-gray-200 resize-none"
                />
              </div>

              {status === 'error' && (
                <div className="bg-red-100 border-4 border-red-600 p-4">
                  <p className="text-base font-bold">Error: {errorMessage}</p>
                </div>
              )}

              <RetroButton
                type="submit"
                disabled={status === 'loading'}
                className="w-full !py-4 !text-lg"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </RetroButton>
            </form>
          )}

          <div className="mt-8 pt-6 border-t-4 border-black">
            <p className="text-base leading-loose text-gray-700">
              You can also reach us on Instagram{' '}
              <a
                href="https://instagram.com/turntplugins"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline font-bold"
              >
                @turntplugins
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-black mt-16 px-6 py-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-700">
          <div className="mb-2 space-x-4">
            <Link href="/support" className="text-blue-600 hover:text-blue-800 underline font-bold">
              Support
            </Link>
            <Link href="/donate" className="text-blue-600 hover:text-blue-800 underline font-bold">
              Donate
            </Link>
          </div>
          © 2025 Turnt Plugins. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
