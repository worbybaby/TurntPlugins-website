'use client';

import { useState } from 'react';
import Modal from './Modal';
import { CartItem, Plugin } from '../types';
import RetroButton from './RetroButton';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Plugin[];
  onRemoveFromCart: (pluginId: string) => void;
}

export default function CartModal({ isOpen, onClose, cartItems, onRemoveFromCart }: CartModalProps) {
  const [payAmounts, setPayAmounts] = useState<Record<string, number>>({});
  const [email, setEmail] = useState('');
  const [optInEmail, setOptInEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePayAmountChange = (pluginId: string, amount: number) => {
    setPayAmounts({ ...payAmounts, [pluginId]: amount });
  };

  const totalAmount = Object.values(payAmounts).reduce((sum, amount) => sum + amount, 0);

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      // Prepare cart items with payment amounts
      const cartItemsWithAmounts = cartItems.map(plugin => ({
        plugin,
        payAmount: payAmounts[plugin.id] || 0
      }));

      // Call the API to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: cartItemsWithAmounts,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.isFree) {
        // Handle free download
        alert('Thank you! Your plugins are ready to download.');
        handleCloseModal();
      } else if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setPayAmounts({});
    setEmail('');
    setOptInEmail(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} title="Shopping Cart" width="w-[600px]">
      <div className="space-y-4">
        {cartItems.length === 0 ? (
          <p className="text-center py-8 text-gray-600">Your cart is empty</p>
        ) : (
          <>
            <div
              className="space-y-3 max-h-[300px] overflow-y-auto"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              } as React.CSSProperties & { msOverflowStyle?: string; WebkitOverflowScrolling?: string }}
            >
              {cartItems.map((plugin) => (
                <div
                  key={plugin.id}
                  className="bg-white border border-black p-2 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-sm mb-1">{plugin.name}</h4>
                    <div className="flex items-center gap-2">
                      <label className="text-xs">Pay what you want: $</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={payAmounts[plugin.id] || 0}
                        onChange={(e) => handlePayAmountChange(plugin.id, parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-black focus:outline-none"
                      />
                    </div>
                  </div>
                  <RetroButton onClick={() => onRemoveFromCart(plugin.id)} className="text-xs">
                    Remove
                  </RetroButton>
                </div>
              ))}
            </div>

            <div className="border-t border-black pt-3">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-sm">Total:</span>
                <span className="font-bold text-base">${totalAmount.toFixed(2)}</span>
              </div>

              <div className="mb-3">
                <label className="block text-xs mb-1">Email Address:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-2 py-1 border border-black focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>

              <div className="mb-3">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={optInEmail}
                    onChange={(e) => setOptInEmail(e.target.checked)}
                    required
                    className="mt-1"
                  />
                  <span className="text-xs">
                    I want to receive emails about future plugins and projects
                  </span>
                </label>
              </div>

              <RetroButton
                onClick={handleCheckout}
                disabled={!email || !optInEmail || isLoading}
                className="w-full"
              >
                {isLoading ? 'Processing...' : (totalAmount > 0 ? 'Proceed to Payment' : 'Download for Free')}
              </RetroButton>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
