import api from './api';
import { AlertaRevisao } from '../types';

export async function buscarAlertas(veiculoId: string): Promise<AlertaRevisao[]> {
  const resposta = await api.get<AlertaRevisao[]>(`/api/veiculos/${veiculoId}/alertas`);
  return resposta.data.filter((alerta) => !alerta.resolvido);
}
