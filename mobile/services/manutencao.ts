import api from './api';
import { RegistroManutencao } from '../types';

export async function buscarManutencoes(veiculoId: string): Promise<RegistroManutencao[]> {
  const resposta = await api.get<RegistroManutencao[]>(`/api/veiculos/${veiculoId}/manutencoes`);
  return resposta.data;
}
