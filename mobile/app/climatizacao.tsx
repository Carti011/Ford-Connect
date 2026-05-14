import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, Pressable, StyleSheet, ScrollView, Switch, PanResponder, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useAuth } from '../hooks/useAuth';
import { buscarVeiculo } from '../services/veiculo';
import {
  buscarClimatizacao,
  atualizarClimatizacao,
  atualizarZonaClimatizacao,
  AtualizarClimatizacaoBody,
} from '../services/climatizacao';
import { EstadoClimatizacao, ModoClimatizacao, Veiculo } from '../types';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { radius } from '../constants/radius';
import { ChevronLeftIcon, PowerIcon, CaretIcon, FanIcon } from '../components/icons';

// ─── constantes do discador ───────────────────────────────────
const DS = 300;
const DCX = DS / 2;
const DCY = DS / 2;
const DR = 112;
const DSW = 18;
const D_START = 135;
const D_SWEEP = 270;
const T_MIN = 16;
const T_MAX = 30;

// ─── helpers SVG ─────────────────────────────────────────────
function pxy(r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: DCX + r * Math.cos(rad), y: DCY + r * Math.sin(rad) };
}

function arcPath(startAngle: number, sweepAngle: number): string {
  if (sweepAngle <= 0.5) return '';
  const s = pxy(DR, startAngle);
  const e = pxy(DR, startAngle + sweepAngle);
  const large = sweepAngle > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${DR} ${DR} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

// ─── ícones locais ────────────────────────────────────────────
function SnowflakeIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2v20M2 12h20M5.64 5.64l12.72 12.72M18.36 5.64L5.64 18.36"
        stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <Circle cx="12" cy="12" r="2" fill={color} />
    </Svg>
  );
}

function SunIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.6" />
      <Path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M17.66 6.34l-1.41 1.41M6.34 17.66l-1.41 1.41"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

function DefrostIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 7h11M3 12h16M3 17h11" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <Path d="M17 5l3 2-3 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M17 15l3 2-3 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ThermometerIcon({ size = 18, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 14V6a2 2 0 0 0-4 0v8a5 5 0 1 0 4 0z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <Circle cx="10" cy="17" r="2" fill={color} />
    </Svg>
  );
}

// ─── discador interativo ──────────────────────────────────────
interface DiscadorProps {
  temperatura: number;
  onChange: (t: number) => void;
  temperaturaInterna: number;
  temperaturaExterna: number;
}

function Discador({ temperatura, onChange, temperaturaInterna, temperaturaExterna }: DiscadorProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const fraction = (temperatura - T_MIN) / (T_MAX - T_MIN);
  const handleAngle = D_START + fraction * D_SWEEP;
  const hp = pxy(DR, handleAngle);

  const bgArc = arcPath(D_START, D_SWEEP);
  const filledArc = arcPath(D_START, fraction * D_SWEEP);

  const NUM_TICKS = 14;
  const ticks = Array.from({ length: NUM_TICKS + 1 }, (_, i) => ({
    p1: pxy(DR - 7, D_START + (i / NUM_TICKS) * D_SWEEP),
    p2: pxy(DR + 6, D_START + (i / NUM_TICKS) * D_SWEEP),
  }));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: handleTouch,
      onPanResponderMove: handleTouch,
    }),
  ).current;

  function handleTouch(evt: any) {
    const { locationX, locationY } = evt.nativeEvent;
    const dx = locationX - DCX;
    const dy = locationY - DCY;
    let ang = Math.atan2(dy, dx) * (180 / Math.PI);
    if (ang < 0) ang += 360;
    let rel = ang - D_START;
    if (rel < 0) rel += 360;
    if (rel > D_SWEEP) {
      // no gap: snap para o extremo mais próximo
      rel = (rel - D_SWEEP) < (360 - rel) ? D_SWEEP : 0;
    }
    const novaTemp = Math.round(T_MIN + (rel / D_SWEEP) * (T_MAX - T_MIN));
    onChangeRef.current(Math.max(T_MIN, Math.min(T_MAX, novaTemp)));
  }

  return (
    <View style={estilos.discadorOuter} {...panResponder.panHandlers}>
      <Svg width={DS} height={DS}>
        <Defs>
          <LinearGradient
            id="arcGrad"
            x1={DCX - DR}
            y1={DCY}
            x2={DCX + DR}
            y2={DCY}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#1F6FEB" />
            <Stop offset="45%" stopColor="#7C3AED" />
            <Stop offset="100%" stopColor="#E5375B" />
          </LinearGradient>
        </Defs>

        {/* arco de fundo */}
        <Path
          d={bgArc}
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={DSW}
          fill="none"
          strokeLinecap="round"
        />

        {/* marcadores */}
        {ticks.map((t, i) => (
          <Line
            key={i}
            x1={t.p1.x} y1={t.p1.y}
            x2={t.p2.x} y2={t.p2.y}
            stroke="rgba(255,255,255,0.13)"
            strokeWidth={1.5}
          />
        ))}

        {/* arco preenchido com gradiente */}
        {filledArc ? (
          <Path
            d={filledArc}
            stroke="url(#arcGrad)"
            strokeWidth={DSW}
            fill="none"
            strokeLinecap="round"
          />
        ) : null}

        {/* glow do handle */}
        <Circle cx={hp.x} cy={hp.y} r={16} fill={colors.accent} opacity={0.22} />
        {/* handle */}
        <Circle cx={hp.x} cy={hp.y} r={9} fill="#FFFFFF" />
      </Svg>

      {/* texto central */}
      <View style={estilos.discadorTexto} pointerEvents="none">
        <Text style={estilos.tempLabel}>TEMPERATURA</Text>
        <Text style={estilos.tempValor}>
          {temperatura}
          <Text style={estilos.tempUnidade}>°C</Text>
        </Text>
        <Text style={estilos.tempInfo}>Externa: {temperaturaExterna}° · Interna: {temperaturaInterna}°</Text>
      </View>
    </View>
  );
}

