'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import RetroButton from '../components/RetroButton';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking session
    if (sessionId) {
      setTimeout(() => setLoading(false), 1000);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[#5DADE2] flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black p-8 max-w-2xl w-full">
        {/* Title Bar */}
        <div className="bg-[#000080] px-4 py-3 mb-6 border-b-4 border-black -m-8 mb-8">
          <span className="text-white font-bold text-lg">Purchase Complete</span>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-lg">Processing your order...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-[#FFE66D] border-4 border-black p-6">
              <h1 className="text-2xl font-bold mb-4">Thank You for Your Purchase!</h1>
              <p className="text-base leading-loose mb-4">
                Your payment has been processed successfully.
              </p>
              <p className="text-base leading-loose">
                You will receive an email shortly with download links for your plugins and further instructions.
              </p>
            </div>

            <div className="bg-white border-2 border-black p-4">
              <h2 className="text-lg font-bold mb-2">What&apos;s Next?</h2>
              <ul className="text-sm space-y-2 leading-loose">
                <li>• Check your email for download links</li>
                <li>• Follow the installation instructions provided</li>
                <li>• Enjoy creating with your new plugins!</li>
              </ul>
            </div>

            {sessionId && (
              <div className="text-xs text-gray-600 border-t border-black pt-4 break-all">
                Order ID: {sessionId}
              </div>
            )}

            <div className="flex justify-center pt-4">
              <Link href="/">
                <RetroButton>Return to Home</RetroButton>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
