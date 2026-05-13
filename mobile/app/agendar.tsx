import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, Pressable, StyleSheet, ScrollView, Switch, ActivityIndicator, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { radius } from '../constants/radius';
import { useAuth } from '../hooks/useAuth';
import { buscarAgendamentos, alternarAtivo, atualizarAgendamento } from '../services/agendamento';
import { buscarVeiculo, atualizarPreferencias } from '../services/veiculo';
import { calcularProximaPartida } from '../utils/proximaPartida';
import { AgendamentoVeiculo, PreferenciasVeiculo, Veiculo } from '../types';

// ─── opções (mapeadas para preferências do veículo) ───────────
type ChavePref = 'climatizacaoAutomatica' | 'desembacarParabrisa' | 'bancoAquecido' | 'notificar';

const OPCOES_META: { chave: ChavePref; titulo: string; subtitulo: string }[] = [
  { chave: 'climatizacaoAutomatica', titulo: 'Climatização automática',    subtitulo: 'Pré-aquece a cabine' },
  { chave: 'desembacarParabrisa',    titulo: 'Desembaçar para-brisa',      subtitulo: 'Ativado em <5°C'     },
  { chave: 'bancoAquecido',          titulo: 'Banco do motorista aquecido', subtitulo: 'Nível 2'             },
  { chave: 'notificar',              titulo: 'Notificar quando pronto',    subtitulo: 'Push + SMS'          },
];

const DIAS_SEMANA = [
  { num: 0, letra: 'D', abrev: 'Dom' },
  { num: 1, letra: 'S', abrev: 'Seg' },
  { num: 2, letra: 'T', abrev: 'Ter' },
  { num: 3, letra: 'Q', abrev: 'Qua' },
  { num: 4, letra: 'Q', abrev: 'Qui' },
  { num: 5, letra: 'S', abrev: 'Sex' },
  { num: 6, letra: 'S', abrev: 'Sáb' },
];

const OPCOES_DURACAO = [5, 10, 15, 20, 30, 45, 60];
const OPCOES_ALVO = Array.from({ length: 13 }, (_, i) => 18 + i); // 18..30
const OPCOES_HORA = Array.from({ length: 24 }, (_, i) => i); // 0..23
const OPCOES_MINUTO = Array.from({ length: 12 }, (_, i) => i * 5); // 0,5,10,...,55

function parseDias(diasSemana: string | null): Set<number> {
  if (!diasSemana) return new Set();
  return new Set(diasSemana.split(',').map(Number));
}

function formatarDias(dias: Set<number>): string {
  return Array.from(dias).sort((a, b) => a - b).join(',');
}

function parseHora(hora: string): { h: number; m: number } {
  const [h, m] = hora.split(':').map(Number);
  return { h, m };
}

