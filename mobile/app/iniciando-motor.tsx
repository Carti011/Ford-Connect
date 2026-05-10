import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Pressable, StyleSheet, Animated, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import RAnimated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming, withDelay,
  Easing as REasing,
} from 'react-native-reanimated';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { radius } from '../constants/radius';
import { PowerIcon } from '../components/icons';

// ─── tipos ────────────────────────────────────────────────────
type EstadoEtapa = 'pendente' | 'em_andamento' | 'completo';

interface Etapa {
  id: string;
  titulo: string;
  subtitulo: string;
  estado: EstadoEtapa;
}

// ─── constantes ───────────────────────────────────────────────
const BTN_SIZE   = 100;
const RING_SIZES = [162, 230, 300] as const;
const RING_DELAYS = [0, 800, 1600] as const;

const ETAPAS_INICIAL: Etapa[] = [
  { id: 'e1', titulo: 'Comando enviado pelo app',       subtitulo: '—',          estado: 'pendente' },
  { id: 'e2', titulo: 'Veículo confirmou recebimento',  subtitulo: '—',          estado: 'pendente' },
  { id: 'e3', titulo: 'Pré-aquecimento do motor',       subtitulo: 'Aguardando', estado: 'pendente' },
  { id: 'e4', titulo: 'Climatização ativando',          subtitulo: 'Aguardando', estado: 'pendente' },
  { id: 'e5', titulo: 'Pronto para dirigir',            subtitulo: '—',          estado: 'pendente' },
];

// ─── helpers ──────────────────────────────────────────────────
function formatarHora() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function formatarElapsed(s: number) {
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

// ─── anel pulsante (sonar) ────────────────────────────────────
function AniloSonar({ tamanho, delay }: { tamanho: number; delay: number }) {
  const escala  = useSharedValue(0.3);
  const opacidade = useSharedValue(0);

  useEffect(() => {
    escala.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0.3, { duration: 0 }),
        withTiming(1,   { duration: 2400, easing: REasing.out(REasing.ease) }),
      ), -1,
    ));
    opacidade.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0.38, { duration: 0 }),
        withTiming(0,    { duration: 2400, easing: REasing.out(REasing.ease) }),
      ), -1,
    ));
  }, []);

  const estilo = useAnimatedStyle(() => ({
    transform: [{ scale: escala.value }],
    opacity: opacidade.value,
  }));

  return (
    <RAnimated.View
      style={[{
        position: 'absolute',
        width: tamanho,
        height: tamanho,
        borderRadius: tamanho / 2,
        backgroundColor: colors.accent,
      }, estilo]}
    />
  );
}

// ─── ícone de etapa ───────────────────────────────────────────
function IconeEtapa({ estado }: { estado: EstadoEtapa }) {
  if (estado === 'completo') {
    return (
      <View style={[estilos.etapaCirculo, estilos.etapaCirculoOk]}>
        <Text style={estilos.etapaCheck}>✓</Text>
      </View>
    );
  }
  if (estado === 'em_andamento') {
    return (
      <View style={[estilos.etapaCirculo, estilos.etapaCirculoAtivo]}>
        <View style={estilos.etapaDotAtivo} />
      </View>
    );
  }
  return <View style={[estilos.etapaCirculo, estilos.etapaCirculoPendente]} />;
}

