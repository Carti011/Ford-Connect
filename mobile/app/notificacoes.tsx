import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { buscarAlertas } from '../services/alerta';
import { AlertaRevisao } from '../types';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { radius } from '../constants/radius';
import { ChevronLeftIcon, EditIcon } from '../components/icons';

// ─── tipos ────────────────────────────────────────────────────
type Categoria = 'veiculo' | 'manutencao' | 'sistema';

interface Notificacao {
  id: string;
  titulo: string;
  descricao: string;
  tempo: string;
  categoria: Categoria;
  corPonto: string;
  lida: boolean;
}

type FiltroChip = 'tudo' | Categoria;

const LABEL_CHIP: Record<FiltroChip, string> = {
  tudo:      'Tudo',
  veiculo:   'Veículo',
  manutencao:'Manutenção',
  sistema:   'Sistema',
};

// ─── mocks de veículo e sistema ───────────────────────────────
const MOCKS: Notificacao[] = [
  {
    id: 'm1',
    titulo: 'Pressão dos pneus baixa',
    descricao: 'Pneu dianteiro direito a 28 psi',
    tempo: 'Há 12 min',
    categoria: 'veiculo',
    corPonto: colors.warn,
    lida: false,
  },
  {
    id: 'm2',
    titulo: 'Veículo travado',
    descricao: 'Comando enviado via app',
    tempo: 'Ontem, 22:08',
    categoria: 'veiculo',
    corPonto: colors.ok,
    lida: true,
  },
  {
    id: 'm3',
    titulo: 'Viagem concluída',
    descricao: '42 km · 38 min · economia +12%',
    tempo: '3 dias',
    categoria: 'veiculo',
    corPonto: colors.ok,
    lida: true,
  },
  {
    id: 'm4',
    titulo: 'SYNC 4.2 disponível',
    descricao: 'Nova versão do sistema multimídia',
    tempo: '2 dias',
    categoria: 'sistema',
    corPonto: colors.textMuted,
    lida: true,
  },
];

// ─── helpers ──────────────────────────────────────────────────
function formatarTempo(dataLimite: string | null): string {
  if (!dataLimite) return '';
  const hoje = new Date();
  const data = new Date(dataLimite + 'T12:00:00');
  const diffDias = Math.round((hoje.getTime() - data.getTime()) / 86_400_000);
  if (diffDias === 0) return 'Hoje';
  if (diffDias === 1) return 'Ontem';
  if (diffDias > 1) return `${diffDias} dias`;
  const abs = Math.abs(diffDias);
  return abs === 1 ? 'Amanhã' : `Em ${abs} dias`;
}

function alertaParaNotificacao(a: AlertaRevisao): Notificacao {
  return {
    id: a.id,
    titulo: a.titulo,
    descricao: a.descricao ?? '',
    tempo: formatarTempo(a.dataLimite),
    categoria: 'manutencao',
    corPonto: colors.accent,
    lida: a.resolvido,
  };
}

