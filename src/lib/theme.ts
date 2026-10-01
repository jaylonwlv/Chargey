import { TextStyle } from 'react-native';

export const colors = {
  bg: '#0F0D17',
  card: '#211E2E',
  slime: '#C7FF00',
  bubblegum: '#FF3D9A',
  grape: '#8C5CFF',
  sky: '#4DD9FF',
  white: '#FFFFFF',
  black: '#000000',
  dim: 'rgba(255,255,255,0.65)',
  faint: 'rgba(255,255,255,0.45)',
};

/** Rounded system font (SF Rounded on iOS), heavy by default. */
export function chunky(size: number, weight: TextStyle['fontWeight'] = '900'): TextStyle {
  return { fontFamily: 'ui-rounded', fontSize: size, fontWeight: weight, color: colors.white };
}

export const quips = [
  "your phone's biggest fan 📣",
  'plug in. get hyped. repeat.',
  'no thoughts, just charging',
  'certified outlet enjoyer 🔌',
  "battery anxiety? we don't know her",
  "the charger is ur phone's roman empire",
];
