export const typography = {
  size: {
    xs:      11,  // legenda em caps
    sm:      12,  // metadados
    md:      13,  // descrição secundária
    base:    15,  // corpo padrão
    lg:      17,  // destaque pequeno
    xl:      22,  // título de card
    '2xl':   26,  // stat número
    '3xl':   34,  // título de tela
    '4xl':   38,  // status hero
    display: 64,  // % de bateria
  },

  weight: {
    regular:  '400' as const,
    medium:   '500' as const,
    semibold: '600' as const,
    bold:     '700' as const,
  },

  // Multiplicadores — usar como: Math.round(fontSize * lineHeight.snug)
  lineHeight: {
    tight:  1.05,  // hero
    snug:   1.25,  // títulos
    normal: 1.5,   // corpo
  },

  letterSpacing: {
    tight:  -0.8,  // hero
    normal: -0.3,  // títulos
    loose:   0.4,  // labels caps
  },
} as const;
