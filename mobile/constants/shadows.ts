import { Platform } from 'react-native';

// React Native não tem a propriedade shadow shorthand do CSS.
// iOS usa shadowColor/shadowOffset/shadowOpacity/shadowRadius.
// Android usa elevation.
const s = (color: string, y: number, blur: number, opacity: number, elevation: number) =>
  Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: y },
      shadowOpacity: opacity,
      shadowRadius: blur / 2,
    },
    android: { elevation },
  });

export const shadows = {
  sm:  s('#000000', 1,  2,  0.30,  2),
  md:  s('#000000', 4,  12, 0.40,  6),
  lg:  s('#000000', 8,  24, 0.50, 12),
  glow: s('#1F6FEB', 0,  8,  0.10,  4),
  cta:  s('#1F6FEB', 8,  24, 0.40, 16),
} as const;
