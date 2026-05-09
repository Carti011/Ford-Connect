// Escala de 4px — usar como: padding: spacing[4] (= 16px)
export const spacing = {
  1:  4,
  2:  8,
  3:  12,
  4:  16,
  5:  20,
  6:  24,
  7:  28,
  8:  32,
  10: 40,
  12: 48,
} as const;

export type SpacingKey = keyof typeof spacing;
