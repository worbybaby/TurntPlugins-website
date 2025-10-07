'use client';

import Modal from './Modal';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="About - Turnt Plugins" width="w-[500px]">
      <div
        className="space-y-4 text-sm max-h-[300px] overflow-y-auto modal-scrollbar"
      >
        <p>
          <strong>Welcome to Turnt Plugins!</strong>
        </p>
        <p>
          I'm an audio plugin developer passionate about creating unique, creative tools for music producers and sound designers.
          Each plugin is crafted with care to bring you innovative sounds and vintage-inspired character.
        </p>
        <p>
          All plugins are available on a pay-what-you-want basis because I believe great tools should be accessible to everyone.
          Your support helps me continue developing new and exciting audio tools!
        </p>
        <p className="text-xs text-gray-600">
          © 2024 Turnt Plugins. All rights reserved.
        </p>
      </div>
    </Modal>
  );
}
