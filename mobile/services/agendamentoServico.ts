import api from './api';
import { AgendamentoServico, AgendamentoServicoRequest } from '../types';

export async function criarAgendamentoServico(
  veiculoId: string,
  payload: AgendamentoServicoRequest
): Promise<AgendamentoServico> {
  const resposta = await api.post<AgendamentoServico>(
    `/api/veiculos/${veiculoId}/agendamentos-servico`,
    payload
  );
  return resposta.data;
}

export async function listarAgendamentosServico(
  veiculoId: string
): Promise<AgendamentoServico[]> {
  const resposta = await api.get<AgendamentoServico[]>(
    `/api/veiculos/${veiculoId}/agendamentos-servico`
  );
  return resposta.data;
}
