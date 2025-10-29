'use client';

import { useState } from 'react';
import { plugins } from './data/plugins';
import { Plugin } from './types';
import PluginCard from './components/PluginCard';
import AboutModal from './components/AboutModal';
import CartModal from './components/CartModal';
import Modal from './components/Modal';
import RetroButton from './components/RetroButton';

export default function Home() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddedToCartOpen, setIsAddedToCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Plugin[]>([]);

  const handleAddToCart = (plugin: Plugin) => {
    if (!cartItems.find(item => item.id === plugin.id)) {
      setCartItems([...cartItems, plugin]);
    }
    setIsAddedToCartOpen(true);
  };

  const handleRemoveFromCart = (pluginId: string) => {
    setCartItems(cartItems.filter(item => item.id !== pluginId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleSwitchToBundle = (bundle: Plugin) => {
    // Remove all paid plugins and add bundle in one state update
    const paidPluginIds = ['1', '3', '4', '5'];
    const newCart = cartItems.filter(item => !paidPluginIds.includes(item.id));

    // Add bundle if not already in cart
    if (!newCart.find(item => item.id === 'bundle')) {
      newCart.push(bundle);
    }

    setCartItems(newCart);
  };

  return (
    <div className="min-h-screen bg-[#5DADE2]">
      {/* Header Bar */}
      <header className="bg-white border-b-4 border-black px-3 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">TURNT PLUG-INS</h1>
          <div className="flex gap-2 sm:gap-4 md:gap-6">
            <RetroButton onClick={() => setIsAboutOpen(true)} className="!px-3 sm:!px-6 md:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base md:!text-lg">
              About
            </RetroButton>
            <RetroButton onClick={() => setIsCartOpen(true)} className="!px-3 sm:!px-6 md:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base md:!text-lg">
              <span className="hidden sm:inline">Cart </span>
              <span className="sm:hidden">🛒 </span>
              {cartItems.length > 0 && `(${cartItems.length})`}
            </RetroButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="mb-6 sm:mb-8 bg-[#FFE66D] border-4 border-black p-4 sm:p-6 md:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">Welcome to Turnt Plugins</h2>
          <p className="text-base sm:text-lg leading-relaxed sm:leading-loose">
            A collection of boutique plugins that cut the fat and do one thing really well.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {plugins.map((plugin) => (
            <PluginCard
              key={plugin.id}
              plugin={plugin}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-black mt-16 px-6 py-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-700">
          © 2024 Turnt Plugins. All rights reserved.
        </div>
      </footer>

      {/* Modals */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onAddToCart={handleAddToCart}
        onSwitchToBundle={handleSwitchToBundle}
      />
      <Modal
        isOpen={isAddedToCartOpen}
        onClose={() => setIsAddedToCartOpen(false)}
        title="Added to Cart"
        width="w-[90vw] sm:w-[500px] max-w-[500px]"
      >
        <p className="text-base sm:text-lg leading-relaxed sm:leading-loose mb-4 sm:mb-6">Item has been added to your cart!</p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <RetroButton
            onClick={() => setIsAddedToCartOpen(false)}
            className="flex-1 !px-3 sm:!px-4 !py-2 sm:!py-3 !text-sm sm:!text-base"
          >
            Continue Shopping
          </RetroButton>
          <RetroButton
            onClick={() => {
              setIsAddedToCartOpen(false);
              setIsCartOpen(true);
            }}
            className="flex-1 !px-3 sm:!px-4 !py-2 sm:!py-3 !text-sm sm:!text-base"
          >
            View Cart
          </RetroButton>
        </div>
      </Modal>
    </div>
  );
}
