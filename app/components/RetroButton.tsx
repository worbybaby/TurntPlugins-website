'use client';

interface RetroButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function RetroButton({ children, onClick, disabled, className = '' }: RetroButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-8 py-3
        bg-[#c0c0c0]
        border-4
        border-black
        font-bold
        text-lg
        disabled:text-gray-500
        hover:bg-[#a0a0a0]
        active:bg-[#808080]
        ${className}
      `}
    >
      {children}
    </button>
  );
}
