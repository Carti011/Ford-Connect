import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { radius } from '../constants/radius';

interface Props {
  score: number | null;
  modelo: string;
}

function rotuloDoScore(score: number | null): { texto: string; cor: string } {
  if (score == null) return { texto: 'Indisponível', cor: colors.textDim };
  if (score <= 50) return { texto: 'Crítico', cor: colors.danger };
  if (score <= 79) return { texto: 'Atenção', cor: colors.warn };
  return { texto: 'Bom', cor: colors.ok };
}

const TAMANHO = 168;
const TRAÇO = 14;
const RAIO = (TAMANHO - TRAÇO) / 2;
const CIRCUMFERENCIA = 2 * Math.PI * RAIO;

export function CartaoScoreSaude({ score, modelo }: Props) {
  const rotulo = rotuloDoScore(score);
  const valor = score ?? 0;
  const offset = CIRCUMFERENCIA * (1 - valor / 100);

  return (
    <View style={estilos.cartao}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.modelo}>{modelo}</Text>
        <Text style={estilos.subRotulo}>Saúde do veículo</Text>
      </View>

      <View style={estilos.gaugeWrap}>
        <Svg width={TAMANHO} height={TAMANHO}>
          <Circle
            cx={TAMANHO / 2}
            cy={TAMANHO / 2}
            r={RAIO}
            stroke={colors.surfaceHi}
            strokeWidth={TRAÇO}
            fill="none"
          />
          <Circle
            cx={TAMANHO / 2}
            cy={TAMANHO / 2}
            r={RAIO}
            stroke={rotulo.cor}
            strokeWidth={TRAÇO}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCIA}
            strokeDashoffset={offset}
            fill="none"
            transform={`rotate(-90 ${TAMANHO / 2} ${TAMANHO / 2})`}
          />
        </Svg>
        <View style={estilos.centro} pointerEvents="none">
          <Text style={estilos.numero}>{score ?? '—'}</Text>
          <Text style={estilos.escala}>/100</Text>
        </View>
      </View>

      <View style={[estilos.badge, { backgroundColor: rotulo.cor + '22', borderColor: rotulo.cor }]}>
        <Text style={[estilos.badgeTexto, { color: rotulo.cor }]}>{rotulo.texto}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[5],
    alignItems: 'center',
    gap: spacing[4],
  },
  cabecalho: {
    alignItems: 'center',
    gap: 2,
  },
  modelo: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },
  subRotulo: {
    fontSize: typography.size.xs,
    fontFamily: 'Inter_500Medium',
    color: colors.textDim,
    letterSpacing: typography.letterSpacing.loose,
    textTransform: 'uppercase',
  },
  gaugeWrap: {
    width: TAMANHO,
    height: TAMANHO,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centro: {
    position: 'absolute',
    alignItems: 'center',
  },
  numero: {
    fontSize: 56,
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: 60,
  },
  escala: {
    fontSize: typography.size.md,
    fontFamily: 'Inter_500Medium',
    color: colors.textDim,
    marginTop: -spacing[1],
  },
  badge: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  badgeTexto: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: typography.letterSpacing.loose,
    textTransform: 'uppercase',
  },
});
