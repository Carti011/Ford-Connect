export const colors = {
  // Surface
  bg:        '#0A0F1A',
  surface:   '#131A26',
  surfaceHi: '#1A2230',
  surfaceLo: '#0F1521',

  // Border
  border:       'rgba(255, 255, 255, 0.06)',
  borderStrong: 'rgba(255, 255, 255, 0.12)',

  // Text
  text:      '#F5F7FA',
  textDim:   '#9BA5B5',
  textMuted: '#5C6678',

  // Brand
  accent:        '#1F6FEB',
  accentHover:   '#1A5FCC',
  accentPressed: '#1551AE',
  accentDeep:    '#0D4FBE',
  accentSoft:    'rgba(31, 111, 235, 0.18)',

  // Semânticas — oklch convertido para sRGB
  ok:         '#2CB875',
  okSoft:     'rgba(44, 184, 117, 0.18)',
  warn:       '#E5A20A',
  warnSoft:   'rgba(229, 162, 10, 0.18)',
  danger:     '#E5372A',
  dangerSoft: 'rgba(229, 55, 42, 0.18)',
  ev:         '#2ED47A',
} as const;

export type Colors = typeof colors;
