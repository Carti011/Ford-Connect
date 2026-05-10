import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Pressable, StyleSheet, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { radius } from '../constants/radius';

// ─── cores ────────────────────────────────────────────────────
const COR_VERDE   = colors.ok;
const COR_LARANJA = '#E8971A';

// ─── ícones ───────────────────────────────────────────────────
function LockIcon({ size = 72, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="11" width="18" height="11" rx="2.5"
        stroke={color} strokeWidth="1.6" fill="none" />
      <Path d="M7 11V8a5 5 0 0 1 10 0v3"
        stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  );
}

function UnlockIcon({ size = 72, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="11" width="18" height="11" rx="2.5"
        stroke={color} strokeWidth="1.6" fill="none" />
      <Path d="M7 11V8a5 5 0 0 1 9.9-1"
        stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  );
}

function CheckIcon({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 13l4 4L19 7" stroke={color} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── helpers ─────────────────────────────────────────────────
function horaAtual() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getHours())}:${p(d.getMinutes())}`;
}

const ITENS_TRAVADO = [
  { label: 'PORTAS',      valor: 'Trancadas' },
  { label: 'PORTA-MALAS', valor: 'Fechado'   },
  { label: 'JANELAS',     valor: 'Fechadas'  },
  { label: 'ALARME',      valor: 'Armado'    },
];

const ITENS_DESTRAVADO = [
  { label: 'PORTAS',      valor: 'Destrancadas' },
  { label: 'PORTA-MALAS', valor: 'Destrancado'  },
  { label: 'JANELAS',     valor: 'Fechadas'     },
  { label: 'ALARME',      valor: 'Desarmado'    },
];

// ─── tela ─────────────────────────────────────────────────────
export default function TelaTrava() {
  const router = useRouter();
  const { acao } = useLocalSearchParams<{ acao?: string }>();
  const destravando = acao === 'destravar';

  const horaTravo = useRef(horaAtual()).current;
  const [countdown, setCountdown] = useState(30);

  // animação de entrada
  const escala   = useRef(new Animated.Value(0.6)).current;
  const opacidade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(escala,    { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
      Animated.timing(opacidade, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
  }, []);

  // countdown apenas quando destravando
  useEffect(() => {
    if (!destravando) return;
    const id = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(id);
          router.replace('/(tabs)');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  function irParaHome() {
    router.replace('/(tabs)');
  }

  const cor     = destravando ? COR_LARANJA : COR_VERDE;
  const corSoft = destravando ? 'rgba(232,151,26,0.14)' : 'rgba(44,184,117,0.14)';
  const itens   = destravando ? ITENS_DESTRAVADO : ITENS_TRAVADO;

  const headerTitulo    = destravando ? 'Veículo destravado' : 'Veículo travado';
  const tituloPrincipal = destravando ? 'Portas destravadas' : 'Tudo trancado';
  const subtitulo = destravando
    ? `Você tem ${countdown} segundo${countdown !== 1 ? 's' : ''} para entrar antes do auto-travamento ser reativado.`
    : `Portas, porta-malas e janelas confirmados. Alarme armado às ${horaTravo}.`;
  const labelBotao = destravando ? 'Travar agora' : 'Concluído';
  const corBotao   = destravando ? COR_VERDE : COR_VERDE;

  return (
    <View style={estilos.tela}>
      <StatusBar style="light" />

      {/* header */}
      <SafeAreaView edges={['top']} style={estilos.header}>
        <Pressable
          onPress={irParaHome}
          style={({ pressed }) => [estilos.headerBtn, pressed && estilos.headerBtnPressed]}
        >
          <Text style={estilos.fecharX}>✕</Text>
        </Pressable>
        <Text style={estilos.headerTitulo}>{headerTitulo}</Text>
        <View style={{ width: 40 }} />
      </SafeAreaView>

      {/* corpo */}
      <View style={estilos.corpo}>
        {/* ícone + textos */}
        <View style={estilos.iconeCentro}>
          <Animated.View style={[estilos.iconeWrap, { transform: [{ scale: escala }], opacity: opacidade }]}>
            <View style={[estilos.iconeArea, { backgroundColor: corSoft }]}>
              {destravando
                ? <UnlockIcon size={72} color={cor} />
                : <LockIcon   size={72} color={cor} />
              }
            </View>
            <View style={[estilos.checkBadge, { backgroundColor: cor }]}>
              <CheckIcon size={16} color="#fff" />
            </View>
          </Animated.View>

          <Text style={estilos.tituloPrincipal}>{tituloPrincipal}</Text>
          <Text style={estilos.subtitulo}>{subtitulo}</Text>
        </View>

        {/* info card */}
        <View style={estilos.infoCard}>
          <View style={estilos.infoGrid}>
            <View style={estilos.infoColuna}>
              {[itens[0], itens[2]].map(item => (
                <InfoItem key={item.label} label={item.label} valor={item.valor} cor={cor} />
              ))}
            </View>
            <View style={estilos.infoDivisor} />
            <View style={estilos.infoColuna}>
              {[itens[1], itens[3]].map(item => (
                <InfoItem key={item.label} label={item.label} valor={item.valor} cor={cor} />
              ))}
            </View>
          </View>
        </View>

        {/* botão único — direcional */}
        <Pressable
          onPress={irParaHome}
          style={({ pressed }) => [
            estilos.botao,
            { backgroundColor: corBotao },
            pressed && estilos.botaoPressed,
          ]}
        >
          <Text style={estilos.botaoTexto}>{labelBotao}</Text>
        </Pressable>

        <SafeAreaView edges={['bottom']} />
      </View>
    </View>
  );
}

function InfoItem({ label, valor, cor }: { label: string; valor: string; cor: string }) {
  return (
    <View style={estilos.infoItem}>
      <View style={estilos.infoItemTopo}>
        <View style={[estilos.dot, { backgroundColor: cor }]} />
        <Text style={estilos.infoLabel}>{label}</Text>
      </View>
      <Text style={estilos.infoValor}>{valor}</Text>
    </View>
  );
}

// ─── estilos ──────────────────────────────────────────────────
const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: colors.bg,
  },
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
  corpo: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[4],
    justifyContent: 'space-between',
  },
  iconeCentro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[5],
  },
  iconeWrap: {
    alignItems: 'center',
  },
  iconeArea: {
    width: 120,
    height: 120,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadge: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.bg,
  },
  tituloPrincipal: {
    fontSize: typography.size['4xl'],
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitulo: {
    fontSize: typography.size.base,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: Math.round(typography.size.base * 1.55),
    paddingHorizontal: spacing[4],
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius['2xl'],
    padding: spacing[5],
    marginBottom: spacing[4],
  },
  infoGrid: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  infoColuna: {
    flex: 1,
    gap: spacing[5],
  },
  infoDivisor: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing[1],
  },
  infoItem: {
    gap: spacing[1],
  },
  infoItemTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  infoLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    letterSpacing: 1,
  },
  infoValor: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
    paddingLeft: spacing[4],
  },
  botao: {
    height: 56,
    borderRadius: radius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  botaoPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  botaoTexto: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: '#0A0F1A',
  },
});
