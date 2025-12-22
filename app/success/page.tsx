'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import RetroButton from '../components/RetroButton';
import { trackMetaEvent } from '../components/MetaPixel';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const isDonation = searchParams.get('donation') === 'true';
  const [loading, setLoading] = useState(true);
  const [orderValue, setOrderValue] = useState<number | null>(null);

  useEffect(() => {
    // Fetch session details and track conversion
    const fetchSessionAndTrack = async () => {
      if (sessionId) {
        try {
          // Fetch the Stripe session to get the order amount
          const response = await fetch(`/api/get-session?session_id=${sessionId}`);
          if (response.ok) {
            const data = await response.json();
            const value = data.amount_total ? data.amount_total / 100 : 0; // Convert cents to dollars
            setOrderValue(value);

            // Track Meta Pixel Purchase event with value (only for purchases, not donations)
            if (!isDonation) {
              trackMetaEvent('Purchase', {
                value: value,
                currency: 'USD',
              });
            }
          }
        } catch (error) {
          console.error('Error fetching session:', error);
        }

        setTimeout(() => setLoading(false), 1000);
      } else {
        setLoading(false);
      }
    };

    fetchSessionAndTrack();
  }, [sessionId, isDonation]);

  return (
    <div className="min-h-screen bg-[#5DADE2] flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black p-8 max-w-2xl w-full">
        {/* Title Bar */}
        <div className="bg-[#000080] px-4 py-3 mb-6 border-b-4 border-black -m-8 mb-8">
          <span className="text-white font-bold text-lg">
            {isDonation ? 'Donation Complete' : 'Purchase Complete'}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-lg">{isDonation ? 'Processing your donation...' : 'Processing your order...'}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-[#FFE66D] border-4 border-black p-6">
              <h1 className="text-xl sm:text-2xl font-bold mb-4 break-words">
                {isDonation ? 'Thank You for Your Support!' : 'Thank You for Your Purchase!'}
              </h1>
              <p className="text-sm sm:text-base leading-loose mb-4 break-words">
                Your payment has been processed successfully.
              </p>
              {isDonation ? (
                <p className="text-sm sm:text-base leading-loose break-words">
                  Your generosity helps keep the plugins maintained and new features coming. You&apos;ll receive a receipt via email shortly.
                </p>
              ) : (
                <p className="text-sm sm:text-base leading-loose break-words">
                  You will receive an email shortly with download links for your plugins and further instructions.
                </p>
              )}
            </div>

            {!isDonation && (
              <div className="bg-white border-2 border-black p-4">
                <h2 className="text-lg font-bold mb-2">What&apos;s Next?</h2>
                <ul className="text-sm space-y-2 leading-loose">
                  <li>• Check your email for download links</li>
                  <li>• Follow the installation instructions provided</li>
                  <li>• Enjoy creating with your new plugins!</li>
                </ul>
              </div>
            )}

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

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#5DADE2] flex items-center justify-center p-4">
        <div className="bg-white border-4 border-black p-8 max-w-2xl w-full">
          <div className="text-center py-8">
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
