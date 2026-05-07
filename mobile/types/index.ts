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