// ─── tela ─────────────────────────────────────────────────────
export default function TelaIniciandoMotor() {
  const router = useRouter();
  const { modelo, origem } = useLocalSearchParams<{ modelo?: string; origem?: string }>();
  const nomeModelo = modelo ?? 'Ranger';
  const veioDaLocalizacao = origem === 'localizacao';

  const [etapas, setEtapas] = useState<Etapa[]>(ETAPAS_INICIAL);
  const [titulo, setTitulo] = useState('Pré-aquecendo\no motor...');
  const [elapsed, setElapsed] = useState(0);
  const [concluido, setConcluido] = useState(false);

  const progresso = useRef(new Animated.Value(0)).current;
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── largura animada da barra ──────────────────────────────
  const larguraBarra = progresso.interpolate({
    inputRange: [0, 1], outputRange: ['0%', '100%'],
  });

  // ── atualiza etapa ────────────────────────────────────────
  function atualizarEtapa(id: string, estado: EstadoEtapa) {
    setEtapas(prev => prev.map(e => {
      if (e.id !== id) return e;
      const sub = estado === 'completo'    ? formatarHora()
                : estado === 'em_andamento' ? 'Em andamento...'
                : e.subtitulo;
      return { ...e, estado, subtitulo: sub };
    }));
  }

  // ── sequência principal ───────────────────────────────────
  useEffect(() => {
    // barra de progresso contínua
    Animated.timing(progresso, {
      toValue: 1, duration: 5500, useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();

    const ts = timeoutsRef.current;

    ts.push(setTimeout(() => atualizarEtapa('e1', 'completo'),       300));
    ts.push(setTimeout(() => atualizarEtapa('e2', 'completo'),      1100));
    ts.push(setTimeout(() => atualizarEtapa('e3', 'em_andamento'),  1900));
    ts.push(setTimeout(() => { atualizarEtapa('e3', 'completo');
                                atualizarEtapa('e4', 'em_andamento'); }, 3200));
    ts.push(setTimeout(() => { atualizarEtapa('e4', 'completo');
                                atualizarEtapa('e5', 'em_andamento'); }, 4400));
    ts.push(setTimeout(() => {
      atualizarEtapa('e5', 'completo');
      setTitulo('Motor\nligado!');
      setConcluido(true);
    }, 5500));

    // timer elapsed
    intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);

    return () => {
      ts.forEach(clearTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function limparTimers() {
    timeoutsRef.current.forEach(clearTimeout);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  function fechar() {
    limparTimers();
    router.replace('/(tabs)');
  }

  function cancelar() {
    limparTimers();
    if (veioDaLocalizacao) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  }

  return (
    <View style={estilos.tela}>
      <StatusBar style="light" />

      {/* header */}
      <SafeAreaView edges={['top']} style={estilos.header}>
        <Pressable
          onPress={fechar}
          style={({ pressed }) => [estilos.fecharBtn, pressed && estilos.fecharBtnPressed]}
        >
          <Text style={estilos.fecharX}>✕</Text>
        </Pressable>
        <Text style={estilos.headerTitulo}>Iniciando motor</Text>
        <View style={{ width: 40 }} />
      </SafeAreaView>

      {/* título */}
      <View style={estilos.tituloArea}>
        <Text style={estilos.subtituloModelo}>{nomeModelo}</Text>
        <Text style={estilos.tituloPrincipal}>{titulo}</Text>
      </View>

      {/* botão de power com anéis */}
      <View style={estilos.botaoArea}>
        {RING_SIZES.map((tam, i) => (
          <AniloSonar key={i} tamanho={tam} delay={RING_DELAYS[i]} />
        ))}
        <View style={estilos.botaoPower}>
          <PowerIcon size={40} color="#fff" />
        </View>
      </View>

      {/* seção inferior */}
      <View style={estilos.inferior}>
        {/* timer */}
        <View style={estilos.timerRow}>
          <Text style={estilos.timerElapsed}>{formatarElapsed(elapsed)}</Text>
          <Text style={estilos.timerInfo}>Motor frio · 11° C</Text>
          <Text style={estilos.timerMax}>10:00</Text>
        </View>

        {/* barra de progresso */}
        <View style={estilos.barraContainer}>
          <Animated.View style={[estilos.barraFill, { width: larguraBarra }]}>
            <LinearGradient
              colors={['#00D4A8', colors.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>
        </View>

        {/* etapas */}
        <View style={estilos.etapas}>
          {etapas.map((e, idx) => (
            <View
              key={e.id}
              style={[estilos.etapaRow, idx < etapas.length - 1 && estilos.etapaRowBorda]}
            >
              <IconeEtapa estado={e.estado} />
              <View style={estilos.etapaTextos}>
                <Text style={[
                  estilos.etapaTitulo,
                  e.estado === 'pendente' && estilos.etapaTituloPendente,
                ]}>
                  {e.titulo}
                </Text>
                <Text style={estilos.etapaSubtitulo}>{e.subtitulo}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* cancelar */}
        <Pressable
          onPress={cancelar}
          style={({ pressed }) => [estilos.cancelarBtn, pressed && estilos.cancelarBtnPressed]}
        >
          <Text style={estilos.cancelarTexto}>
            {concluido ? 'Desligar o carro' : 'Cancelar partida'}
          </Text>
        </Pressable>

        <SafeAreaView edges={['bottom']} />
      </View>
    </View>
  );
}

// ─── estilos ──────────────────────────────────────────────────
const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
  },
  headerTitulo: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },
  fecharBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceHi,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fecharBtnPressed: {
    backgroundColor: colors.surface,
    transform: [{ scale: 0.95 }],
  },
  fecharX: {
    fontSize: 14,
    color: colors.text,
    fontFamily: 'Inter_400Regular',
  },

  // título
  tituloArea: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
  subtituloModelo: {
    fontSize: typography.size.base,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
    marginBottom: spacing[2],
  },
  tituloPrincipal: {
    fontSize: 38,
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
    lineHeight: Math.round(38 * 1.1),
    letterSpacing: -0.8,
  },

  // power button + rings
  botaoArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoPower: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE / 2,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 28,
    elevation: 16,
  },

  // inferior
  inferior: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
  },

  // timer
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  timerElapsed: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textDim,
    minWidth: 44,
  },
  timerInfo: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textDim,
  },
  timerMax: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    minWidth: 44,
    textAlign: 'right',
  },

  // barra
  barraContainer: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceHi,
    overflow: 'hidden',
    marginBottom: spacing[5],
  },
  barraFill: {
    height: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },

  // etapas
  etapas: {
    marginBottom: spacing[4],
  },
  etapaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    gap: spacing[4],
  },
  etapaRowBorda: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  etapaCirculo: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  etapaCirculoOk: {
    backgroundColor: colors.ok,
  },
  etapaCirculoAtivo: {
    backgroundColor: colors.accent,
  },
  etapaCirculoPendente: {
    backgroundColor: colors.surfaceHi,
  },
  etapaCheck: {
    fontSize: 13,
    color: '#fff',
    fontFamily: 'Inter_700Bold',
    lineHeight: 16,
  },
  etapaDotAtivo: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  etapaTextos: {
    flex: 1,
    gap: 2,
  },
  etapaTitulo: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },
  etapaTituloPendente: {
    color: colors.textMuted,
    fontWeight: typography.weight.regular,
    fontFamily: 'Inter_400Regular',
  },
  etapaSubtitulo: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },

  // cancelar
  cancelarBtn: {
    height: 52,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  cancelarBtnPressed: {
    opacity: 0.7,
  },
  cancelarTexto: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.danger,
  },
});
