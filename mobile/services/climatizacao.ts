import api from './api';
import { EstadoClimatizacao, ModoClimatizacao, ZonaClimatizacao } from '../types';

export async function buscarClimatizacao(veiculoId: string): Promise<EstadoClimatizacao> {
  const resposta = await api.get<EstadoClimatizacao>(`/api/veiculos/${veiculoId}/climatizacao`);
  return resposta.data;
}

export interface AtualizarClimatizacaoBody {
  sistemaLigado?: boolean;
  modo?: ModoClimatizacao;
  velocidadeVentilador?: number;
}

export async function atualizarClimatizacao(
  veiculoId: string,
  body: AtualizarClimatizacaoBody,
): Promise<EstadoClimatizacao> {
  const resposta = await api.patch<EstadoClimatizacao>(
    `/api/veiculos/${veiculoId}/climatizacao`,
    body,
  );
  return resposta.data;
}

export interface AtualizarZonaClimatizacaoBody {
  temperatura?: number;
  ativa?: boolean;
}

export async function atualizarZonaClimatizacao(
  veiculoId: string,
  zonaId: string,
  body: AtualizarZonaClimatizacaoBody,
): Promise<ZonaClimatizacao> {
  const resposta = await api.patch<ZonaClimatizacao>(
    `/api/veiculos/${veiculoId}/climatizacao/zonas/${zonaId}`,
    body,
  );
  return resposta.data;
}
