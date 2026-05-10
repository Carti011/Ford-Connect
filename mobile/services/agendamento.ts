import api from './api';
import { AgendamentoVeiculo } from '../types';

export async function buscarAgendamentos(veiculoId: string): Promise<AgendamentoVeiculo[]> {
  const resposta = await api.get<AgendamentoVeiculo[]>(`/api/veiculos/${veiculoId}/agendamentos`);
  return resposta.data;
}

export async function alternarAtivo(agendamentoId: string): Promise<AgendamentoVeiculo> {
  const resposta = await api.patch<AgendamentoVeiculo>(`/api/agendamentos/${agendamentoId}/ativo`);
  return resposta.data;
}
