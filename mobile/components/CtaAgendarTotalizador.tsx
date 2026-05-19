import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Recomendacao } from '../types';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { radius } from '../constants/radius';
import { CaretIcon } from './icons';

interface Props {
  recomendacoes: Recomendacao[];
  onPress: () => void;
}

function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
}

export function CtaAgendarTotalizador({ recomendacoes, onPress }: Props) {
  const pendentes = recomendacoes.filter((r) => r.status !== 'em_dia');
  if (pendentes.length === 0) return null;

  const somaMin = pendentes.reduce((acc, r) => acc + (r.custoMin ?? 0), 0);
  const somaMax = pendentes.reduce((acc, r) => acc + (r.custoMax ?? 0), 0);

  const rotuloServicos =
    pendentes.length === 1 ? '1 serviço' : `${pendentes.length} serviços`;
  const rotuloCusto =
    somaMin > 0 && somaMax > 0 && somaMin !== somaMax
      ? `${formatarMoeda(somaMin)} a ${formatarMoeda(somaMax)}`
      : somaMin > 0
        ? formatarMoeda(somaMin)
        : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [estilos.botao, pressed && estilos.botaoPressed]}
    >
      <View style={estilos.textos}>
        <Text style={estilos.titulo}>Agendar {rotuloServicos}</Text>
        {rotuloCusto ? <Text style={estilos.custo}>{rotuloCusto}</Text> : null}
      </View>
      <View style={estilos.caretWrap}>
        <CaretIcon size={14} color={colors.text} />
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    gap: spacing[3],
  },
  botaoPressed: {
    backgroundColor: colors.accentPressed,
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  titulo: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },
  custo: {
    fontSize: typography.size.sm,
    color: colors.text,
    fontFamily: 'Inter_400Regular',
    opacity: 0.85,
  },
  caretWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