function formatarHora(h: number, m: number): string {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

type ModalEstado =
  | { tipo: 'duracao' }
  | { tipo: 'alvo' }
  | { tipo: 'horaMotor' }
  | { tipo: 'horaOutro'; agendamentoId: string };

// ─── tela ─────────────────────────────────────────────────────
export default function TelaAgendar() {
  const router = useRouter();
  const { idVeiculo } = useAuth();

  const [agendamentos, setAgendamentos] = useState<AgendamentoVeiculo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [horaEditada, setHoraEditada] = useState('07:30');
  const [diasSelecionados, setDiasSelecionados] = useState<Set<number>>(new Set([1, 2, 3, 4, 5]));
  const [duracaoMinutos, setDuracaoMinutos] = useState(10);
  const [alvoTemperatura, setAlvoTemperatura] = useState(22);
  const [modal, setModal] = useState<ModalEstado | null>(null);
  const [horaTemp, setHoraTemp] = useState({ h: 7, m: 30 });

  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);

  const agendamentoMotor = agendamentos.find(a => a.tipo === 'motor');
  const outrosAgendamentos = agendamentos.filter(a => a.tipo !== 'motor');
  const proximaPartida = calcularProximaPartida(agendamentos);

  const carregar = useCallback(async () => {
    if (!idVeiculo) return;
    try {
      const [dadosAgendamentos, dadosVeiculo] = await Promise.all([
        buscarAgendamentos(idVeiculo),
        buscarVeiculo(idVeiculo),
      ]);
      setAgendamentos(dadosAgendamentos);
      setVeiculo(dadosVeiculo);
      const motor = dadosAgendamentos.find(a => a.tipo === 'motor');
      if (motor?.hora) setHoraEditada(motor.hora);
      if (motor?.diasSemana) setDiasSelecionados(parseDias(motor.diasSemana));
      if (motor?.duracaoMinutos != null) setDuracaoMinutos(motor.duracaoMinutos);
      if (motor?.alvoTemperatura != null) setAlvoTemperatura(motor.alvoTemperatura);
    } finally {
      setCarregando(false);
    }
  }, [idVeiculo]);

  useEffect(() => { carregar(); }, [carregar]);

  function abrirModalHoraMotor() {
    setHoraTemp(parseHora(horaEditada));
    setModal({ tipo: 'horaMotor' });
  }

  function abrirModalHoraOutro(item: AgendamentoVeiculo) {
    if (!item.hora) return;
    setHoraTemp(parseHora(item.hora));
    setModal({ tipo: 'horaOutro', agendamentoId: item.id });
  }

  function confirmarHora() {
    if (!modal) return;
    const novaHora = formatarHora(horaTemp.h, horaTemp.m);
    if (modal.tipo === 'horaMotor') {
      setHoraEditada(novaHora);
      setModal(null);
      return;
    }
    if (modal.tipo === 'horaOutro') {
      const id = modal.agendamentoId;
      const anterior = agendamentos.find(a => a.id === id);
      setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, hora: novaHora } : a));
      setModal(null);
      atualizarAgendamento(id, { hora: novaHora })
        .then(atualizado => {
          setAgendamentos(prev => prev.map(a => a.id === atualizado.id ? atualizado : a));
        })
        .catch(() => {
          if (anterior) {
            setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, hora: anterior.hora } : a));
          }
        });
    }
  }

  async function salvar() {
    if (!agendamentoMotor) return;
    setSalvando(true);
    try {
      const atualizado = await atualizarAgendamento(agendamentoMotor.id, {
        hora: horaEditada,
        diasSemana: formatarDias(diasSelecionados),
        duracaoMinutos,
        alvoTemperatura,
      });
      setAgendamentos(prev => prev.map(a => a.id === atualizado.id ? atualizado : a));
      router.back();
    } finally {
      setSalvando(false);
    }
  }

  async function toggleOutro(id: string) {
    setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, ativo: !a.ativo } : a));
    try {
      const atualizado = await alternarAtivo(id);
      setAgendamentos(prev => prev.map(a => a.id === atualizado.id ? atualizado : a));
    } catch {
      setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, ativo: !a.ativo } : a));
    }
  }

  async function togglePreferencia(chave: ChavePref) {
    if (!veiculo) return;
    const novoValor = !veiculo[chave];
    setVeiculo(prev => prev ? { ...prev, [chave]: novoValor } : prev);
    const patch: PreferenciasVeiculo = { [chave]: novoValor };
    try {
      const atualizado = await atualizarPreferencias(veiculo.id, patch);
      setVeiculo(atualizado);
    } catch {
      setVeiculo(prev => prev ? { ...prev, [chave]: !novoValor } : prev);
    }
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
        <Pressable
          onPress={salvar}
          disabled={salvando || !agendamentoMotor}
          style={({ pressed }) => [estilos.salvarBtn, pressed && estilos.salvarBtnPressed]}
        >
          <Text style={estilos.salvarTexto}>{salvando ? '...' : 'Salvar'}</Text>
        </Pressable>
      </SafeAreaView>

      {carregando ? (
        <View style={estilos.loadingContainer}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={estilos.scroll} showsVerticalScrollIndicator={false}>

          {/* próxima partida */}
          <View style={estilos.proximaSecao}>
            <Text style={estilos.proximaLabel}>Próxima partida</Text>
            {proximaPartida ? (
              <>
                <View style={estilos.proximaHoraRow}>
                  <Text style={estilos.proximaHora}>{proximaPartida.hora}</Text>
                  <Text style={estilos.proximaDia}>{proximaPartida.dia}</Text>
                </View>
                <Text style={estilos.proximaInfo}>pré-aquecimento incluído</Text>
              </>
            ) : (
              <Text style={estilos.proximaInfo}>Nenhum agendamento ativo</Text>
            )}
          </View>

          {/* seletor de dias da semana */}
          <View style={estilos.diasContainer}>
            {DIAS_SEMANA.map(dia => {
              const ativo = diasSelecionados.has(dia.num);
              return (
                <Pressable
                  key={dia.num}
                  onPress={() => {
                    setDiasSelecionados(prev => {
                      const next = new Set(prev);
                      next.has(dia.num) ? next.delete(dia.num) : next.add(dia.num);
                      return next;
                    });
                  }}
                  style={[estilos.diaBotao, ativo && estilos.diaBotaoAtivo]}
                >
                  <Text style={[estilos.diaLetra, ativo && estilos.diaTextoAtivo]}>{dia.abrev}</Text>
                  <Text style={[estilos.diaNum, ativo && estilos.diaTextoAtivo]}>{dia.letra}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* card de stats */}
          <View style={estilos.statsCard}>
            <Pressable
              style={({ pressed }) => [estilos.statItem, pressed && estilos.statItemPressed]}
              onPress={abrirModalHoraMotor}
            >
              <Text style={estilos.statLabel}>HORÁRIO</Text>
              <Text style={estilos.statValor}>{horaEditada}</Text>
            </Pressable>
            <View style={estilos.statDivisor} />
            <Pressable
              style={({ pressed }) => [estilos.statItem, pressed && estilos.statItemPressed]}
              onPress={() => setModal({ tipo: 'duracao' })}
            >
              <Text style={estilos.statLabel}>DURAÇÃO</Text>
              <Text style={estilos.statValor}>{duracaoMinutos} min</Text>
            </Pressable>
            <View style={estilos.statDivisor} />
            <Pressable
              style={({ pressed }) => [estilos.statItem, pressed && estilos.statItemPressed]}
              onPress={() => setModal({ tipo: 'alvo' })}
            >
              <Text style={estilos.statLabel}>ALVO</Text>
              <Text style={estilos.statValor}>{alvoTemperatura}°C</Text>
            </Pressable>
          </View>

          <Modal visible={modal !== null} transparent animationType="fade" onRequestClose={() => setModal(null)}>
            <Pressable style={estilos.modalOverlay} onPress={() => setModal(null)}>
              <Pressable style={estilos.modalCard} onPress={(e) => e.stopPropagation()}>
                <Text style={estilos.modalTitulo}>
                  {modal?.tipo === 'duracao' && 'Duração'}
                  {modal?.tipo === 'alvo' && 'Alvo de temperatura'}
                  {(modal?.tipo === 'horaMotor' || modal?.tipo === 'horaOutro') && 'Horário'}
                </Text>

                {(modal?.tipo === 'duracao' || modal?.tipo === 'alvo') && (
                  <ScrollView style={estilos.modalLista}>
                    {(modal.tipo === 'duracao' ? OPCOES_DURACAO : OPCOES_ALVO).map(valor => {
                      const selecionado = modal.tipo === 'duracao'
                        ? valor === duracaoMinutos
                        : valor === alvoTemperatura;
                      const sufixo = modal.tipo === 'duracao' ? ' min' : '°C';
                      return (
                        <Pressable
                          key={valor}
                          onPress={() => {
                            if (modal.tipo === 'duracao') setDuracaoMinutos(valor);
                            else setAlvoTemperatura(valor);
                            setModal(null);
                          }}
                          style={({ pressed }) => [
                            estilos.modalOpcao,
                            selecionado && estilos.modalOpcaoSelecionada,
                            pressed && estilos.modalOpcaoPressed,
                          ]}
                        >
                          <Text style={[estilos.modalOpcaoTexto, selecionado && estilos.modalOpcaoTextoSelecionado]}>
                            {valor}{sufixo}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                )}

                {(modal?.tipo === 'horaMotor' || modal?.tipo === 'horaOutro') && (
                  <>
                    <View style={estilos.horaColunas}>
                      <View style={estilos.horaColuna}>
                        <Text style={estilos.horaColunaLabel}>HORA</Text>
                        <ScrollView style={estilos.horaColunaLista} showsVerticalScrollIndicator={false}>
                          {OPCOES_HORA.map(h => {
                            const selecionado = h === horaTemp.h;
                            return (
                              <Pressable
                                key={h}
                                onPress={() => setHoraTemp(prev => ({ ...prev, h }))}
                                style={({ pressed }) => [
                                  estilos.modalOpcao,
                                  selecionado && estilos.modalOpcaoSelecionada,
                                  pressed && estilos.modalOpcaoPressed,
                                ]}
                              >
                                <Text style={[estilos.modalOpcaoTexto, selecionado && estilos.modalOpcaoTextoSelecionado]}>
                                  {String(h).padStart(2, '0')}
                                </Text>
                              </Pressable>
                            );
                          })}
                        </ScrollView>
                      </View>

                      <View style={estilos.horaColunaDivisor} />

                      <View style={estilos.horaColuna}>
                        <Text style={estilos.horaColunaLabel}>MIN</Text>
                        <ScrollView style={estilos.horaColunaLista} showsVerticalScrollIndicator={false}>
                          {OPCOES_MINUTO.map(m => {
                            const selecionado = m === horaTemp.m;
                            return (
                              <Pressable
                                key={m}
                                onPress={() => setHoraTemp(prev => ({ ...prev, m }))}
                                style={({ pressed }) => [
                                  estilos.modalOpcao,
                                  selecionado && estilos.modalOpcaoSelecionada,
                                  pressed && estilos.modalOpcaoPressed,
                                ]}
                              >
                                <Text style={[estilos.modalOpcaoTexto, selecionado && estilos.modalOpcaoTextoSelecionado]}>
                                  {String(m).padStart(2, '0')}
                                </Text>
                              </Pressable>
                            );
                          })}
                        </ScrollView>
                      </View>
                    </View>

                    <Pressable
                      onPress={confirmarHora}
                      style={({ pressed }) => [estilos.modalConfirmarBtn, pressed && estilos.modalConfirmarBtnPressed]}
                    >
                      <Text style={estilos.modalConfirmarTexto}>Confirmar</Text>
                    </Pressable>
                  </>
                )}
              </Pressable>
            </Pressable>
          </Modal>

          {/* opções — preferências do veículo */}
          {veiculo && (
            <>
              <Text style={estilos.secaoTitulo}>OPÇÕES</Text>
              <View style={estilos.opcoesCard}>
                {OPCOES_META.map((meta, idx) => (
                  <View
                    key={meta.chave}
                    style={[estilos.opcaoRow, idx < OPCOES_META.length - 1 && estilos.opcaoRowBorder]}
                  >
                    <View style={estilos.opcaoTextos}>
                      <Text style={estilos.opcaoTitulo}>{meta.titulo}</Text>
                      <Text style={estilos.opcaoSubtitulo}>{meta.subtitulo}</Text>
                    </View>
                    <Switch
                      value={veiculo[meta.chave]}
                      onValueChange={() => togglePreferencia(meta.chave)}
                      trackColor={{ false: colors.surfaceHi, true: colors.accent }}
                      thumbColor={colors.text}
                      ios_backgroundColor={colors.surfaceHi}
                    />
                  </View>
                ))}
              </View>
            </>
          )}

          {/* outros agendamentos */}
          {outrosAgendamentos.length > 0 && (
            <>
              <Text style={estilos.secaoTitulo}>OUTROS AGENDAMENTOS</Text>
              <View style={estilos.outrosCard}>
                {outrosAgendamentos.map((item, idx) => (
                  <View
                    key={item.id}
                    style={[estilos.outroRow, idx < outrosAgendamentos.length - 1 && estilos.outroRowBorder]}
                  >
                    <Pressable
                      onPress={() => abrirModalHoraOutro(item)}
                      disabled={!item.hora}
                      style={({ pressed }) => [estilos.outroHoraBotao, pressed && estilos.outroHoraBotaoPressed]}
                    >
                      <Text style={[estilos.outroHora, !item.ativo && estilos.outroHoraInativo]}>
                        {item.hora ?? '--:--'}
                      </Text>
                    </Pressable>
                    <Text style={[estilos.outroLabel, !item.ativo && estilos.outroLabelInativo]} numberOfLines={1}>
                      {item.rotulo}
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
            </>
          )}

          <View style={{ height: spacing[10] }} />
        </ScrollView>
      )}
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
  fecharX: {
    fontSize: 16,
    color: colors.text,
    fontFamily: 'Inter_400Regular',
  },
  salvarBtn: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radius.md,
    backgroundColor: colors.accent,
  },
  salvarBtnPressed: {
    opacity: 0.7,
  },
  salvarTexto: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    letterSpacing: 0.1,
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
    flexDirection: 'row',
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[5],
    gap: spacing[2],
    justifyContent: 'space-between',
  },
  diaBotao: {
    flex: 1,
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
    letterSpacing: 0.3,
  },
  diaNum: {
    fontSize: typography.size.lg,
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
  statItemPressed: {
    backgroundColor: colors.surfaceHi,
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
  outroHoraBotao: {
    paddingVertical: spacing[1],
    paddingRight: spacing[2],
  },
  outroHoraBotaoPressed: {
    opacity: 0.6,
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

  // modal seletor
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
  },
  modalCard: {
    width: '100%',
    maxHeight: '70%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[5],
  },
  modalTitulo: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
    marginBottom: spacing[4],
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  modalLista: {
    flexGrow: 0,
  },
  modalOpcao: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: radius.md,
    marginBottom: spacing[1],
  },
  modalOpcaoSelecionada: {
    backgroundColor: colors.accent,
  },
  modalOpcaoPressed: {
    opacity: 0.7,
  },
  modalOpcaoTexto: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
    fontFamily: 'Inter_500Medium',
    color: colors.text,
    textAlign: 'center',
  },
  modalOpcaoTextoSelecionado: {
    color: '#FFFFFF',
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
  },

  // picker de hora — colunas hora|min
  horaColunas: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: 220,
  },
  horaColuna: {
    flex: 1,
    paddingHorizontal: spacing[2],
  },
  horaColunaLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  horaColunaLista: {
    flexGrow: 1,
  },
  horaColunaDivisor: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing[2],
  },
  modalConfirmarBtn: {
    marginTop: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
  },
  modalConfirmarBtnPressed: {
    opacity: 0.7,
  },
  modalConfirmarTexto: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
