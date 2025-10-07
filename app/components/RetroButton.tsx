'use client';

interface RetroButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function RetroButton({ children, onClick, disabled, className = '', type = 'button' }: RetroButtonProps) {
  return (
    <button
      type={type}
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
