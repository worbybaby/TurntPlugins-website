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
    <div className={`${width} ${height} max-w-full max-h-[85vh] bg-white border-4 border-black flex flex-col overflow-hidden`}>
      {/* Title Bar */}
      <div className="bg-[#000080] px-4 py-3 flex items-center justify-between border-b-4 border-black flex-shrink-0 overflow-hidden">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-white font-bold text-lg truncate">{title}</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-9 h-9 bg-white border-3 border-black flex items-center justify-center hover:bg-gray-200 flex-shrink-0"
          >
            <span className="text-lg font-bold leading-none">×</span>
          </button>
        )}
      </div>

      {/* Window Content */}
      <div className="p-4 sm:p-6 modal-content overflow-y-auto overflow-x-hidden flex-1">
        {children}
      </div>
    </div>
  );
}
