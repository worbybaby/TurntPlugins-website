'use client';

import { useState, useCallback, useTransition } from 'react';
import Link from 'next/link';
import RetroButton from '../components/RetroButton';

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const presetAmounts = [5, 10, 20, 50];

  const handleAmountSelect = (amount: number) => {
    startTransition(() => {
      setSelectedAmount(amount);
      setCustomAmount('');
      setError('');
    });
  };

  const handleCustomAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    startTransition(() => {
      setCustomAmount(value);
      setSelectedAmount(null);
      setError('');
    });
  }, []);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    startTransition(() => {
      setEmail(value);
      setError('');
    });
  }, []);

  const getDonationAmount = (): number => {
    if (selectedAmount !== null) return selectedAmount;
    const custom = parseFloat(customAmount);
    return isNaN(custom) ? 0 : custom;
  };

  const handleDonate = async () => {
    const amount = getDonationAmount();

    // Validate amount
    if (amount < 1) {
      setError('Please enter a donation amount of at least $1');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/create-donation-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          email,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create donation session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

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
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Support Development</h2>
          <p className="text-base sm:text-lg leading-relaxed mb-6">
            Love the plugins? Help support future development and updates with a donation. Every bit helps keep the plugins maintained and new features coming!
          </p>

          {/* Preset Amounts */}
          <div className="mb-6">
            <label className="block text-base font-bold mb-3">Select Amount:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountSelect(amount)}
                  disabled={isLoading}
                  className={`border-4 px-4 py-3 text-lg font-bold transition-colors ${
                    selectedAmount === amount
                      ? 'bg-[#FFE66D] border-black'
                      : 'bg-white border-black hover:bg-gray-100'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="mb-6">
            <label htmlFor="customAmount" className="block text-base font-bold mb-2">
              Or Enter Custom Amount:
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold">$</span>
              <input
                type="number"
                id="customAmount"
                value={customAmount}
                onChange={handleCustomAmountChange}
                disabled={isLoading}
                min="1"
                step="1"
                placeholder="Enter amount"
                className="w-full border-4 border-black pl-10 pr-4 py-3 text-base focus:outline-none focus:border-blue-600 disabled:bg-gray-200"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-base font-bold mb-2">
              Email Address:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              disabled={isLoading}
              placeholder="your@email.com"
              className="w-full border-4 border-black px-4 py-3 text-base focus:outline-none focus:border-blue-600 disabled:bg-gray-200"
            />
            <p className="text-sm text-gray-600 mt-2">For your donation receipt</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-4 border-red-600 p-4 mb-6">
              <p className="text-base font-bold">{error}</p>
            </div>
          )}

          {/* Donate Button */}
          <RetroButton
            onClick={handleDonate}
            disabled={isLoading || getDonationAmount() < 1}
            className="w-full !py-4 !text-lg"
          >
            {isLoading ? 'Processing...' : `Donate $${getDonationAmount().toFixed(2)}`}
          </RetroButton>

          <p className="text-sm text-gray-600 text-center mt-4">
            Secure payment powered by Stripe
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-[#FFE66D] border-4 border-black p-6">
          <h3 className="text-xl font-bold mb-3">Why Donate?</h3>
          <ul className="text-base leading-loose space-y-2">
            <li>✓ Support ongoing plugin maintenance and updates</li>
            <li>✓ Fund development of new features and plugins</li>
            <li>✓ Keep plugins compatible with the latest DAWs and OS versions</li>
            <li>✓ Help a small independent developer create quality tools</li>
          </ul>
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