// ─── tela principal ───────────────────────────────────────────
const MODOS: { id: ModoClimatizacao; label: string; Icone: typeof SnowflakeIcon }[] = [
  { id: 'ac',           label: 'A/C',        Icone: SnowflakeIcon },
  { id: 'aquecedor',    label: 'Aquecedor',  Icone: SunIcon      },
  { id: 'desembacador', label: 'Desembaçar', Icone: DefrostIcon  },
];

const ALTURAS_BARRA = [8, 11, 14, 17, 20, 23];

const DEBOUNCE_PATCH_MS = 400;

export default function TelaClimatizacao() {
  const router = useRouter();
  const { idVeiculo } = useAuth();
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [estado, setEstado] = useState<EstadoClimatizacao | null>(null);
  const [carregando, setCarregando] = useState(true);

  // debounce do estado (velocidade) e debounce da temperatura da zona ativa (discador)
  // separados porque batem em endpoints diferentes
  const patchEstadoPendenteRef = useRef<AtualizarClimatizacaoBody>({});
  const timerEstadoRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tempZonaPendenteRef = useRef<{ zonaId: string; temperatura: number } | null>(null);
  const timerZonaRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const carregar = useCallback(async () => {
    if (!idVeiculo) return;
    try {
      const [v, c] = await Promise.all([
        buscarVeiculo(idVeiculo),
        buscarClimatizacao(idVeiculo),
      ]);
      setVeiculo(v);
      setEstado(c);
    } finally {
      setCarregando(false);
    }
  }, [idVeiculo]);

  useEffect(() => { carregar(); }, [carregar]);

  // ao desmontar, cancela debounces pendentes
  useEffect(() => () => {
    if (timerEstadoRef.current) clearTimeout(timerEstadoRef.current);
    if (timerZonaRef.current) clearTimeout(timerZonaRef.current);
  }, []);

  // PATCH imediato — para toques discretos (toggle, modo)
  async function patchEstadoImediato(patch: AtualizarClimatizacaoBody) {
    if (!estado || !idVeiculo) return;
    const anterior = estado;
    setEstado(prev => prev ? { ...prev, ...patch } : prev);
    try {
      const atualizado = await atualizarClimatizacao(idVeiculo, patch);
      setEstado(atualizado);
    } catch {
      setEstado(anterior);
    }
  }

  // PATCH debounced do estado — usado pela velocidade do ventilador
  function patchEstadoDebounced(patch: AtualizarClimatizacaoBody) {
    setEstado(prev => prev ? { ...prev, ...patch } : prev);
    patchEstadoPendenteRef.current = { ...patchEstadoPendenteRef.current, ...patch };
    if (timerEstadoRef.current) clearTimeout(timerEstadoRef.current);
    timerEstadoRef.current = setTimeout(async () => {
      if (!idVeiculo) return;
      const body = patchEstadoPendenteRef.current;
      patchEstadoPendenteRef.current = {};
      try {
        const atualizado = await atualizarClimatizacao(idVeiculo, body);
        setEstado(atualizado);
      } catch { /* mantém estado otimista local */ }
    }, DEBOUNCE_PATCH_MS);
  }

  // PATCH debounced da temperatura da zona — usado pelo discador (alvo: zona ativa)
  function ajustarTemperaturaZonaAtiva(novaTemperatura: number) {
    if (!estado || !idVeiculo) return;
    const zonaAlvo = estado.zonas.find(z => z.ativa) ?? estado.zonas[0];
    if (!zonaAlvo) return;

    setEstado(prev => prev ? {
      ...prev,
      zonas: prev.zonas.map(z => z.id === zonaAlvo.id ? { ...z, temperatura: novaTemperatura } : z),
    } : prev);

    tempZonaPendenteRef.current = { zonaId: zonaAlvo.id, temperatura: novaTemperatura };
    if (timerZonaRef.current) clearTimeout(timerZonaRef.current);
    timerZonaRef.current = setTimeout(async () => {
      const pendente = tempZonaPendenteRef.current;
      tempZonaPendenteRef.current = null;
      if (!pendente) return;
      try {
        const atualizada = await atualizarZonaClimatizacao(idVeiculo, pendente.zonaId, {
          temperatura: pendente.temperatura,
        });
        setEstado(prev => prev ? {
          ...prev,
          zonas: prev.zonas.map(z => z.id === atualizada.id ? atualizada : z),
        } : prev);
      } catch { /* mantém estado otimista local */ }
    }, DEBOUNCE_PATCH_MS);
  }

  async function toggleZonaAtiva(zonaId: string) {
    if (!estado || !idVeiculo) return;
    const zonaAtual = estado.zonas.find(z => z.id === zonaId);
    if (!zonaAtual) return;
    const anterior = estado;
    const novaAtiva = !zonaAtual.ativa;
    setEstado(prev => prev ? {
      ...prev,
      zonas: prev.zonas.map(z => z.id === zonaId ? { ...z, ativa: novaAtiva } : z),
    } : prev);
    try {
      const zonaAtualizada = await atualizarZonaClimatizacao(idVeiculo, zonaId, { ativa: novaAtiva });
      setEstado(prev => prev ? {
        ...prev,
        zonas: prev.zonas.map(z => z.id === zonaId ? zonaAtualizada : z),
      } : prev);
    } catch {
      setEstado(anterior);
    }
  }

  if (carregando || !estado) {
    return (
      <View style={estilos.tela}>
        <StatusBar style="light" />
        <SafeAreaView edges={['top']} style={estilos.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [estilos.headerBtn, pressed && estilos.headerBtnPressed]}
          >
            <Text style={estilos.fecharX}>✕</Text>
          </Pressable>
          <Text style={estilos.headerTitulo}>Climatização</Text>
          <View style={estilos.headerEnfeite} pointerEvents="none">
            <FanIcon size={17} color={colors.textDim} />
          </View>
        </SafeAreaView>
        <View style={estilos.loadingContainer}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      </View>
    );
  }

  const modelo = veiculo
    ? `${veiculo.modelo}${veiculo.versao ? ' ' + veiculo.versao : ''}`
    : 'Ranger';

  return (
    <View style={estilos.tela}>
      <StatusBar style="light" />

      {/* header */}
      <SafeAreaView edges={['top']} style={estilos.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [estilos.headerBtn, pressed && estilos.headerBtnPressed]}
        >
          <Text style={estilos.fecharX}>✕</Text>
        </Pressable>
        <Text style={estilos.headerTitulo}>Climatização</Text>
        <View style={estilos.headerEnfeite} pointerEvents="none">
          <FanIcon size={17} color={colors.textDim} />
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={estilos.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* título */}
        <View style={estilos.tituloArea}>
          <Text style={estilos.subtituloModelo}>{modelo}</Text>
          <Text style={estilos.tituloPrincipal}>Pré-condicionar{'\n'}cabine</Text>
        </View>

        {/* discador — controla a temperatura da zona atualmente ativa */}
        <View style={estilos.discadorWrap}>
          <Discador
            temperatura={(estado.zonas.find(z => z.ativa) ?? estado.zonas[0])?.temperatura ?? 22}
            onChange={ajustarTemperaturaZonaAtiva}
            temperaturaInterna={estado.temperaturaInterna}
            temperaturaExterna={estado.temperaturaExterna}
          />
        </View>

        {/* card sistema ligado */}
        <Pressable
          onPress={() => patchEstadoImediato({ sistemaLigado: !estado.sistemaLigado })}
          style={({ pressed }) => [
            estilos.sistemaCard,
            estado.sistemaLigado && estilos.sistemaCardOn,
            pressed && estilos.sistemaCardPressed,
          ]}
        >
          <View style={[estilos.sistemaIcone, estado.sistemaLigado && estilos.sistemaIconeOn]}>
            <PowerIcon size={20} color={estado.sistemaLigado ? colors.accent : colors.textDim} />
          </View>
          <View style={estilos.sistemaTextos}>
            <Text style={[estilos.sistemaTitulo, estado.sistemaLigado && estilos.sistemaTituloOn]}>
              {estado.sistemaLigado ? 'Sistema ligado' : 'Sistema desligado'}
            </Text>
            <Text style={[estilos.sistemaSubtitulo, estado.sistemaLigado && estilos.sistemaSubtituloOn]}>
              {estado.sistemaLigado ? 'Ativo · Auto' : 'Toque para ligar'}
            </Text>
          </View>
          <Switch
            value={estado.sistemaLigado}
            onValueChange={(v) => patchEstadoImediato({ sistemaLigado: v })}
            trackColor={{ false: colors.surfaceHi, true: 'rgba(255,255,255,0.45)' }}
            thumbColor={estado.sistemaLigado ? '#FFFFFF' : colors.textMuted}
            ios_backgroundColor={colors.surfaceHi}
          />
        </Pressable>

        {/* modos */}
        <View style={estilos.modos}>
          {MODOS.map(({ id, label, Icone }) => {
            const ativo = estado.modo === id;
            return (
              <Pressable
                key={id}
                onPress={() => patchEstadoImediato({ modo: id })}
                style={({ pressed }) => [
                  estilos.modoBotao,
                  ativo && estilos.modoBotaoAtivo,
                  pressed && estilos.modoBotaoPressionado,
                ]}
              >
                <Icone size={20} color={ativo ? colors.accent : colors.textDim} />
                <Text style={[estilos.modoLabel, ativo && estilos.modoLabelAtivo]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* velocidade do ventilador */}
        <View style={estilos.ventCard}>
          <View style={estilos.ventHeader}>
            <Text style={estilos.ventLabel}>Velocidade do ventilador</Text>
            <Text style={estilos.ventValor}>{estado.velocidadeVentilador} / 6</Text>
          </View>
          <View style={estilos.ventBarras}>
            {ALTURAS_BARRA.map((h, i) => {
              const nivel = i + 1;
              const ativo = nivel <= estado.velocidadeVentilador;
              return (
                <Pressable
                  key={nivel}
                  testID={`ventilador-barra-${nivel}`}
                  onPress={() => patchEstadoDebounced({ velocidadeVentilador: nivel })}
                  style={[
                    estilos.ventBarra,
                    { height: h },
                    ativo && estilos.ventBarraAtiva,
                  ]}
                />
              );
            })}
          </View>
        </View>

        {/* zonas */}
        <View style={estilos.zonasSecao}>
          <Text style={estilos.zonasTitulo}>ZONAS</Text>
          <View style={estilos.zonasCard}>
            {estado.zonas.map((zona, idx) => (
              <Pressable
                key={zona.id}
                onPress={() => toggleZonaAtiva(zona.id)}
                style={({ pressed }) => [
                  estilos.zonaRow,
                  idx < estado.zonas.length - 1 && estilos.zonaRowBorder,
                  pressed && estilos.zonaRowPressed,
                ]}
              >
                <View style={[estilos.zonaIcone, zona.ativa && estilos.zonaIconeAtivo]}>
                  <ThermometerIcon size={17} color={zona.ativa ? colors.accent : colors.textDim} />
                </View>
                <View style={estilos.zonaTextos}>
                  <Text style={estilos.zonaLabel}>{zona.rotulo}</Text>
                  <Text style={estilos.zonaTemp}>{zona.temperatura} °C</Text>
                </View>
                {zona.ativa && (
                  <View style={estilos.ativaBadge}>
                    <Text style={estilos.ativaBadgeTexto}>ATIVA</Text>
                  </View>
                )}
                <CaretIcon size={14} color={colors.textMuted} />
              </Pressable>
            ))}
          </View>
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

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  headerEnfeite: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fecharX: {
    fontSize: 16,
    color: colors.text,
    fontFamily: 'Inter_400Regular',
  },

  scroll: {
    flexGrow: 1,
  },

  // título
  tituloArea: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
    paddingBottom: spacing[2],
  },
  subtituloModelo: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
    marginBottom: spacing[2],
    letterSpacing: 0.2,
  },
  tituloPrincipal: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
    lineHeight: Math.round(typography.size['3xl'] * 1.15),
    letterSpacing: -0.5,
  },

  // discador
  discadorWrap: {
    alignItems: 'center',
    overflow: 'hidden',
    height: 255,
  },
  discadorOuter: {
    width: DS,
    height: DS,
  },
  discadorTexto: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: spacing[2],
  },
  tempValor: {
    fontSize: 64,
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
    lineHeight: 68,
    letterSpacing: -2,
  },
  tempUnidade: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.medium,
    fontFamily: 'Inter_500Medium',
    color: colors.textDim,
    letterSpacing: 0,
  },
  tempInfo: {
    fontSize: typography.size.md,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
    marginTop: spacing[2],
  },

  // sistema
  sistemaCard: {
    marginHorizontal: spacing[6],
    marginBottom: spacing[4],
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    gap: spacing[4],
  },
  sistemaCardOn: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  sistemaCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  sistemaIcone: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceHi,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sistemaIconeOn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  sistemaTextos: {
    flex: 1,
    gap: 3,
  },
  sistemaTitulo: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },
  sistemaTituloOn: {
    color: '#FFFFFF',
  },
  sistemaSubtitulo: {
    fontSize: typography.size.md,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
  },
  sistemaSubtituloOn: {
    color: 'rgba(255,255,255,0.75)',
  },

  // modos
  modos: {
    flexDirection: 'row',
    marginHorizontal: spacing[6],
    marginBottom: spacing[4],
    gap: spacing[3],
  },
  modoBotao: {
    flex: 1,
    paddingVertical: spacing[4],
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: spacing[2],
  },
  modoBotaoAtivo: {
    backgroundColor: colors.surfaceHi,
    borderColor: colors.accent,
  },
  modoBotaoPressionado: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  modoLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    fontFamily: 'Inter_500Medium',
    color: colors.textDim,
    textAlign: 'center',
  },
  modoLabelAtivo: {
    color: colors.accent,
  },

  // ventilador
  ventCard: {
    marginHorizontal: spacing[6],
    marginBottom: spacing[6],
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing[5],
  },
  ventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  ventLabel: {
    fontSize: typography.size.base,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
  },
  ventValor: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
  },
  ventBarras: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing[2],
  },
  ventBarra: {
    flex: 1,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceHi,
  },
  ventBarraAtiva: {
    backgroundColor: colors.accent,
  },

  // zonas
  zonasSecao: {
    marginHorizontal: spacing[6],
    marginBottom: spacing[4],
  },
  zonasTitulo: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing[3],
  },
  zonasCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  zonaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    gap: spacing[4],
  },
  zonaRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  zonaRowPressed: {
    backgroundColor: colors.surfaceHi,
  },
  zonaIcone: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceHi,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zonaIconeAtivo: {
    backgroundColor: colors.accentSoft,
  },
  zonaTextos: {
    flex: 1,
    gap: 3,
  },
  zonaLabel: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },
  zonaTemp: {
    fontSize: typography.size.md,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
  },
  ativaBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  ativaBadgeTexto: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.accent,
    letterSpacing: 1,
  },
});