// ─── card ─────────────────────────────────────────────────────
function CardNotificacao({
  item,
  onPress,
}: {
  item: Notificacao;
  onPress: (id: string) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(item.id)}
      style={({ pressed }) => [
        estilos.card,
        !item.lida && estilos.cardNaoLido,
        pressed && estilos.cardPressed,
      ]}
    >
      {/* linha principal: ponto + conteúdo + badge não lido */}
      <View style={estilos.cardRow}>
        <View style={[estilos.ponto, { backgroundColor: item.corPonto }]} />

        <View style={estilos.cardConteudo}>
          <View style={estilos.cardTituloRow}>
            <Text style={estilos.cardTitulo} numberOfLines={2}>{item.titulo}</Text>
            {!item.lida && <View style={estilos.pontoNaoLido} />}
          </View>
          {item.descricao ? (
            <Text style={estilos.cardDesc} numberOfLines={2}>{item.descricao}</Text>
          ) : null}
          {item.tempo ? (
            <Text style={estilos.cardTempo}>{item.tempo}</Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

// ─── tela ─────────────────────────────────────────────────────
export default function TelaNotificacoes() {
  const router = useRouter();
  const { idVeiculo } = useAuth();
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState<FiltroChip>('tudo');

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const alertas = idVeiculo ? await buscarAlertas(idVeiculo) : [];
      const doBackend = alertas.map(alertaParaNotificacao);
      // mocks primeiro (mais recentes), backend depois
      setNotificacoes([...MOCKS, ...doBackend]);
    } catch {
      setNotificacoes(MOCKS);
    } finally {
      setCarregando(false);
    }
  }, [idVeiculo]);

  useEffect(() => { carregar(); }, [carregar]);

  function marcarComoLida(id: string) {
    setNotificacoes(prev =>
      prev.map(n => n.id === id ? { ...n, lida: true } : n)
    );
  }

  function marcarTodasComoLidas() {
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
  }

  const filtradas = filtro === 'tudo'
    ? notificacoes
    : notificacoes.filter(n => n.categoria === filtro);

  const novasHoje = notificacoes.filter(n => !n.lida).length;

  if (carregando) {
    return (
      <View style={estilos.centrado}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={estilos.tela}>
      <StatusBar style="light" />

      {/* header */}
      <SafeAreaView edges={['top']} style={estilos.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [estilos.headerBtn, pressed && estilos.headerBtnPressed]}
        >
          <ChevronLeftIcon size={20} color={colors.text} />
        </Pressable>
        <Text style={estilos.headerTitulo}>Notificações</Text>
        <Pressable
          style={({ pressed }) => [estilos.headerBtn, pressed && estilos.headerBtnPressed]}
        >
          <EditIcon size={18} color={colors.text} />
        </Pressable>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={estilos.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* headline */}
        <View style={estilos.headline}>
          <Text style={estilos.headlineContagem}>
            {novasHoje > 0 ? `${novasHoje} ${novasHoje === 1 ? 'nova hoje' : 'novas hoje'}` : 'Tudo em dia'}
          </Text>
          {novasHoje > 0 && (
            <Pressable onPress={marcarTodasComoLidas}>
              <Text style={estilos.marcarTodasTexto}>Marcar todas como lidas</Text>
            </Pressable>
          )}
        </View>

        {/* chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={estilos.chipsContainer}
          style={estilos.chipsScroll}
        >
          {(['tudo', 'veiculo', 'manutencao', 'sistema'] as FiltroChip[]).map(f => (
            <Pressable
              key={f}
              onPress={() => setFiltro(f)}
              style={({ pressed }) => [
                estilos.chip,
                filtro === f && estilos.chipAtivo,
                pressed && estilos.chipPressed,
              ]}
            >
              <Text style={[estilos.chipTexto, filtro === f && estilos.chipTextoAtivo]}>
                {LABEL_CHIP[f]}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* lista */}
        <View style={estilos.lista}>
          {filtradas.length === 0 ? (
            <Text style={estilos.vazio}>Nenhuma notificação</Text>
          ) : (
            filtradas.map(n => (
              <CardNotificacao key={n.id} item={n} onPress={marcarComoLida} />
            ))
          )}
        </View>

        <View style={{ height: spacing[10] }} />
      </ScrollView>
    </View>
  );
}

// ─── estilos ──────────────────────────────────────────────────
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

  // header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitulo: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
    letterSpacing: 0.1,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceHi,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnPressed: {
    backgroundColor: colors.surface,
    transform: [{ scale: 0.95 }],
  },

  scroll: {
    paddingTop: spacing[6],
  },

  // headline
  headline: {
    paddingHorizontal: spacing[6],
    marginBottom: spacing[5],
    gap: spacing[2],
  },
  headlineContagem: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: Math.round(typography.size['3xl'] * typography.lineHeight.tight),
  },
  marcarTodasTexto: {
    fontSize: typography.size.md,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
  },

  // chips
  chipsScroll: {
    flexShrink: 0,
    flexGrow: 0,
  },
  chipsContainer: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[5],
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing[2],
    flexShrink: 0,
    alignSelf: 'center',
  },
  chipAtivo: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  chipPressed: {
    opacity: 0.72,
  },
  chipTexto: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    fontFamily: 'Inter_500Medium',
    color: colors.textDim,
  },
  chipTextoAtivo: {
    color: colors.bg,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
  },

  // lista
  lista: {
    paddingHorizontal: spacing[5],
  },
  vazio: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: typography.size.sm,
    fontFamily: 'Inter_400Regular',
    paddingTop: spacing[10],
  },

  // card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[5],
    marginBottom: spacing[3],
  },
  cardNaoLido: {
    borderColor: 'rgba(31, 111, 235, 0.28)',
    backgroundColor: colors.surfaceHi,
  },
  cardPressed: {
    opacity: 0.78,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[4],
  },
  ponto: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginTop: 5,
    flexShrink: 0,
  },
  cardConteudo: {
    flex: 1,
    gap: spacing[1],
  },
  cardTituloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  cardTitulo: {
    flex: 1,
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
    lineHeight: Math.round(typography.size.base * typography.lineHeight.snug),
  },
  pontoNaoLido: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    flexShrink: 0,
  },
  cardDesc: {
    fontSize: typography.size.md,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
    lineHeight: Math.round(typography.size.md * typography.lineHeight.normal),
  },
  cardTempo: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
    marginTop: spacing[1],
  },
});
