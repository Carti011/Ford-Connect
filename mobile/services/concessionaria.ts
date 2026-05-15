import api from './api';
import { Concessionaria } from '../types';

export async function listarConcessionarias(): Promise<Concessionaria[]> {
  const resposta = await api.get<Concessionaria[]>('/api/concessionarias');
  return resposta.data;
}
