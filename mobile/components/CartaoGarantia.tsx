import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Veiculo, Recomendacao } from '../types';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { radius } from '../constants/radius';
import { ShieldIcon } from './icons';

interface Props {
  veiculo: Veiculo;
  recomendacoes: Recomendacao[];
}

function formatarData(iso: string): string {
  const data = new Date(iso + 'T12:00:00');
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function calcularDiasAteData(iso: string): number {
  const limite = new Date(iso + 'T12:00:00').getTime();
  const hoje = Date.now();
  return Math.floor((limite - hoje) / (1000 * 60 * 60 * 24));
}

function rotuloTempoRestante(dias: number): string {
  if (dias < 0) return 'Garantia vencida';
  if (dias === 0) return 'Vence hoje';
  if (dias < 30) return `Faltam ${dias} dias`;
  const meses = Math.round(dias / 30);
  if (meses === 1) return 'Falta 1 mês';
  if (meses < 12) return `Faltam ${meses} meses`;
  const anos = Math.floor(meses / 12);
  return anos === 1 ? 'Falta 1 ano' : `Faltam ${anos} anos`;
}

export function CartaoGarantia({ veiculo, recomendacoes }: Props) {
  const dataLimite = veiculo.garantiaDataLimite;
  const kmLimite = veiculo.garantiaKmLimite;

  if (!dataLimite && kmLimite == null) {
    return null;
  }

  const emRisco = recomendacoes.some(
    (r) => r.obrigatoria && r.status === 'atrasada'
  );

  const dias = dataLimite ? calcularDiasAteData(dataLimite) : null;
  const kmRestantes =
    kmLimite != null && veiculo.quilometragem != null
      ? kmLimite - veiculo.quilometragem
      : null;

  const cor = emRisco ? colors.danger : colors.accent;
  const corFundo = emRisco ? colors.dangerSoft : colors.accentSoft;

  return (
    <View style={[estilos.cartao, { borderColor: cor }]}>
      <View style={estilos.cabecalho}>
        <View style={[estilos.iconeWrap, { backgroundColor: corFundo }]}>
          <ShieldIcon size={18} color={cor} />
        </View>
        <View style={estilos.tituloBloco}>
          <Text style={estilos.titulo}>
            {emRisco ? 'Garantia em risco' : 'Garantia ativa'}
          </Text>
          {dias !== null ? (
            <Text style={[estilos.subtitulo, { color: cor }]}>
              {rotuloTempoRestante(dias)}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={estilos.detalhes}>
        {dataLimite ? (
          <View style={estilos.linha}>
            <Text style={estilos.linhaChave}>Vence em</Text>
            <Text style={estilos.linhaValor}>{formatarData(dataLimite)}</Text>
          </View>
        ) : null}
        {kmLimite != null ? (
          <View style={estilos.linha}>
            <Text style={estilos.linhaChave}>Limite</Text>
            <Text style={estilos.linhaValor}>
              {kmLimite.toLocaleString('pt-BR')} km
              {kmRestantes !== null && kmRestantes > 0
                ? ` · faltam ${kmRestantes.toLocaleString('pt-BR')} km`
                : kmRestantes !== null && kmRestantes <= 0
                ? ' · limite atingido'
                : ''}
            </Text>
          </View>
        ) : null}
      </View>

      {emRisco ? (
        <View style={estilos.aviso}>
          <Text style={estilos.avisoTexto}>
            Revisão obrigatória atrasada. Não fazer a revisão na rede oficial pode levar à perda de cobertura da garantia.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing[4],
    gap: spacing[3],
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  tituloBloco: {
    flex: 1,
    gap: 2,
  },
  titulo: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },
  subtitulo: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: typography.letterSpacing.loose,
    textTransform: 'uppercase',
  },
  detalhes: {
    gap: spacing[2],
  },
  linha: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  linhaChave: {
    width: 80,
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
  },
  linhaValor: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.text,
    fontFamily: 'Inter_500Medium',
  },
  aviso: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    padding: spacing[3],
  },
  avisoTexto: {
    fontSize: typography.size.sm,
    color: colors.text,
    fontFamily: 'Inter_500Medium',
    lineHeight: 18,
  },
});
