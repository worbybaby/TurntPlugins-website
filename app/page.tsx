'use client';

import { useState } from 'react';
import { plugins } from './data/plugins';
import { Plugin } from './types';
import PluginCard from './components/PluginCard';
import AboutModal from './components/AboutModal';
import CartModal from './components/CartModal';
import RetroButton from './components/RetroButton';

export default function Home() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Plugin[]>([]);

  const handleAddToCart = (plugin: Plugin) => {
    if (!cartItems.find(item => item.id === plugin.id)) {
      setCartItems([...cartItems, plugin]);
    }
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (pluginId: string) => {
    setCartItems(cartItems.filter(item => item.id !== pluginId));
  };

  return (
    <div className="min-h-screen bg-[#5DADE2]">
      {/* Header Bar */}
      <header className="bg-white border-b-4 border-black px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold">TURNT PLUGINS</h1>
          <div className="flex gap-6">
            <RetroButton onClick={() => setIsAboutOpen(true)}>
              About
            </RetroButton>
            <RetroButton onClick={() => setIsCartOpen(true)}>
              Cart {cartItems.length > 0 && `(${cartItems.length})`}
            </RetroButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8 bg-[#FFE66D] border-4 border-black p-8">
          <h2 className="text-3xl font-bold mb-3">Welcome to Turnt Plugins</h2>
          <p className="text-lg leading-loose">
            Explore our collection of creative audio plugins. All available on a pay-what-you-want basis!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      />
    </div>
  );
}
