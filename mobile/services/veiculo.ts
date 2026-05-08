import api from './api';
import { Veiculo } from '../types';

export async function buscarVeiculo(id: string): Promise<Veiculo> {
  const resposta = await api.get<Veiculo>(`/api/veiculos/${id}`);
  return resposta.data;
}
