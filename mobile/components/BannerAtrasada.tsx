import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Recomendacao } from '../types';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { radius } from '../constants/radius';
import { CalendarIcon, CaretIcon } from './icons';

interface Props {
  recomendacoes: Recomendacao[];
  onPress?: () => void;
}

export function BannerAtrasada({ recomendacoes, onPress }: Props) {
  const atrasadas = recomendacoes.filter((r) => r.status === 'atrasada');
  if (atrasadas.length === 0) return null;

  const label =
    atrasadas.length === 1
      ? 'Agendar revisão atrasada'
      : 'Agendar revisões atrasadas';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [estilos.botao, pressed && estilos.botaoPressed]}
    >
      <View style={estilos.iconeWrap}>
        <CalendarIcon size={16} color={colors.text} />
      </View>
      <Text style={estilos.label}>{label}</Text>
      <CaretIcon size={14} color={colors.text} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: colors.danger,
    borderRadius: radius.md,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
  },
  botaoPressed: {
    opacity: 0.85,
  },
  iconeWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },
});
