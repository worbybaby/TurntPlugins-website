'use client';

import { Plugin } from '../types';
import RetroButton from './RetroButton';
import Image from 'next/image';
import { useState } from 'react';

interface PluginCardProps {
  plugin: Plugin;
  onAddToCart: (plugin: Plugin) => void;
}

export default function PluginCard({ plugin, onAddToCart }: PluginCardProps) {
  const images = Array.isArray(plugin.image) ? plugin.image : [plugin.image];
  const hasCarousel = images.length > 1;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [showTrialModal, setShowTrialModal] = useState(false);

  // Minimum swipe distance (in px) to trigger navigation
  const minSwipeDistance = 50;

  const handleTrialDownload = (platform: 'mac' | 'windows') => {
    const link = document.createElement('a');
    // Get the appropriate download URL based on platform
    // trialDownloadUrl contains the Mac version, we derive Windows from it
    const macUrl = plugin.trialDownloadUrl!;
    const windowsUrl = macUrl.replace('VocalFelt_v1.0.4.pkg', 'VocalFelt-v1.0.4-Windows-x64.exe');

    link.href = platform === 'mac' ? macUrl : windowsUrl;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowTrialModal(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0); // Reset
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left = next image
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    } else if (isRightSwipe) {
      // Swipe right = previous image
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
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
      <div
        className="aspect-square bg-black border-[5px] border-black relative overflow-hidden mb-4 touch-pan-y"
        onTouchStart={hasCarousel ? handleTouchStart : undefined}
        onTouchMove={hasCarousel ? handleTouchMove : undefined}
        onTouchEnd={hasCarousel ? handleTouchEnd : undefined}
      >
        <Image
          src={images[currentImageIndex]}
          alt={plugin.name}
          fill
          unoptimized
          className={imageClass}
        />

        {/* Image indicators */}
        {hasCarousel && (
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
      {plugin.comingSoon ? (
        <p className="text-sm text-gray-600 mb-3">Coming Soon</p>
      ) : (
        plugin.price === 0 ? (
          <p className="text-lg font-bold text-green-700 mb-3">FREE</p>
        ) : (
          <p className="text-base mb-3">
            <span className="text-sm text-gray-600">Suggested Price: </span>
            <span className="font-bold">${plugin.price}</span>
          </p>
        )
      )}
      <p className="text-base mb-5 leading-loose">{plugin.description}</p>
      {plugin.videos && plugin.videos.length > 0 ? (
        <div className="mb-4 space-y-2">
          {plugin.videos.map((video, index) => (
            <p key={index}>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline font-bold"
              >
                {video.label}
              </a>
            </p>
          ))}
        </div>
      ) : plugin.videoUrl ? (
        <p className="mb-4">
          <a
            href={plugin.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-bold"
          >
            Video
          </a>
        </p>
      ) : null}
      {plugin.comingSoon ? (
        <button
          disabled
          className="w-full bg-gray-400 text-gray-600 border-4 border-gray-500 px-6 py-3 text-lg font-bold cursor-not-allowed opacity-60"
        >
          Coming Soon
        </button>
      ) : (
        <>
          {plugin.trialDownloadUrl && (
            <button
              onClick={() => setShowTrialModal(true)}
              className="w-full bg-[#90EE90] border-4 border-black px-6 py-3 text-lg font-bold hover:bg-[#7CDB7C] active:translate-y-1 mb-3"
            >
              Download Free Trial
            </button>
          )}
          <RetroButton
            onClick={() => onAddToCart(plugin)}
            className="w-full"
          >
            Add to Cart
          </RetroButton>
        </>
      )}

      {/* Trial Download Modal */}
      {showTrialModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowTrialModal(false)}
        >
          <div
            className="bg-white border-4 border-black p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              Download {plugin.name} Trial
            </h2>
            <p className="text-sm mb-6 text-center text-gray-700">
              Choose your platform to download the 7-day trial version
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleTrialDownload('mac')}
                className="w-full bg-[#000080] text-white border-4 border-black px-6 py-3 text-lg font-bold hover:bg-[#0000CD] active:translate-y-1"
              >
                Download for macOS
              </button>

              <button
                onClick={() => handleTrialDownload('windows')}
                className="w-full bg-[#000080] text-white border-4 border-black px-6 py-3 text-lg font-bold hover:bg-[#0000CD] active:translate-y-1"
              >
                Download for Windows
              </button>

              <button
                onClick={() => {
                  setShowTrialModal(false);
                  window.location.href = '/';
                }}
                className="w-full bg-gray-400 text-black border-4 border-black px-6 py-3 text-lg font-bold hover:bg-gray-500 active:translate-y-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
