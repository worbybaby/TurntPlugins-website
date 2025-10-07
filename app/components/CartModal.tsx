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
  const [step, setStep] = useState<'cart' | 'payment'>('cart');
  const [payAmounts, setPayAmounts] = useState<Record<string, number>>({});
  const [email, setEmail] = useState('');
  const [optInEmail, setOptInEmail] = useState(false);

  const handlePayAmountChange = (pluginId: string, amount: number) => {
    setPayAmounts({ ...payAmounts, [pluginId]: amount });
  };

  const totalAmount = Object.values(payAmounts).reduce((sum, amount) => sum + amount, 0);

  const handleCheckout = () => {
    if (totalAmount > 0) {
      setStep('payment');
    } else {
      // Handle free download
      alert('Thank you! Your plugins are ready to download.');
      onClose();
    }
  };

  const handleCloseModal = () => {
    setStep('cart');
    setPayAmounts({});
    setEmail('');
    setOptInEmail(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} title="Shopping Cart" width="w-[600px]">
      {step === 'cart' ? (
        <div className="space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-center py-8 text-gray-600">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
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
                  disabled={!email || !optInEmail}
                  className="w-full"
                >
                  {totalAmount > 0 ? 'Proceed to Payment' : 'Download for Free'}
                </RetroButton>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-white border border-black p-3">
            <h4 className="font-bold text-sm mb-2">Payment Information</h4>
            <p className="text-xs mb-3">Total: ${totalAmount.toFixed(2)}</p>
            <div className="space-y-2">
              <div>
                <label className="block text-xs mb-1">Card Number:</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-2 py-1 border border-black focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs mb-1">Expiry:</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-2 py-1 border border-black focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs mb-1">CVC:</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-2 py-1 border border-black focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <RetroButton onClick={() => setStep('cart')} className="flex-1">
              Back
            </RetroButton>
            <RetroButton
              onClick={() => alert('Stripe integration will be added next!')}
              className="flex-1"
            >
              Complete Purchase
            </RetroButton>
          </div>
          <p className="text-[10px] text-center text-gray-600">
            Payments secured by Stripe
          </p>
        </div>
      )}
    </Modal>
  );
}
