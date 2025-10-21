'use client';

import { Plugin } from '../types';
import RetroButton from './RetroButton';
import Image from 'next/image';

interface PluginCardProps {
  plugin: Plugin;
  onAddToCart: (plugin: Plugin) => void;
}

export default function PluginCard({ plugin, onAddToCart }: PluginCardProps) {
  // Custom adjustments per plugin
  let imageClass = 'object-cover brightness-125';
  if (plugin.id === '3') {
    // Space Bass Butt - brighter and more vibrant
    imageClass = 'object-cover brightness-125 saturate-125';
  } else if (['2', '4', '5'].includes(plugin.id)) {
    // Princess, Tape Bloom, Tapeworm - slightly darker but vibrant
    imageClass = 'object-cover brightness-110 saturate-125';
  }

  return (
    <div className="p-4">
      <div className="aspect-square bg-black border-[5px] border-black relative overflow-hidden mb-4">
        <Image
          src={plugin.image}
          alt={plugin.name}
          fill
          unoptimized
          className={imageClass}
        />
      </div>
      <h3 className="font-bold text-2xl mb-2">{plugin.name}</h3>
      {plugin.price === 0 ? (
        <p className="text-lg font-bold text-green-700 mb-3">FREE</p>
      ) : (
        <p className="text-base mb-3">
          <span className="font-bold">${plugin.price}</span>
          {plugin.minimumPrice && (
            <span className="text-sm text-gray-600"> (starting at ${plugin.minimumPrice})</span>
          )}
        </p>
      )}
      <p className="text-base mb-5 leading-loose">{plugin.description}</p>
      <RetroButton onClick={() => onAddToCart(plugin)} className="w-full">
        Add to Cart
      </RetroButton>
    </div>
  );
}
