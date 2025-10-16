'use client';

import { useState } from 'react';
import Modal from './Modal';
import { Plugin } from '../types';
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

  // Get pay amount with default of $19
  const getPayAmount = (pluginId: string) => {
    return payAmounts[pluginId] !== undefined ? payAmounts[pluginId] : 19;
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + getPayAmount(item.id), 0);

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      // Prepare cart items with payment amounts
      const cartItemsWithAmounts = cartItems.map(plugin => ({
        plugin,
        payAmount: getPayAmount(plugin.id)
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
        // Handle free download - call the free download API
        const freeResponse = await fetch('/api/free-download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cartItems: cartItemsWithAmounts,
            email,
          }),
        });

        const freeData = await freeResponse.json();

        if (!freeResponse.ok) {
          throw new Error(freeData.error || 'Failed to process free download');
        }

        alert(freeData.message || 'Thank you! Check your email for download links.');
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
    <Modal isOpen={isOpen} onClose={handleCloseModal} title="Shopping Cart" width="w-[95vw] sm:w-[600px] max-w-[600px]">
      <div className="space-y-3 sm:space-y-4">
        {cartItems.length === 0 ? (
          <p className="text-center py-8 text-gray-600">Your cart is empty</p>
        ) : (
          <>
            <div
              className="space-y-2 sm:space-y-3 max-h-[40vh] sm:max-h-[300px] overflow-y-auto modal-scrollbar"
            >
              {cartItems.map((plugin) => (
                <div
                  key={plugin.id}
                  className="bg-white border border-black p-2 sm:p-3 flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between sm:items-start"
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-xs sm:text-sm mb-1">{plugin.name}</h4>
                    <div className="flex items-center gap-2">
                      <label className="text-xs whitespace-nowrap">Pay: $</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={getPayAmount(plugin.id)}
                        onChange={(e) => handlePayAmountChange(plugin.id, parseFloat(e.target.value) || 0)}
                        className="w-16 sm:w-20 px-2 py-1 border border-black focus:outline-none text-sm"
                      />
                    </div>
                  </div>
                  <RetroButton onClick={() => onRemoveFromCart(plugin.id)} className="!text-xs !px-2 !py-1 sm:!px-3 sm:!py-2 w-full sm:w-auto">
                    Remove
                  </RetroButton>
                </div>
              ))}
            </div>

            <div className="border-t border-black pt-2 sm:pt-3">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="font-bold text-sm">Total:</span>
                <span className="font-bold text-base sm:text-lg">${totalAmount.toFixed(2)}</span>
              </div>

              <div className="mb-2 sm:mb-3">
                <label className="block text-xs mb-1">Email Address:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-2 py-1.5 sm:py-2 border border-black focus:outline-none text-sm"
                  placeholder="your@email.com"
                />
              </div>

              <div className="mb-3 sm:mb-4 bg-[#FFE66D] border-2 border-black p-3">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={optInEmail}
                    onChange={(e) => setOptInEmail(e.target.checked)}
                    required
                    className="mt-0.5 sm:mt-1 flex-shrink-0 w-4 h-4"
                  />
                  <span className="text-xs sm:text-sm font-bold">
                    I want to receive emails about future plugins and projects <span className="text-red-600">*</span>
                  </span>
                </label>
                {!optInEmail && (
                  <p className="text-[10px] sm:text-xs text-gray-700 mt-2 ml-6">
                    You must agree to receive emails to download plugins
                  </p>
                )}
              </div>

              <RetroButton
                onClick={handleCheckout}
                disabled={!email || !optInEmail || isLoading}
                className="w-full !px-4 !py-2.5 sm:!py-3 !text-sm sm:!text-base"
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
