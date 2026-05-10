import React, { useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, ScrollView, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { radius } from '../constants/radius';

// ─── dados mockados ───────────────────────────────────────────
const DIAS_SEMANA = [
  { letra: 'S', num: 12 },
  { letra: 'T', num: 13 },
  { letra: 'Q', num: 14 },
  { letra: 'Q', num: 15 },
  { letra: 'S', num: 16 },
  { letra: 'S', num: 17 },
  { letra: 'D', num: 18 },
];

const DIAS_ATIVOS_INICIAL = new Set([12, 13, 14, 15, 16]);

interface Opcao {
  id: string;
  titulo: string;
  subtitulo: string;
  ativo: boolean;
}

const OPCOES_INICIAL: Opcao[] = [
  { id: 'clima',     titulo: 'Climatização automática',    subtitulo: 'Pré-aquece a cabine',   ativo: true  },
  { id: 'desemb',    titulo: 'Desembaçar para-brisa',      subtitulo: 'Ativado em <5°C',       ativo: true  },
  { id: 'banco',     titulo: 'Banco do motorista aquecido', subtitulo: 'Nível 2',              ativo: false },
  { id: 'notificar', titulo: 'Notificar quando pronto',    subtitulo: 'Push + SMS',            ativo: true  },
];

interface Agendamento {
  id: string;
  hora: string;
  label: string;
  ativo: boolean;
}

const OUTROS_INICIAL: Agendamento[] = [
  { id: 'motor', hora: '07:30', label: 'Ligar o motor · Dias úteis',  ativo: true  },
  { id: 'clima', hora: '08:00', label: 'Climatização automática',     ativo: false },
];

// ─── tela ─────────────────────────────────────────────────────
export default function TelaAgendar() {
  const router = useRouter();
  const [diasAtivos, setDiasAtivos] = useState(new Set(DIAS_ATIVOS_INICIAL));
  const [opcoes, setOpcoes] = useState(OPCOES_INICIAL);
  const [outros, setOutros] = useState(OUTROS_INICIAL);

  function toggleDia(num: number) {
    setDiasAtivos(prev => {
      const next = new Set(prev);
      next.has(num) ? next.delete(num) : next.add(num);
      return next;
    });
  }

  function toggleOpcao(id: string) {
    setOpcoes(prev => prev.map(o => o.id === id ? { ...o, ativo: !o.ativo } : o));
  }

  function toggleOutro(id: string) {
    setOutros(prev => prev.map(a => a.id === id ? { ...a, ativo: !a.ativo } : a));
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
          <Text style={estilos.fecharX}>✕</Text>
        </Pressable>
        <Text style={estilos.headerTitulo}>Agendar</Text>
        <Pressable style={({ pressed }) => [estilos.headerBtnPlus, pressed && estilos.headerBtnPlusPressed]}>
          <Text style={estilos.plusTexto}>+</Text>
        </Pressable>
      </SafeAreaView>

      <ScrollView contentContainerStyle={estilos.scroll} showsVerticalScrollIndicator={false}>

        {/* próxima partida */}
        <View style={estilos.proximaSecao}>
          <Text style={estilos.proximaLabel}>Próxima partida</Text>
          <View style={estilos.proximaHoraRow}>
            <Text style={estilos.proximaHora}>07:30</Text>
            <Text style={estilos.proximaDia}>Seg.</Text>
          </View>
          <Text style={estilos.proximaInfo}>em 16h 50min · pré-aquecimento incluído</Text>
        </View>

        {/* seletor de dias */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={estilos.diasContainer}
        >
          {DIAS_SEMANA.map(dia => {
            const ativo = diasAtivos.has(dia.num);
            return (
              <Pressable
                key={dia.num}
                onPress={() => toggleDia(dia.num)}
                style={[estilos.diaBotao, ativo && estilos.diaBotaoAtivo]}
              >
                <Text style={[estilos.diaLetra, ativo && estilos.diaTextoAtivo]}>{dia.letra}</Text>
                <Text style={[estilos.diaNum, ativo && estilos.diaTextoAtivo]}>{dia.num}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* card de stats */}
        <View style={estilos.statsCard}>
          <View style={estilos.statItem}>
            <Text style={estilos.statLabel}>HORÁRIO</Text>
            <Text style={estilos.statValor}>07:30</Text>
          </View>
          <View style={estilos.statDivisor} />
          <View style={estilos.statItem}>
            <Text style={estilos.statLabel}>DURAÇÃO</Text>
            <Text style={estilos.statValor}>10 min</Text>
          </View>
          <View style={estilos.statDivisor} />
          <View style={estilos.statItem}>
            <Text style={estilos.statLabel}>ALVO</Text>
            <Text style={estilos.statValor}>22°C</Text>
          </View>
        </View>

        {/* opções */}
        <Text style={estilos.secaoTitulo}>OPÇÕES</Text>
        <View style={estilos.opcoesCard}>
          {opcoes.map((opcao, idx) => (
            <View
              key={opcao.id}
              style={[estilos.opcaoRow, idx < opcoes.length - 1 && estilos.opcaoRowBorder]}
            >
              <View style={estilos.opcaoTextos}>
                <Text style={estilos.opcaoTitulo}>{opcao.titulo}</Text>
                <Text style={estilos.opcaoSubtitulo}>{opcao.subtitulo}</Text>
              </View>
              <Switch
                value={opcao.ativo}
                onValueChange={() => toggleOpcao(opcao.id)}
                trackColor={{ false: colors.surfaceHi, true: colors.accent }}
                thumbColor={colors.text}
                ios_backgroundColor={colors.surfaceHi}
              />
            </View>
          ))}
        </View>

        {/* outros agendamentos */}
        <Text style={estilos.secaoTitulo}>OUTROS AGENDAMENTOS</Text>
        <View style={estilos.outrosCard}>
          {outros.map((item, idx) => (
            <View
              key={item.id}
              style={[estilos.outroRow, idx < outros.length - 1 && estilos.outroRowBorder]}
            >
              <Text style={[estilos.outroHora, !item.ativo && estilos.outroHoraInativo]}>
                {item.hora}
              </Text>
              <Text style={[estilos.outroLabel, !item.ativo && estilos.outroLabelInativo]} numberOfLines={1}>
                {item.label}
              </Text>
              <Switch
                value={item.ativo}
                onValueChange={() => toggleOutro(item.id)}
                trackColor={{ false: colors.surfaceHi, true: colors.accent }}
                thumbColor={colors.text}
                ios_backgroundColor={colors.surfaceHi}
              />
            </View>
          ))}
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
  headerBtnPlus: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnPlusPressed: {
    opacity: 0.6,
  },
  plusTexto: {
    fontSize: 26,
    color: colors.accent,
    fontFamily: 'Inter_400Regular',
    lineHeight: 30,
  },

  scroll: {
    flexGrow: 1,
  },

  // próxima partida
  proximaSecao: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
    paddingBottom: spacing[5],
  },
  proximaLabel: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
    marginBottom: spacing[2],
    letterSpacing: 0.2,
  },
  proximaHoraRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing[3],
    marginBottom: spacing[2],
  },
  proximaHora: {
    fontSize: 64,
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
    letterSpacing: -2,
    lineHeight: 68,
  },
  proximaDia: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.medium,
    fontFamily: 'Inter_500Medium',
    color: colors.textDim,
    letterSpacing: 0,
  },
  proximaInfo: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 0.1,
  },

  // seletor de dias
  diasContainer: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[5],
    gap: spacing[2],
    flexDirection: 'row',
  },
  diaBotao: {
    width: 54,
    paddingVertical: spacing[3],
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: spacing[1],
  },
  diaBotaoAtivo: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  diaLetra: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  diaNum: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.textDim,
  },
  diaTextoAtivo: {
    color: '#FFFFFF',
  },

  // stats card
  statsCard: {
    marginHorizontal: spacing[6],
    marginBottom: spacing[6],
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  statDivisor: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing[4],
  },
  statLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    letterSpacing: 1,
  },
  statValor: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
    letterSpacing: -0.5,
  },

  // seção
  secaoTitulo: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginHorizontal: spacing[6],
    marginBottom: spacing[3],
  },

  // opções
  opcoesCard: {
    marginHorizontal: spacing[6],
    marginBottom: spacing[6],
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  opcaoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    gap: spacing[4],
  },
  opcaoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  opcaoTextos: {
    flex: 1,
    gap: spacing[1],
  },
  opcaoTitulo: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    fontFamily: 'Inter_500Medium',
    color: colors.text,
  },
  opcaoSubtitulo: {
    fontSize: typography.size.md,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
  },

  // outros agendamentos
  outrosCard: {
    marginHorizontal: spacing[6],
    marginBottom: spacing[4],
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  outroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    gap: spacing[4],
  },
  outroRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  outroHora: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
    minWidth: 64,
    letterSpacing: -0.5,
  },
  outroHoraInativo: {
    color: colors.textMuted,
  },
  outroLabel: {
    flex: 1,
    fontSize: typography.size.base,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
  },
  outroLabelInativo: {
    color: colors.textMuted,
  },
});
