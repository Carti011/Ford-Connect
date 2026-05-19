import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Recomendacao, StatusRecomendacao } from '../types';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { radius } from '../constants/radius';
import { WrenchIcon, CaretIcon } from './icons';

interface Props {
  recomendacao: Recomendacao;
  agendada?: boolean;
}

const corStatus: Record<StatusRecomendacao, string> = {
  atrasada: colors.danger,
  proxima: colors.warn,
  em_dia: colors.ok,
};

const rotuloStatus: Record<StatusRecomendacao, string> = {
  atrasada: 'Atrasada',
  proxima: 'Próxima',
  em_dia: 'Em dia',
};

function formatarPrazo(rec: Recomendacao): string | null {
  const partes: string[] = [];
  if (rec.dataLimite) {
    const data = new Date(rec.dataLimite + 'T12:00:00');
    const formatada = data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    partes.push(formatada);
  }
  if (rec.quilometragemLimite) {
    partes.push(`${rec.quilometragemLimite.toLocaleString('pt-BR')} km`);
  }
  return partes.length > 0 ? partes.join(' · ') : null;
}

function formatarCusto(min: number | null, max: number | null): string | null {
  if (min == null && max == null) return null;
  const formatar = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  if (min != null && max != null) return `${formatar(min)} a ${formatar(max)}`;
  return formatar((min ?? max) as number);
}

export function CartaoRecomendacao({ recomendacao, agendada = false }: Props) {
  const [expandido, setExpandido] = useState(false);
  const cor = corStatus[recomendacao.status];
  const prazo = formatarPrazo(recomendacao);
  const custo = formatarCusto(recomendacao.custoMin, recomendacao.custoMax);
  const temPorQue = !!recomendacao.porQueImporta;

  return (
    <View style={[estilos.cartao, { borderLeftColor: cor }]}>
      <View style={estilos.topo}>
        <View style={[estilos.iconeWrap, { backgroundColor: cor + '22' }]}>
          <WrenchIcon size={18} color={cor} />
        </View>
        <View style={estilos.tituloBloco}>
          <Text style={estilos.titulo}>{recomendacao.titulo}</Text>
          <View style={estilos.badgesLinha}>
            <View style={[estilos.badge, { backgroundColor: cor + '22', borderColor: cor }]}>
              <Text style={[estilos.badgeTexto, { color: cor }]}>{rotuloStatus[recomendacao.status]}</Text>
            </View>
            <View style={[estilos.badge, { backgroundColor: recomendacao.obrigatoria ? colors.dangerSoft : colors.surfaceHi, borderColor: recomendacao.obrigatoria ? colors.danger : colors.borderStrong }]}>
              <Text style={[estilos.badgeTexto, { color: recomendacao.obrigatoria ? colors.danger : colors.textDim }]}>
                {recomendacao.obrigatoria ? 'Obrigatória' : 'Opcional'}
              </Text>
            </View>
            {agendada ? (
              <View style={[estilos.badge, { backgroundColor: colors.okSoft, borderColor: colors.ok }]}>
                <Text style={[estilos.badgeTexto, { color: colors.ok }]}>Agendada</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      {recomendacao.descricao ? (
        <Text style={estilos.descricao}>{recomendacao.descricao}</Text>
      ) : null}

      {prazo ? <Text style={estilos.prazo}>Prazo: {prazo}</Text> : null}
      {custo ? <Text style={estilos.custo}>{custo}</Text> : null}

      {temPorQue ? (
        <View style={estilos.expansor}>
          <Pressable
            onPress={() => setExpandido((v) => !v)}
            style={({ pressed }) => [estilos.expansorBotao, pressed && estilos.expansorPressed]}
          >
            <Text style={estilos.expansorTexto}>
              {expandido ? 'Ocultar explicação' : 'Por que isso é importante?'}
            </Text>
            <View style={[estilos.caret, expandido && estilos.caretAberto]}>
              <CaretIcon size={12} color={colors.textDim} />
            </View>
          </Pressable>
          {expandido ? (
            <Text style={estilos.porQueTexto}>{recomendacao.porQueImporta}</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing[4],
    gap: spacing[2],
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    gap: spacing[2],
  },
  titulo: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
    lineHeight: 22,
  },
  badgesLinha: {
    flexDirection: 'row',
    gap: spacing[2],
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  badgeTexto: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
  },
  descricao: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
  prazo: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
  },
  custo: {
    fontSize: typography.size.sm,
    color: colors.text,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
  },
  expansor: {
    marginTop: spacing[2],
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing[2],
  },
  expansorBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expansorPressed: {
    opacity: 0.7,
  },
  expansorTexto: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textDim,
  },
  caret: {
    transform: [{ rotate: '90deg' }],
  },
  caretAberto: {
    transform: [{ rotate: '270deg' }],
  },
  porQueTexto: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
    lineHeight: 19,
  },
});
