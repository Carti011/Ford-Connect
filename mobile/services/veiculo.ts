import api from './api';
import { PreferenciasVeiculo, Veiculo } from '../types';

export async function buscarVeiculo(id: string): Promise<Veiculo> {
  const resposta = await api.get<Veiculo>(`/api/veiculos/${id}`);
  return resposta.data;
}

export async function atualizarPreferencias(
  veiculoId: string,
  preferencias: PreferenciasVeiculo,
): Promise<Veiculo> {
  const resposta = await api.patch<Veiculo>(`/api/veiculos/${veiculoId}/preferencias`, preferencias);
  return resposta.data;
}
