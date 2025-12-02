'use client';

import Modal from './Modal';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="About - Turnt Plugins" width="w-[90vw] sm:w-[500px] max-w-[500px]">
      <div
        className="space-y-3 sm:space-y-4 text-sm max-h-[50vh] sm:max-h-[300px] overflow-y-auto modal-scrollbar"
      >
        <p>
          I made Turnt Plugins for a few reasons:
        </p>
        <p>
          <strong>1)</strong> Most professional plugins are prohibitively expensive for students, hobbyists, and people just starting out, and I wanted to give back and make the tools and techniques I use daily accessible to more people.
        </p>
        <p>
          <strong>2)</strong> I noticed that myself as well as other professional mixers grab massive plugins for a specific color or a single feature, and I thought, If I&apos;m adding the most CPU-hungry plugin just to add a little tape bias, why not make a simple plugin that does only what I want it to?
        </p>
        <p>
          I&apos;ve fine-tuned the effects in each of these plugins to exactly how I use them in my everyday work, and I hope you find them as useful as I do.
        </p>
      </div>
    </Modal>
  );
}
