'use client';

import Link from 'next/link';
import RetroButton from '../components/RetroButton';

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-[#5DADE2]">
      {/* Header Bar */}
      <header className="bg-white border-b-4 border-black px-3 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold cursor-pointer hover:text-gray-700">
              TURNT PLUG-INS
            </h1>
          </Link>
          <div className="flex gap-2 sm:gap-4 md:gap-6">
            <Link href="/">
              <RetroButton className="!px-3 sm:!px-6 md:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base md:!text-lg">
                Home
              </RetroButton>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="mb-6 sm:mb-8 bg-[#FFE66D] border-4 border-black p-4 sm:p-6 md:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Videos</h2>

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Video 1 - Bly Wallentine */}
            <div className="bg-white border-4 border-black p-4 sm:p-6">
              <div className="relative w-full mb-4" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/EDyaL8LBdf4?start=6"
                  title="Bly Wallentine features Turnt Plugins"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-base sm:text-lg leading-relaxed">
                Multi-instrumentalist, producer, artist, and mixing/mastering engineer Bly Wallentine features Turnt Plugins on "The Sweet Spot".
              </p>
            </div>

            {/* Video 2 */}
            <div className="bg-white border-4 border-black p-4 sm:p-6">
              <div className="relative w-full mb-4" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/iEneZtYfqo8"
                  title="Robert Willes reviews Tapeworm and Pretty Pretty Princess Sparkle"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-base sm:text-lg leading-relaxed">
                Robert Willes creator of Turnt Plugins reviews how he uses Tapeworm and Pretty Pretty Princess Sparkle
              </p>
            </div>

            {/* Video 3 */}
            <div className="bg-white border-4 border-black p-4 sm:p-6">
              <div className="relative w-full mb-4" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/pkPvLBkCqag"
                  title="Robert Willes reviews Tape Bloom"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-base sm:text-lg leading-relaxed">
                Robert Willes creator of Turnt Plugins reviews how he uses Tape Bloom and discusses the stereo imaging effects of vintage tape machines.
              </p>
            </div>

            {/* Video 4 */}
            <div className="bg-white border-4 border-black p-4 sm:p-6">
              <div className="relative w-full mb-4" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/1z7nhnLBzMA"
                  title="Robert Willes reviews Space Bass Butt"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-base sm:text-lg leading-relaxed">
                Robert Willes creator of Turnt Plugins reviews how he uses Space Bass Butt
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-black mt-16 px-6 py-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-700">
          © 2025 Turnt Plugins. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
