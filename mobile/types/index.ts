export interface RespostaLogin {
  token: string;
  tipo: string;
  expiracaoEm: number;
  veiculoId: string;
}

export interface Veiculo {
  id: string;
  nomeProprietario: string;
  marca: string;
  modelo: string;
  versao: string;
  ano: number;
  placa: string;
  quilometragem: number;
  statusVeiculo: string;
  nivelCombustivel: number;
  autonomiaKm: number;
  climatizacaoAutomatica: boolean;
  desembacarParabrisa: boolean;
  bancoAquecido: boolean;
  notificar: boolean;
  scoreSaude: number | null;
}

export interface PreferenciasVeiculo {
  climatizacaoAutomatica?: boolean;
  desembacarParabrisa?: boolean;
  bancoAquecido?: boolean;
  notificar?: boolean;
}

export interface AgendamentoVeiculo {
  id: string;
  tipo: string;
  rotulo: string;
  hora: string | null;
  diasSemana: string | null; // dias separados por vírgula: "1,2,3,4,5" (0=Dom,...,6=Sáb)
  ativo: boolean;
  duracaoMinutos: number | null;
  alvoTemperatura: number | null;
}

export interface RegistroManutencao {
  id: string;
  tipo: string;
  descricao: string;
  quilometragemNoServico: number;
  dataServico: string;
  concessionaria: string;
  custo: number;
}

export type ModoClimatizacao = 'ac' | 'aquecedor' | 'desembacador';

export interface ZonaClimatizacao {
  id: string;
  rotulo: string;
  temperatura: number;
  ativa: boolean;
  ordem: number;
}

export interface EstadoClimatizacao {
  id: string;
  veiculoId: string;
  sistemaLigado: boolean;
  modo: ModoClimatizacao;
  velocidadeVentilador: number;
  temperaturaInterna: number;
  temperaturaExterna: number;
  zonas: ZonaClimatizacao[];
}

export type Prioridade = 'baixa' | 'media' | 'alta';

export type TipoRecomendacao = 'revisao' | 'troca' | 'inspecao';

export type StatusRecomendacao = 'atrasada' | 'proxima' | 'em_dia';

export interface Recomendacao {
  id: string;
  titulo: string;
  descricao: string;
  tipo: TipoRecomendacao | null;
  obrigatoria: boolean;
  dataLimite: string | null;
  quilometragemLimite: number | null;
  prioridade: Prioridade;
  custoMin: number | null;
  custoMax: number | null;
  resolvido: boolean;
  status: StatusRecomendacao;
}

export interface Concessionaria {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  telefone: string | null;
  distanciaKm: number;
}

export interface RecomendacaoResumida {
  id: string;
  titulo: string;
  tipo: TipoRecomendacao | null;
  obrigatoria: boolean;
  custoMin: number | null;
  custoMax: number | null;
}

export type PeriodoAgendamento = 'manha' | 'tarde';

export type StatusAgendamento = 'pendente' | 'confirmado' | 'cancelado';

export interface AgendamentoServico {
  id: string;
  dataPreferida: string;
  periodo: PeriodoAgendamento;
  status: StatusAgendamento;
  observacoes: string | null;
  criadoEm: string;
  concessionaria: Concessionaria;
  recomendacoes: RecomendacaoResumida[];
}

export interface AgendamentoServicoRequest {
  concessionariaId: string;
  dataPreferida: string;
  periodo: PeriodoAgendamento;
  recomendacaoIds: string[];
  observacoes?: string;
}
