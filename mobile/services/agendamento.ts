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

export interface AtualizarAgendamentoBody {
  hora?: string;
  diasSemana?: string;
  duracaoMinutos?: number;
  alvoTemperatura?: number;
}

export async function atualizarAgendamento(
  agendamentoId: string,
  body: AtualizarAgendamentoBody,
): Promise<AgendamentoVeiculo> {
  const resposta = await api.patch<AgendamentoVeiculo>(`/api/agendamentos/${agendamentoId}`, body);
  return resposta.data;
}

export async function criarAgendamento(
  veiculoId: string,
  tipo: string,
  rotulo: string,
  hora?: string,
  diasSemana?: string,
): Promise<AgendamentoVeiculo> {
  const resposta = await api.post<AgendamentoVeiculo>(`/api/veiculos/${veiculoId}/agendamentos`, {
    tipo,
    rotulo,
    hora,
    diasSemana,
  });
  return resposta.data;
}

export async function deletarAgendamento(agendamentoId: string): Promise<void> {
  await api.delete(`/api/agendamentos/${agendamentoId}`);
}
