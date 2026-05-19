import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AgendamentoServico } from '../types';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { radius } from '../constants/radius';

interface Props {
  agendamento: AgendamentoServico;
}

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function formatarData(iso: string): string {
  const data = new Date(iso + 'T12:00:00');
  return `${data.getDate()} ${MESES[data.getMonth()]}`;
}

export function CartaoAgendamentoConfirmado({ agendamento }: Props) {
  const periodoLabel = agendamento.periodo === 'manha' ? 'manhã' : 'tarde';
  const detalhe = `${agendamento.concessionaria.nome} · ${formatarData(agendamento.dataPreferida)} · ${periodoLabel}`;

  return (
    <View style={estilos.cartao}>
      <View style={estilos.check}>
        <Text style={estilos.checkTexto}>✓</Text>
      </View>
      <View style={estilos.textos}>
        <Text style={estilos.titulo}>Agendamento confirmado</Text>
        <Text style={estilos.detalhe}>{detalhe}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: colors.okSoft,
    borderWidth: 1,
    borderColor: colors.ok,
    borderRadius: radius.md,
    padding: spacing[4],
  },
  check: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.ok,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkTexto: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
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
  detalhe: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
  },
});
