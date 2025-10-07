'use client';

import { ReactNode } from 'react';

interface RetroWindowProps {
  title: string;
  children: ReactNode;
  onClose?: () => void;
  width?: string;
  height?: string;
}

export default function RetroWindow({
  title,
  children,
  onClose,
  width = 'w-96',
  height = 'h-auto'
}: RetroWindowProps) {
  return (
    <div className={`${width} ${height} bg-white border-4 border-black`}>
      {/* Title Bar */}
      <div className="bg-[#000080] px-4 py-3 flex items-center justify-between border-b-4 border-black">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-lg">{title}</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-9 h-9 bg-white border-3 border-black flex items-center justify-center hover:bg-gray-200"
          >
            <span className="text-lg font-bold leading-none">×</span>
          </button>
        )}
      </div>

      {/* Window Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
