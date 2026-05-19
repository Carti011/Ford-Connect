import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { buscarRecomendacoes } from '../services/recomendacao';
import { listarConcessionarias } from '../services/concessionaria';
import { criarAgendamentoServico } from '../services/agendamentoServico';
import {
  AgendamentoServico,
  Concessionaria,
  PeriodoAgendamento,
  Recomendacao,
} from '../types';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { radius } from '../constants/radius';
import { ChevronLeftIcon, PinIcon } from '../components/icons';

function gerarDatasDisponiveis(): string[] {
  const datas: string[] = [];
  const hoje = new Date();
  let cursor = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);
  while (datas.length < 5) {
    const dia = cursor.getDay();
    // pula domingo
    if (dia !== 0) {
      const yyyy = cursor.getFullYear();
      const mm = String(cursor.getMonth() + 1).padStart(2, '0');
      const dd = String(cursor.getDate()).padStart(2, '0');
      datas.push(`${yyyy}-${mm}-${dd}`);
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return datas;
}

function rotuloData(iso: string): { dia: string; numero: string; mes: string } {
  const data = new Date(iso + 'T12:00:00');
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  return {
    dia: dias[data.getDay()],
    numero: String(data.getDate()).padStart(2, '0'),
    mes: meses[data.getMonth()],
  };
}

function rotuloDataLonga(iso: string): string {
  const data = new Date(iso + 'T12:00:00');
  return data.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
}

export default function TelaAgendarServico() {
  const router = useRouter();
  const { idVeiculo } = useAuth();
  const scrollRef = useRef<ScrollView>(null);

  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([]);
  const [concessionarias, setConcessionarias] = useState<Concessionaria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [confirmacao, setConfirmacao] = useState<AgendamentoServico | null>(null);

  const datasDisponiveis = useMemo(() => gerarDatasDisponiveis(), []);

  const [selecionadas, setSelecionadas] = useState<Set<string>>(new Set());
  const [concessionariaId, setConcessionariaId] = useState<string | null>(null);
  const [dataPreferida, setDataPreferida] = useState<string>(datasDisponiveis[0]);
  const [periodo, setPeriodo] = useState<PeriodoAgendamento>('manha');
  const [observacoes, setObservacoes] = useState('');

  const carregar = useCallback(async () => {
    if (!idVeiculo) return;
    setCarregando(true);
    setErro(null);
    try {
      const [recs, concs] = await Promise.all([
        buscarRecomendacoes(idVeiculo),
        listarConcessionarias(),
      ]);
      setRecomendacoes(recs);
      setConcessionarias(concs);

      // marca obrigatórias por padrão
      const obrig = new Set(recs.filter((r) => r.obrigatoria).map((r) => r.id));
      setSelecionadas(obrig);

      // mais próxima por padrão
      if (concs.length > 0) setConcessionariaId(concs[0].id);
    } catch (e: any) {
      setErro(
        e?.response?.status === 401
          ? 'Sessão expirada. Faça login novamente.'
          : 'Não foi possível carregar os dados.'
      );
    } finally {
      setCarregando(false);
    }
  }, [idVeiculo]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function alternarRecomendacao(id: string) {
    setSelecionadas((atual) => {
      const novo = new Set(atual);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  }

  async function confirmar() {
    if (!idVeiculo || !concessionariaId) return;
    if (selecionadas.size === 0) {
      setErro('Selecione pelo menos um serviço para agendar.');
      return;
    }
    setSalvando(true);
    setErro(null);
    try {
      const resp = await criarAgendamentoServico(idVeiculo, {
        concessionariaId,
        dataPreferida,
        periodo,
        recomendacaoIds: Array.from(selecionadas),
        observacoes: observacoes.trim() || undefined,
      });
      setConfirmacao(resp);
    } catch (e: any) {
      setErro(
        e?.response?.data?.mensagem || 'Não foi possível concluir o agendamento.'
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={estilos.centrado}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (confirmacao) {
    return <TelaConfirmacao agendamento={confirmacao} onFechar={() => router.back()} />;
  }

  return (
    <View style={estilos.tela}>
      <StatusBar style="light" />
      <SafeAreaView edges={['top']} style={estilos.topo}>
        <Pressable onPress={() => router.back()} style={estilos.btnVoltar}>
          <ChevronLeftIcon size={22} color={colors.text} />
        </Pressable>
        <Text style={estilos.tituloTopo}>Agendar serviço</Text>
        <View style={estilos.placeholderTopo} />
      </SafeAreaView>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={estilos.scroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
      >
        {/* serviços */}
        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>Quais serviços incluir?</Text>
          <View style={estilos.lista}>
            {recomendacoes.map((rec) => {
              const ativo = selecionadas.has(rec.id);
              return (
                <Pressable
                  key={rec.id}
                  onPress={() => alternarRecomendacao(rec.id)}
                  style={[estilos.itemServico, ativo && estilos.itemServicoAtivo]}
                >
                  <View style={[estilos.checkbox, ativo && estilos.checkboxAtivo]}>
                    {ativo ? <Text style={estilos.checkboxMarca}>✓</Text> : null}
                  </View>
                  <View style={estilos.itemServicoTextos}>
                    <Text style={estilos.itemServicoTitulo}>{rec.titulo}</Text>
                    <Text style={estilos.itemServicoSub}>
                      {rec.obrigatoria ? 'Obrigatória · ' : 'Opcional · '}
                      {rec.custoMin != null && rec.custoMax != null
                        ? `R$ ${rec.custoMin} a R$ ${rec.custoMax}`
                        : 'Sob consulta'}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* concessionária */}
        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>Onde fazer?</Text>
          <View style={estilos.lista}>
            {concessionarias.map((c) => {
              const ativo = c.id === concessionariaId;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setConcessionariaId(c.id)}
                  style={[estilos.itemConcessionaria, ativo && estilos.itemConcessionariaAtivo]}
                >
                  <View style={estilos.itemConcessionariaCabecalho}>
                    <View style={estilos.iconeConcessionaria}>
                      <PinIcon size={16} color={ativo ? colors.accent : colors.textDim} />
                    </View>
                    <Text style={estilos.itemConcessionariaNome}>{c.nome}</Text>
                    <Text style={estilos.itemConcessionariaDist}>{c.distanciaKm} km</Text>
                  </View>
                  <Text style={estilos.itemConcessionariaEndereco}>
                    {c.endereco} · {c.cidade}/{c.estado}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* data */}
        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>Quando?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.datasRow}>
            {datasDisponiveis.map((iso) => {
              const ativo = iso === dataPreferida;
              const r = rotuloData(iso);
              return (
                <Pressable
                  key={iso}
                  onPress={() => setDataPreferida(iso)}
                  style={[estilos.cardData, ativo && estilos.cardDataAtivo]}
                >
                  <Text style={[estilos.cardDataDia, ativo && estilos.cardDataAtivoTexto]}>{r.dia}</Text>
                  <Text style={[estilos.cardDataNumero, ativo && estilos.cardDataAtivoTexto]}>{r.numero}</Text>
                  <Text style={[estilos.cardDataMes, ativo && estilos.cardDataAtivoTexto]}>{r.mes}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* período */}
        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>Período</Text>
          <View style={estilos.periodoRow}>
            <Pressable
              onPress={() => setPeriodo('manha')}
              style={[estilos.botaoPeriodo, periodo === 'manha' && estilos.botaoPeriodoAtivo]}
            >
              <Text style={[estilos.botaoPeriodoTexto, periodo === 'manha' && estilos.botaoPeriodoAtivoTexto]}>
                Manhã
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setPeriodo('tarde')}
              style={[estilos.botaoPeriodo, periodo === 'tarde' && estilos.botaoPeriodoAtivo]}
            >
              <Text style={[estilos.botaoPeriodoTexto, periodo === 'tarde' && estilos.botaoPeriodoAtivoTexto]}>
                Tarde
              </Text>
            </Pressable>
          </View>
        </View>

        {/* observações */}
        <View style={estilos.secao}>
          <Text style={estilos.tituloSecao}>Observações (opcional)</Text>
          <TextInput
            value={observacoes}
            onChangeText={setObservacoes}
            multiline
            placeholder="Ex: trazer carro com tanque cheio"
            placeholderTextColor={colors.textMuted}
            style={estilos.textInput}
            onFocus={() => {
              setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
            }}
          />
        </View>

        {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

        <Pressable
          onPress={confirmar}
          disabled={salvando}
          style={({ pressed }) => [
            estilos.botaoConfirmar,
            pressed && estilos.botaoConfirmarPressed,
            salvando && estilos.botaoConfirmarDesabilitado,
          ]}
        >
          {salvando ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={estilos.botaoConfirmarTexto}>Confirmar agendamento</Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

function TelaConfirmacao({
  agendamento,
  onFechar,
}: {
  agendamento: AgendamentoServico;
  onFechar: () => void;
}) {
  const periodoLabel = agendamento.periodo === 'manha' ? 'Manhã' : 'Tarde';
  return (
    <View style={estilos.tela}>
      <StatusBar style="light" />
      <SafeAreaView edges={['top']} style={estilos.topo}>
        <View style={estilos.placeholderTopo} />
        <Text style={estilos.tituloTopo}>Agendamento confirmado</Text>
        <View style={estilos.placeholderTopo} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={estilos.scroll}>
        <View style={estilos.confirmacaoBox}>
          <Text style={estilos.confirmacaoTitulo}>Tudo certo!</Text>
          <Text style={estilos.confirmacaoSub}>
            Sua solicitação foi registrada. A concessionária entrará em contato em breve.
          </Text>
        </View>

        <View style={estilos.resumo}>
          <View style={estilos.resumoLinha}>
            <Text style={estilos.resumoChave}>Concessionária</Text>
            <Text style={estilos.resumoValor}>{agendamento.concessionaria.nome}</Text>
          </View>
          <View style={estilos.resumoLinha}>
            <Text style={estilos.resumoChave}>Endereço</Text>
            <Text style={estilos.resumoValor}>
              {agendamento.concessionaria.endereco} · {agendamento.concessionaria.cidade}/{agendamento.concessionaria.estado}
            </Text>
          </View>
          <View style={estilos.resumoLinha}>
            <Text style={estilos.resumoChave}>Data</Text>
            <Text style={estilos.resumoValor}>{rotuloDataLonga(agendamento.dataPreferida)}</Text>
          </View>
          <View style={estilos.resumoLinha}>
            <Text style={estilos.resumoChave}>Período</Text>
            <Text style={estilos.resumoValor}>{periodoLabel}</Text>
          </View>
          <View style={estilos.resumoLinha}>
            <Text style={estilos.resumoChave}>Serviços incluídos</Text>
            <View style={{ flex: 1 }}>
              {agendamento.recomendacoes.map((r) => (
                <Text key={r.id} style={estilos.resumoValor}>• {r.titulo}</Text>
              ))}
            </View>
          </View>
          {agendamento.observacoes ? (
            <View style={estilos.resumoLinha}>
              <Text style={estilos.resumoChave}>Observações</Text>
              <Text style={estilos.resumoValor}>{agendamento.observacoes}</Text>
            </View>
          ) : null}
        </View>

        <Pressable onPress={onFechar} style={estilos.botaoConfirmar}>
          <Text style={estilos.botaoConfirmarTexto}>Voltar para o início</Text>
        </Pressable>
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
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
    paddingBottom: spacing[3],
  },
  btnVoltar: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceHi,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderTopo: {
    width: 40,
    height: 40,
  },
  tituloTopo: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },
  scroll: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[8] ?? 40,
    gap: spacing[5],
  },
  secao: {
    gap: spacing[3],
  },
  tituloSecao: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },
  lista: {
    gap: spacing[2],
  },

  // serviços
  itemServico: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing[3],
    gap: spacing[3],
  },
  itemServicoAtivo: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  itemServicoTextos: {
    flex: 1,
    gap: 2,
  },
  itemServicoTitulo: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },
  itemServicoSub: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxAtivo: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkboxMarca: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },

  // concessionárias
  itemConcessionaria: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing[3],
    gap: spacing[2],
  },
  itemConcessionariaAtivo: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  itemConcessionariaCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  iconeConcessionaria: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceHi,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemConcessionariaNome: {
    flex: 1,
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },
  itemConcessionariaDist: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
  },
  itemConcessionariaEndereco: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
  },

  // data
  datasRow: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingVertical: spacing[1],
  },
  cardData: {
    width: 70,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 2,
  },
  cardDataAtivo: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  cardDataDia: {
    fontSize: typography.size.xs,
    color: colors.textDim,
    fontFamily: 'Inter_500Medium',
    textTransform: 'uppercase',
  },
  cardDataNumero: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
  },
  cardDataMes: {
    fontSize: typography.size.xs,
    color: colors.textDim,
    fontFamily: 'Inter_500Medium',
  },
  cardDataAtivoTexto: {
    color: colors.text,
  },

  // período
  periodoRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  botaoPeriodo: {
    flex: 1,
    paddingVertical: spacing[3],
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  botaoPeriodoAtivo: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  botaoPeriodoTexto: {
    fontSize: typography.size.base,
    color: colors.textDim,
    fontFamily: 'Inter_500Medium',
  },
  botaoPeriodoAtivoTexto: {
    color: colors.text,
  },

  // textarea
  textInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing[3],
    color: colors.text,
    fontFamily: 'Inter_400Regular',
    fontSize: typography.size.sm,
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // erro / botão
  erro: {
    color: colors.danger,
    fontSize: typography.size.sm,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  botaoConfirmar: {
    backgroundColor: colors.accent,
    paddingVertical: spacing[4],
    borderRadius: radius.md,
    alignItems: 'center',
  },
  botaoConfirmarPressed: {
    backgroundColor: colors.accentPressed,
  },
  botaoConfirmarDesabilitado: {
    opacity: 0.6,
  },
  botaoConfirmarTexto: {
    color: colors.text,
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
  },

  // confirmação
  confirmacaoBox: {
    backgroundColor: colors.okSoft,
    padding: spacing[5],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.ok,
    alignItems: 'center',
    gap: spacing[2],
  },
  confirmacaoTitulo: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
  },
  confirmacaoSub: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  resumo: {
    backgroundColor: colors.surface,
    padding: spacing[4],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing[3],
  },
  resumoLinha: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  resumoChave: {
    width: 120,
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
  },
  resumoValor: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.text,
    fontFamily: 'Inter_500Medium',
  },
});
