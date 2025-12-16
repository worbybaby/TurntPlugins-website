'use client';

import Link from 'next/link';
import RetroButton from '../components/RetroButton';

export default function CanceledPage() {
  return (
    <div className="min-h-screen bg-[#5DADE2] flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black p-8 max-w-2xl w-full">
        {/* Title Bar */}
        <div className="bg-[#000080] px-4 py-3 mb-6 border-b-4 border-black -m-8 mb-8">
          <span className="text-white font-bold text-lg">Payment Canceled</span>
        </div>

        <div className="space-y-6">
          <div className="bg-[#E74C3C] border-4 border-black p-6">
            <h1 className="text-2xl font-bold mb-4 text-white">Order Canceled</h1>
            <p className="text-base leading-loose text-white">
              Your payment was canceled and no charges were made to your account.
            </p>
          </div>

          <div className="bg-white border-2 border-black p-4">
            <p className="text-base leading-loose mb-4">
              If you experienced any issues during checkout, please try again or reach out to us on Instagram @turntplugins for assistance.
            </p>
            <p className="text-sm text-gray-600">
              Your cart items are still saved and ready when you&apos;re ready to complete your purchase.
            </p>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Link href="/">
              <RetroButton>Return to Home</RetroButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
