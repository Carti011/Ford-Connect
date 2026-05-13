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

export type Prioridade = 'baixa' | 'media' | 'alta';

export interface AlertaRevisao {
  id: string;
  titulo: string;
  descricao: string;
  dataLimite: string | null;
  quilometragemLimite: number | null;
  prioridade: Prioridade;
  resolvido: boolean;
}
