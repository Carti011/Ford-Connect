import api from './api';
import { Recomendacao } from '../types';

export async function buscarRecomendacoes(veiculoId: string): Promise<Recomendacao[]> {
  const resposta = await api.get<Recomendacao[]>(`/api/veiculos/${veiculoId}/recomendacoes`);
  return resposta.data.filter((recomendacao) => !recomendacao.resolvido);
}
