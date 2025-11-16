'use client';

import { Plugin } from '../types';
import RetroButton from './RetroButton';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface PluginCardProps {
  plugin: Plugin;
  onAddToCart: (plugin: Plugin) => void;
}

export default function PluginCard({ plugin, onAddToCart }: PluginCardProps) {
  const images = Array.isArray(plugin.image) ? plugin.image : [plugin.image];
  const hasCarousel = images.length > 1;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-advance carousel every 3 seconds
  useEffect(() => {
    if (!hasCarousel) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [hasCarousel, images.length]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

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
      <div className="aspect-square bg-black border-[5px] border-black relative overflow-hidden mb-4 group">
        <Image
          src={images[currentImageIndex]}
          alt={plugin.name}
          fill
          unoptimized
          className={imageClass}
        />

        {/* Carousel navigation arrows */}
        {hasCarousel && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity border-2 border-white hover:bg-black/90"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity border-2 border-white hover:bg-black/90"
              aria-label="Next image"
            >
              →
            </button>

            {/* Image indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 border border-white transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-transparent'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Add "COMPLETE" stamp for bundle */}
        {plugin.id === 'bundle' && (
          <div
            className="absolute pointer-events-none"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-15deg)'
            }}
          >
            <div className="bg-red-600 border-4 border-red-800 px-6 py-3 shadow-2xl">
              <span
                className="text-white font-bold text-4xl sm:text-5xl tracking-widest whitespace-nowrap"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
              >
                COMPLETE
              </span>
            </div>
          </div>
        )}
      </div>
      <h3 className="font-bold text-2xl mb-2">{plugin.name}</h3>
      {plugin.price === 0 ? (
        <p className="text-lg font-bold text-green-700 mb-3">FREE</p>
      ) : (
        <p className="text-base mb-3">
          <span className="text-sm text-gray-600">Suggested Price: </span>
          <span className="font-bold">${plugin.price}</span>
        </p>
      )}
      <p className="text-base mb-5 leading-loose">{plugin.description}</p>
      <RetroButton onClick={() => onAddToCart(plugin)} className="w-full">
        Add to Cart
      </RetroButton>
    </div>
  );
}
