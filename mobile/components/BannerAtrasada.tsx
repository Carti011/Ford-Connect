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
  onPress?: () => void;
}

export function BannerAtrasada({ recomendacoes, onPress }: Props) {
  const atrasadas = recomendacoes.filter((r) => r.status === 'atrasada');
  if (atrasadas.length === 0) return null;

  const principal = atrasadas[0];
  const total = atrasadas.length;

  const titulo =
    total === 1
      ? principal.titulo
      : `${principal.titulo} e mais ${total - 1}`;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [estilos.banner, pressed && estilos.bannerPressed]}
    >
      <View style={estilos.iconeWrap}>
        <Text style={estilos.iconeTexto}>!</Text>
      </View>
      <View style={estilos.textos}>
        <Text style={estilos.titulo}>{titulo}</Text>
        <Text style={estilos.subtitulo}>
          {total === 1 ? 'Atrasada' : `${total} atrasadas`} · Toque para agendar
        </Text>
      </View>
      <CaretIcon size={14} color={colors.text} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.lg,
    padding: spacing[3],
  },
  bannerPressed: {
    opacity: 0.85,
  },
  iconeWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeTexto: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Inter_700Bold',
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
  subtitulo: {
    fontSize: typography.size.sm,
    color: colors.text,
    fontFamily: 'Inter_400Regular',
    opacity: 0.85,
  },
});
