import { Plugin } from '../types';

export const plugins: Plugin[] = [
  {
    id: '7',
    name: 'Vocal Felt',
    description: 'CLEEEAN vocal compression inspired by your favorite optical tube compressor. I wanted the depth and dimension of analog compressors dialed in on a simple UI for instant use on pop, hiphop, etc.',
    image: '/plugins/VocalFelt.png',
    price: 39,
    minimumPrice: 7,
    trialDownloadUrl: 'https://github.com/worbybaby/TurntPlugins-website/releases/download/installers-v1.0.0/VocalFelt_v1.0.4.pkg',
    comingSoon: false
  },
  {
    id: '6',
    name: 'Rubber.PRE',
    description: 'Circuit-accurate 4-track tape preamp emulation that delivers authentic grainy crunch and rubbery lofi 90s guitar tones for even the saddest of indie long boys. Engage the rubber button for more grit and level matching. AU/VST3 Mac & Windows',
    image: ['/plugins/RubberPRE-1.png', '/plugins/RubberPRE-2.png'],
    price: 35,
    minimumPrice: 15,
    videos: [
      { url: 'https://youtu.be/EDyaL8LBdf4?si=ovi0jgO9WsKG905s&t=239', label: 'On drums' },
      { url: 'https://www.instagram.com/p/DSDmsl1E7Wk/', label: 'On guitar, drums, and mix bus' }
    ]
  },
  {
    id: '2',
    name: 'Pretty Pretty Princess Sparkle',
    description: 'Make it sparkle, babies! A fine-tuned algorithm to brighten any track or master without harshness. It\'s also level-matched, so, you know, use your ears. AU/VST3 Mac & Windows',
    image: '/plugins/PrettyPrettyPrincessSparkle.png',
    price: 0
  },
  {
    id: '4',
    name: 'Tape Bloom',
    description: 'Taste the new Floral Experience. I\'m serious...lick it, taste it. I made this to emulate the non-linear stereo bloom and cross talk found in analog tape machines. I\'m particularly fond of it on the drum bus, reverbs, and sometimes my instrument aux. AU/VST3 Mac & Windows',
    image: '/plugins/TapeBloom.png',
    price: 19,
    minimumPrice: 3,
    videoUrl: 'https://youtu.be/pkPvLBkCqag',
    trialDownloadUrl: 'https://github.com/worbybaby/TurntPlugins-website/releases/download/installers-v1.0.0/TapeBloom_v2.0.2.pkg'
  },
  {
    id: '3',
    name: 'Space Bass Butt',
    description: 'A bass harmonic enhancer that creates the perception of extended bass response. Good for enhancing bass on small speakers or adding warmth to thin recordings. Pretty chunky. AU/VST3 Mac & Windows',
    image: '/plugins/SpaceBassButt.png',
    price: 15,
    minimumPrice: 3,
    videoUrl: 'https://youtu.be/1z7nhnLBzMA'
  },
  {
    id: '1',
    name: 'Cassette Vibe',
    description: 'This is a simple color plugin that emulates retro cassette tapes. A lot is going on under the hood but just stick it on things or automate it as an interesting filter effect before a drop or something. AU/VST3 Mac & Windows',
    image: '/plugins/CassetteTape.png',
    price: 15,
    minimumPrice: 3
  },
  {
    id: '5',
    name: 'Tapeworm',
    description: 'Bipolar tape-bias knob with authentic tape saturation. Add positive tape bias to apply a compression/smoothing effect to vocals and other harsh sources. Works well in tandem with Pretty Pretty Princess Sparkle. AU/VST3 Mac & Windows',
    image: '/plugins/Tapeworm.png',
    price: 19,
    minimumPrice: 3,
    videoUrl: 'https://youtu.be/iEneZtYfqo8'
  },
  {
    id: 'bundle',
    name: '5 Plugin Bundle',
    description: 'Get all 5 original plugins for less $$$ (you\'ll save 19 big ones). Includes Pretty Pretty Princess Sparkle, Tape Bloom, Space Bass Butt, Cassette Vibe, and Tapeworm. Does not include Rubber.PRE or Vocal Felt. AU/VST3 Mac & Windows',
    image: '/plugins/TapeBloom_old.png',
    price: 49,
    minimumPrice: 10
  }
];
