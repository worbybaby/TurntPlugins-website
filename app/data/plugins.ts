import { Plugin } from '../types';

export const plugins: Plugin[] = [
  {
    id: '4',
    name: 'Tape Bloom',
    description: 'Vintage tape machine bloom that brings your drums to life. Emulates warm, harmonic characteristics of classic tape machines while creating the bloom and stereo spatial effect of vintage tape machines.',
    image: '/plugins/TapeBloom.png',
    price: 19,
    minimumPrice: 3
  },
  {
    id: '2',
    name: 'Pretty Pretty Princess Sparkle',
    description: 'Brighten any track or master without adding harshness. "Oh, it\'s the make anything better knob"',
    image: '/plugins/PrettyPrettyPrincessSparkle.png',
    price: 0
  },
  {
    id: '3',
    name: 'Space Bass Butt',
    description: 'Bass harmonic enhancer that creates the perception of extended bass response. Perfect for enhancing bass on small speakers or adding warmth to bass-light recordings.',
    image: '/plugins/SpaceBassButt.png',
    price: 15,
    minimumPrice: 3
  },
  {
    id: '1',
    name: 'Cassette Vibe',
    description: 'Authentic cassette tape saturation and warmth. Controls tape saturation, wow and flutter, frequency response characteristics, and high-frequency rolloff with a single intensity knob.',
    image: '/plugins/CassetteTape.png',
    price: 15,
    minimumPrice: 3
  },
  {
    id: '5',
    name: 'Tapeworm',
    description: 'Bipolar Tape bias knob with authentic tape saturation. Add positive tape bias to apply a compression/smoothing effect to vocals and other harsh sources. Works well in tandem with Pretty Pretty Princess Sparkle.',
    image: '/plugins/Tapeworm.png',
    price: 19,
    minimumPrice: 3
  },
  {
    id: 'bundle',
    name: 'Complete Bundle',
    description: 'Get all 5 plugins together! Includes Tape Bloom, Pretty Pretty Princess Sparkle (free!), Space Bass Butt, Cassette Vibe, and Tapeworm. Save $27 vs. individual suggested prices.',
    image: '/plugins/TapeBloom.png', // Using TapeBloom as placeholder - you may want to create a bundle image
    price: 49,
    minimumPrice: 10
  }
];
