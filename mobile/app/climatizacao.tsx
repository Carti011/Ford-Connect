import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, Pressable, StyleSheet, ScrollView, Switch, PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useAuth } from '../hooks/useAuth';
import { buscarVeiculo } from '../services/veiculo';
import { Veiculo } from '../types';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { radius } from '../constants/radius';
import { ChevronLeftIcon, PowerIcon, CaretIcon } from '../components/icons';

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

function SlidersIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 5h16M4 12h16M4 19h16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="9" cy="5" r="2.5" fill={colors.bg} stroke={color} strokeWidth="1.5" />
      <Circle cx="15" cy="12" r="2.5" fill={colors.bg} stroke={color} strokeWidth="1.5" />
      <Circle cx="9" cy="19" r="2.5" fill={colors.bg} stroke={color} strokeWidth="1.5" />
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
}

function Discador({ temperatura, onChange }: DiscadorProps) {
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
        <Text style={estilos.tempInfo}>Externa: 31° · Interna: 28°</Text>
      </View>
    </View>
  );
}

// ─── tela principal ───────────────────────────────────────────
type Modo = 'ac' | 'aquecedor' | 'desembacador';

const MODOS = [
  { id: 'ac' as Modo,           label: 'A/C',        Icone: SnowflakeIcon },
  { id: 'aquecedor' as Modo,    label: 'Aquecedor',   Icone: SunIcon      },
  { id: 'desembacador' as Modo, label: 'Desembaçar',  Icone: DefrostIcon  },
];

const ALTURAS_BARRA = [8, 11, 14, 17, 20, 23];

export default function TelaClimatizacao() {
  const router = useRouter();
  const { idVeiculo } = useAuth();
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [temperatura, setTemperatura] = useState(22);
  const [sistemaLigado, setSistemaLigado] = useState(true);
  const [modo, setModo] = useState<Modo>('ac');
  const [velocidade, setVelocidade] = useState(4);

  const carregar = useCallback(async () => {
    if (!idVeiculo) return;
    try { setVeiculo(await buscarVeiculo(idVeiculo)); } catch { /* silencioso */ }
  }, [idVeiculo]);

  useEffect(() => { carregar(); }, [carregar]);

  const modelo = veiculo
    ? `${veiculo.modelo}${veiculo.versao ? ' ' + veiculo.versao : ''}`
    : 'Ranger';

  const zonas = [
    { id: 'motorista',  label: 'Motorista',  temp: temperatura, ativo: true  },
    { id: 'passageiro', label: 'Passageiro', temp: 20,          ativo: false },
  ];

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
        <Pressable style={({ pressed }) => [estilos.headerBtn, pressed && estilos.headerBtnPressed]}>
          <SlidersIcon size={17} color={colors.text} />
        </Pressable>
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

        {/* discador */}
        <View style={estilos.discadorWrap}>
          <Discador temperatura={temperatura} onChange={setTemperatura} />
        </View>

        {/* card sistema ligado */}
        <Pressable
          onPress={() => setSistemaLigado(v => !v)}
          style={({ pressed }) => [
            estilos.sistemaCard,
            sistemaLigado && estilos.sistemaCardOn,
            pressed && estilos.sistemaCardPressed,
          ]}
        >
          <View style={[estilos.sistemaIcone, sistemaLigado && estilos.sistemaIconeOn]}>
            <PowerIcon size={20} color={sistemaLigado ? colors.accent : colors.textDim} />
          </View>
          <View style={estilos.sistemaTextos}>
            <Text style={[estilos.sistemaTitulo, sistemaLigado && estilos.sistemaTituloOn]}>
              {sistemaLigado ? 'Sistema ligado' : 'Sistema desligado'}
            </Text>
            <Text style={[estilos.sistemaSubtitulo, sistemaLigado && estilos.sistemaSubtituloOn]}>
              {sistemaLigado ? 'Ativo há 4 min · Auto' : 'Toque para ligar'}
            </Text>
          </View>
          <Switch
            value={sistemaLigado}
            onValueChange={setSistemaLigado}
            trackColor={{ false: colors.surfaceHi, true: 'rgba(255,255,255,0.45)' }}
            thumbColor={sistemaLigado ? '#FFFFFF' : colors.textMuted}
            ios_backgroundColor={colors.surfaceHi}
          />
        </Pressable>

        {/* modos */}
        <View style={estilos.modos}>
          {MODOS.map(({ id, label, Icone }) => {
            const ativo = modo === id;
            return (
              <Pressable
                key={id}
                onPress={() => setModo(id)}
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
            <Text style={estilos.ventValor}>{velocidade} / 6</Text>
          </View>
          <View style={estilos.ventBarras}>
            {ALTURAS_BARRA.map((h, i) => {
              const nivel = i + 1;
              const ativo = nivel <= velocidade;
              return (
                <Pressable
                  key={nivel}
                  onPress={() => setVelocidade(nivel)}
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
            {zonas.map((zona, idx) => (
              <Pressable
                key={zona.id}
                style={({ pressed }) => [
                  estilos.zonaRow,
                  idx < zonas.length - 1 && estilos.zonaRowBorder,
                  pressed && estilos.zonaRowPressed,
                ]}
              >
                <View style={[estilos.zonaIcone, zona.ativo && estilos.zonaIconeAtivo]}>
                  <ThermometerIcon size={17} color={zona.ativo ? colors.accent : colors.textDim} />
                </View>
                <View style={estilos.zonaTextos}>
                  <Text style={estilos.zonaLabel}>{zona.label}</Text>
                  <Text style={estilos.zonaTemp}>{zona.temp} °C</Text>
                </View>
                {zona.ativo && (
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
