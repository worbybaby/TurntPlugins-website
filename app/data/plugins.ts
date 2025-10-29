import { Plugin } from '../types';

export const plugins: Plugin[] = [
  {
    id: '2',
    name: 'Pretty Pretty Princess Sparkle',
    description: 'Make it sparkle, babies! A fine-tuned algorithm to brighten any track or master without harshness. It\'s also level-matched—so, you know, use your ears.',
    image: '/plugins/PrettyPrettyPrincessSparkle.png',
    price: 0
  },
  {
    id: '4',
    name: 'Tape Bloom',
    description: 'I made this to emulate the non-linear stereo bloom and cross talk found in analog tape machines. I\'m particularly fond of it on the drum bus, reverbs, and sometimes my instrument aux.',
    image: '/plugins/TapeBloom.png',
    price: 19,
    minimumPrice: 3
  },
  {
    id: '3',
    name: 'Space Bass Butt',
    description: 'A bass harmonic enhancer that creates the perception of extended bass response. Good for enhancing bass on small speakers or adding warmth to bass-light recordings. Pretty chunky.',
    image: '/plugins/SpaceBassButt.png',
    price: 15,
    minimumPrice: 3
  },
  {
    id: '1',
    name: 'Cassette Vibe',
    description: 'This is a simple color plugin that emulates retro cassette tapes. A lot is going on under the hood but just stick it on stuff or automate it as a cool filter effect before a drop or something.',
    image: '/plugins/CassetteTape.png',
    price: 15,
    minimumPrice: 3
  },
  {
    id: '5',
    name: 'Tapeworm',
    description: 'Bipolar tape-bias knob with authentic tape saturation. Add positive tape bias to apply a compression/smoothing effect to vocals and other harsh sources. Works well in tandem with Pretty Pretty Princess Sparkle.',
    image: '/plugins/Tapeworm.png',
    price: 19,
    minimumPrice: 3
  },
  {
    id: 'bundle',
    name: 'Complete Bundle',
    description: 'Get all five plugins for less $$ (you\'ll save 19 big ones). Includes Pretty Pretty Princess Sparkle, Tape Bloom, Space Bass Butt, Cassette Vibe, and Tapeworm.',
    image: '/plugins/TapeBloom.png', // Using TapeBloom as placeholder - you may want to create a bundle image
    price: 49,
    minimumPrice: 10
  }
];
