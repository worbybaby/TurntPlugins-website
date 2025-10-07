'use client';

import { ReactNode, useEffect } from 'react';
import RetroWindow from './RetroWindow';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
  height?: string;
}

export default function Modal({ isOpen, onClose, title, children, width, height }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Play retro sound effect
      const audio = new Audio('/sounds/windows-ding.mp3');
      audio.play().catch(() => {
        // Ignore if audio fails to play
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <RetroWindow title={title} onClose={onClose} width={width} height={height}>
          {children}
        </RetroWindow>
      </div>
    </div>
  );
}
