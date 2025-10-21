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
  onClearCart: () => void;
  onAddToCart: (plugin: Plugin) => void;
  onSwitchToBundle?: (bundle: Plugin) => void;
}

export default function CartModal({ isOpen, onClose, cartItems, onRemoveFromCart, onClearCart, onAddToCart, onSwitchToBundle }: CartModalProps) {
  const [payAmounts, setPayAmounts] = useState<Record<string, number>>({});
  const [email, setEmail] = useState('');
  const [optInEmail, setOptInEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handlePayAmountChange = (pluginId: string, amount: number) => {
    setPayAmounts({ ...payAmounts, [pluginId]: amount });
  };

  // Check if user has all 4 paid plugins (without the bundle)
  const hasAllPaidPlugins = () => {
    const paidPluginIds = ['1', '3', '4', '5']; // Cassette Vibe, Space Bass Butt, Tape Bloom, Tapeworm
    const cartPluginIds = cartItems.map(item => item.id);
    const hasBundle = cartPluginIds.includes('bundle');

    if (hasBundle) return false; // Already has bundle

    return paidPluginIds.every(id => cartPluginIds.includes(id));
  };

  const switchToBundle = () => {
    if (onSwitchToBundle) {
      // Create bundle plugin
      const bundle: Plugin = {
        id: 'bundle',
        name: 'Complete Bundle',
        description: 'Get all 5 plugins together! Includes Tape Bloom, Pretty Pretty Princess Sparkle (free!), Space Bass Butt, Cassette Vibe, and Tapeworm. Save $27 vs. individual suggested prices.',
        image: '/plugins/TapeBloom.png',
        price: 49,
        minimumPrice: 10
      };
      onSwitchToBundle(bundle);
    }
  };

  // Get pay amount with default of plugin's suggested price
  const getPayAmount = (plugin: Plugin) => {
    return payAmounts[plugin.id] !== undefined ? payAmounts[plugin.id] : plugin.price;
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + getPayAmount(item), 0);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCheckout = async () => {
    // Validate email format
    if (!email || !validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Validate minimum prices
    const invalidItems = cartItems.filter(plugin => {
      const amount = getPayAmount(plugin);
      const minPrice = plugin.minimumPrice || 0;
      return amount < minPrice;
    });

    if (invalidItems.length > 0) {
      alert(`Please ensure all prices meet the minimum amount. Check: ${invalidItems.map(p => p.name).join(', ')}`);
      return;
    }

    setIsLoading(true);
    setEmailError('');

    try {
      // Prepare cart items with payment amounts
      const cartItemsWithAmounts = cartItems.map(plugin => ({
        plugin,
        payAmount: getPayAmount(plugin)
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
          marketingOptIn: optInEmail,
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
            marketingOptIn: optInEmail,
          }),
        });

        const freeData = await freeResponse.json();

        if (!freeResponse.ok) {
          throw new Error(freeData.error || 'Failed to process free download');
        }

        alert(freeData.message || 'Thank you! Check your email for download links.');
        onClearCart();
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
    setEmailError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} title="Shopping Cart" width="w-[95vw] sm:w-[600px] max-w-[600px]">
      <div className="space-y-3 sm:space-y-4">
        {cartItems.length === 0 ? (
          <p className="text-center py-8 text-gray-600">Your cart is empty</p>
        ) : (
          <>
            {/* Bundle Suggestion Banner */}
            {hasAllPaidPlugins() && (
              <div className="bg-green-100 border-2 border-green-600 p-3 mb-3">
                <div className="flex items-start gap-2">
                  <span className="text-xl">💡</span>
                  <div className="flex-1">
                    <p className="font-bold text-sm mb-1">You have all our plugins!</p>
                    <p className="text-xs mb-2">Get the Complete Bundle instead and save $19+ (suggested price)</p>
                    <RetroButton onClick={switchToBundle} className="!text-xs !px-3 !py-1.5">
                      Switch to Bundle
                    </RetroButton>
                  </div>
                </div>
              </div>
            )}

            <div
              className="space-y-2 sm:space-y-3 max-h-[40vh] sm:max-h-[300px] overflow-y-auto modal-scrollbar"
            >
              {cartItems.map((plugin) => {
                const currentAmount = getPayAmount(plugin);
                const minPrice = plugin.minimumPrice || 0;
                const isInvalid = currentAmount < minPrice;

                return (
                  <div
                    key={plugin.id}
                    className="bg-white border border-black p-2 sm:p-3 flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between sm:items-start"
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-xs sm:text-sm mb-1">{plugin.name}</h4>
                      {plugin.price === 0 ? (
                        <p className="text-xs font-bold text-green-700">FREE</p>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-600">
                            Suggested: ${plugin.price} {plugin.minimumPrice && `(starting at $${plugin.minimumPrice})`}
                          </p>
                          <div className="flex items-center gap-2">
                            <label className="text-xs whitespace-nowrap">Your Price: $</label>
                            <input
                              type="number"
                              min={minPrice}
                              step="1"
                              value={currentAmount}
                              onChange={(e) => handlePayAmountChange(plugin.id, parseFloat(e.target.value) || 0)}
                              className={`w-16 sm:w-20 px-2 py-1 border ${isInvalid ? 'border-red-600' : 'border-black'} focus:outline-none text-sm`}
                            />
                          </div>
                          {isInvalid && (
                            <p className="text-xs text-red-600 font-bold">Starting at: ${minPrice}</p>
                          )}
                        </div>
                      )}
                    </div>
                    <RetroButton onClick={() => onRemoveFromCart(plugin.id)} className="!text-xs !px-2 !py-1 sm:!px-3 sm:!py-2 w-full sm:w-auto">
                      Remove
                    </RetroButton>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-black pt-2 sm:pt-3">
              {/* Fair Pricing Message */}
              <div className="bg-[#FFE66D] border border-black p-3 mb-3 text-xs sm:text-sm">
                <p className="font-bold mb-2">Fair Pricing Model</p>
                <p className="mb-2">We believe great audio tools should be accessible to everyone. Choose what works for your budget:</p>
                <p className="font-bold">Suggested Price: $15-19</p>
                <p className="text-gray-700 mb-2">(supports ongoing development)</p>
                <p className="mt-2">Every contribution helps us keep creating tools you&apos;ll love.</p>
              </div>

              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="font-bold text-sm">Total:</span>
                <span className="font-bold text-base sm:text-lg">${totalAmount.toFixed(2)}</span>
              </div>

              <div className="mb-2 sm:mb-3">
                <label className="block text-xs mb-1">Email Address:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) {
                      setEmailError('');
                    }
                  }}
                  required
                  className="w-full px-2 py-1.5 sm:py-2 border border-black focus:outline-none text-sm"
                  placeholder="your@email.com"
                />
                {emailError && (
                  <p className="text-red-600 text-xs font-bold mt-1">{emailError}</p>
                )}
              </div>

              <div className="mb-3 sm:mb-4">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={optInEmail}
                    onChange={(e) => setOptInEmail(e.target.checked)}
                    className="mt-0.5 sm:mt-1 flex-shrink-0"
                  />
                  <span className="text-xs">
                    I want to receive emails about future plugins and projects (optional)
                  </span>
                </label>
              </div>

              <RetroButton
                onClick={handleCheckout}
                disabled={isLoading}
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
