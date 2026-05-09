import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable,
  ActivityIndicator, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../hooks/useAuth';
import { buscarAlertas } from '../../services/alerta';
import { buscarVeiculo } from '../../services/veiculo';
import { CalendarIcon } from '../../components/icons';
import { AlertaRevisao, Prioridade, Veiculo } from '../../types';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { radius } from '../../constants/radius';
import { layout } from '../../constants/layout';

type FiltroChip = 'todos' | Prioridade;

const COR_PRIORIDADE: Record<Prioridade, string> = {
  alta:  colors.danger,
  media: colors.warn,
  baixa: colors.ok,
};

const COR_PRIORIDADE_SOFT: Record<Prioridade, string> = {
  alta:  colors.dangerSoft,
  media: colors.warnSoft,
  baixa: colors.okSoft,
};

const COR_PRIORIDADE_BORDA: Record<Prioridade, string> = {
  alta:  'rgba(229, 55, 42, 0.33)',
  media: 'rgba(229, 162, 10, 0.33)',
  baixa: 'rgba(44, 184, 117, 0.33)',
};

const LABEL_PRIORIDADE: Record<Prioridade, string> = {
  alta:  'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

const LABEL_CHIP: Record<FiltroChip, string> = {
  todos: 'Todos',
  alta:  'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

function formatarPrazo(dataLimite: string | null): string {
  if (!dataLimite) return 'Sem prazo';
  const hoje = new Date().toISOString().split('T')[0];
  if (dataLimite === hoje) return 'Hoje';
  const [ano, mes, dia] = dataLimite.split('-');
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return `${parseInt(dia, 10)} ${meses[parseInt(mes, 10) - 1]} ${ano}`;
}

function CardAlerta({ alerta }: { alerta: AlertaRevisao }) {
  const cor = COR_PRIORIDADE[alerta.prioridade];
  return (
    <View style={[estilos.card, { borderLeftColor: cor }]}>
      <View style={estilos.cardTopo}>
        <Text style={estilos.cardTitulo} numberOfLines={2}>{alerta.titulo}</Text>
        <View style={[estilos.badge, {
          backgroundColor: COR_PRIORIDADE_SOFT[alerta.prioridade],
          borderColor: COR_PRIORIDADE_BORDA[alerta.prioridade],
        }]}>
          <Text style={[estilos.badgeTexto, { color: cor }]}>
            {LABEL_PRIORIDADE[alerta.prioridade]}
          </Text>
        </View>
      </View>
      {alerta.descricao ? (
        <Text style={estilos.cardDesc}>{alerta.descricao}</Text>
      ) : null}
      <View style={estilos.cardRodape}>
        <CalendarIcon size={13} color={colors.textMuted} />
        <Text style={estilos.cardPrazo}>Prazo: {formatarPrazo(alerta.dataLimite)}</Text>
      </View>
    </View>
  );
}

export default function TelaAlertas() {
  const { idVeiculo } = useAuth();
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [alertas, setAlertas] = useState<AlertaRevisao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<FiltroChip>('todos');

  const carregar = useCallback(async () => {
    if (!idVeiculo) { setCarregando(false); return; }
    setCarregando(true);
    setErro(null);
    try {
      const [veiculoDados, alertasDados] = await Promise.all([
        buscarVeiculo(idVeiculo),
        buscarAlertas(idVeiculo),
      ]);
      setVeiculo(veiculoDados);
      setAlertas(alertasDados);
    } catch (e: any) {
      setErro(e?.response?.status === 401
        ? 'Sessão expirada. Faça login novamente.'
        : 'Não foi possível carregar os dados.');
    } finally {
      setCarregando(false);
    }
  }, [idVeiculo]);

  useEffect(() => { carregar(); }, [carregar]);

  if (carregando) {
    return (
      <View style={estilos.centrado}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const alertasFiltrados = filtro === 'todos'
    ? alertas
    : alertas.filter(a => a.prioridade === filtro);

  const subtitulo = [
    veiculo?.modelo ?? '—',
    `${alertas.length} alerta${alertas.length !== 1 ? 's' : ''}`,
  ].join(' · ');

  return (
    <View style={estilos.tela}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={estilos.scroll}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView edges={['top']}>
          {/* header */}
          <View style={estilos.header}>
            <Text style={estilos.subtitulo}>{subtitulo}</Text>
            <Text style={estilos.titulo}>Alertas</Text>
          </View>

          {/* chips de filtro */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={estilos.chipsContainer}
          >
            {(['todos', 'alta', 'media', 'baixa'] as FiltroChip[]).map(f => (
              <Pressable
                key={f}
                onPress={() => setFiltro(f)}
                style={({ pressed }) => [
                  estilos.chip,
                  filtro === f && estilos.chipAtivo,
                  pressed && estilos.chipPressionado,
                ]}
              >
                <Text style={[estilos.chipTexto, filtro === f && estilos.chipTextoAtivo]}>
                  {LABEL_CHIP[f]}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>

        {/* erro */}
        {erro ? (
          <Pressable onPress={carregar} style={estilos.erroContainer}>
            <Text style={estilos.erroTexto}>{erro}</Text>
            <Text style={estilos.erroLink}>Tentar novamente</Text>
          </Pressable>
        ) : (
          <View style={estilos.lista}>
            {alertasFiltrados.length === 0 ? (
              <Text style={estilos.textoVazio}>
                {filtro === 'todos' ? 'Nenhum alerta pendente' : 'Nenhum alerta nessa prioridade'}
              </Text>
            ) : (
              alertasFiltrados.map(alerta => (
                <CardAlerta key={alerta.id} alerta={alerta} />
              ))
            )}
          </View>
        )}

        <View style={{ height: layout.tabbarHeight }} />
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  scroll: {
    flexGrow: 1,
  },

  // header
  header: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[5],
    paddingBottom: spacing[4],
  },
  subtitulo: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
    marginBottom: spacing[2],
    letterSpacing: 0.2,
  },
  titulo: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: Math.round(typography.size['3xl'] * typography.lineHeight.snug),
  },

  // chips
  chipsContainer: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[4],
    gap: spacing[2],
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipAtivo: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  chipPressionado: {
    opacity: 0.75,
  },
  chipTexto: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    fontFamily: 'Inter_500Medium',
    color: colors.textDim,
  },
  chipTextoAtivo: {
    color: colors.bg,
  },

  // lista
  lista: {
    paddingHorizontal: spacing[6],
    gap: spacing[3],
    flexDirection: 'column',
  },

  // card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    marginBottom: spacing[3],
  },
  cardTopo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  cardTitulo: {
    flex: 1,
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
    lineHeight: Math.round(typography.size.base * typography.lineHeight.snug),
  },
  badge: {
    paddingHorizontal: spacing[3],
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  badgeTexto: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.2,
  },
  cardDesc: {
    fontSize: typography.size.md,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
    lineHeight: Math.round(typography.size.md * typography.lineHeight.normal),
    marginBottom: spacing[2],
  },
  cardRodape: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  cardPrazo: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },

  // erro
  erroContainer: {
    marginHorizontal: spacing[6],
    marginTop: spacing[4],
    alignItems: 'center',
    gap: spacing[2],
  },
  erroTexto: {
    color: colors.danger,
    fontSize: typography.size.sm,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  erroLink: {
    color: colors.accent,
    fontSize: typography.size.sm,
    fontFamily: 'Inter_500Medium',
  },

  // vazio
  textoVazio: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: typography.size.sm,
    fontFamily: 'Inter_400Regular',
    paddingTop: spacing[10],
  },
});
