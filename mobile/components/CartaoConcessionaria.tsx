import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Concessionaria } from '../types';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { radius } from '../constants/radius';
import { PinIcon, CaretIcon } from './icons';

interface Props {
  concessionaria: Concessionaria;
  onAgendar?: () => void;
  rotuloBotao?: string;
}

export function CartaoConcessionaria({ concessionaria, onAgendar, rotuloBotao = 'Agendar revisão' }: Props) {
  return (
    <View style={estilos.cartao}>
      <View style={estilos.cabecalho}>
        <View style={estilos.iconeWrap}>
          <PinIcon size={18} color={colors.accent} />
        </View>
        <View style={estilos.tituloBloco}>
          <Text style={estilos.titulo}>{concessionaria.nome}</Text>
          <Text style={estilos.distancia}>{concessionaria.distanciaKm} km de você</Text>
        </View>
      </View>

      <View style={estilos.endereco}>
        <Text style={estilos.enderecoLinha}>{concessionaria.endereco}</Text>
        <Text style={estilos.enderecoLinha}>{concessionaria.cidade} · {concessionaria.estado}</Text>
      </View>

      {onAgendar ? (
        <Pressable
          onPress={onAgendar}
          style={({ pressed }) => [estilos.botao, pressed && estilos.botaoPressed]}
        >
          <Text style={estilos.botaoTexto}>{rotuloBotao}</Text>
          <CaretIcon size={14} color={colors.text} />
        </Pressable>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing[4],
    gap: spacing[3],
    borderWidth: 1,
    borderColor: colors.border,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  iconeWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tituloBloco: {
    flex: 1,
  },
  titulo: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },
  distancia: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  endereco: {
    gap: 2,
  },
  enderecoLinha: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    backgroundColor: colors.accent,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: radius.md,
  },
  botaoPressed: {
    backgroundColor: colors.accentPressed,
  },
  botaoTexto: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },
});
