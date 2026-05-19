import { buscarRecomendacoes } from '../../services/recomendacao';

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

import api from '../../services/api';
const apiMock = api as jest.Mocked<typeof api>;

const recomendacoesSeed = [
  {
    id: 'aaa',
    titulo: 'Revisão dos 10.000 km',
    descricao: 'Revisão obrigatória.',
    tipo: 'revisao',
    obrigatoria: true,
    dataLimite: '2026-03-14',
    quilometragemLimite: 10000,
    prioridade: 'alta',
    custoMin: 480,
    custoMax: 620,
    resolvido: false,
    status: 'atrasada',
  },
  {
    id: 'bbb',
    titulo: 'Troca de pastilha de freio dianteiro',
    descricao: 'Pastilha próxima do limite de desgaste.',
    tipo: 'troca',
    obrigatoria: false,
    dataLimite: '2026-06-01',
    quilometragemLimite: 13500,
    prioridade: 'media',
    custoMin: 280,
    custoMax: 420,
    resolvido: false,
    status: 'proxima',
  },
  {
    id: 'ccc',
    titulo: 'Alinhamento e balanceamento',
    descricao: 'Pode ser feito na próxima revisão.',
    tipo: 'inspecao',
    obrigatoria: false,
    dataLimite: '2026-12-01',
    quilometragemLimite: 20000,
    prioridade: 'baixa',
    custoMin: 120,
    custoMax: 180,
    resolvido: true,
    status: 'em_dia',
  },
];

describe('recomendacao service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('buscarRecomendacoes()', () => {
    it('deve chamar GET /api/veiculos/{id}/recomendacoes', async () => {
      apiMock.get.mockResolvedValueOnce({ data: recomendacoesSeed });

      await buscarRecomendacoes('22222222-2222-2222-2222-222222222222');

      expect(apiMock.get).toHaveBeenCalledWith(
        '/api/veiculos/22222222-2222-2222-2222-222222222222/recomendacoes'
      );
    });

    it('deve retornar apenas recomendações não resolvidas', async () => {
      apiMock.get.mockResolvedValueOnce({ data: recomendacoesSeed });

      const resultado = await buscarRecomendacoes('22222222-2222-2222-2222-222222222222');

      expect(resultado).toHaveLength(2);
      expect(resultado.every((r) => !r.resolvido)).toBe(true);
    });

    it('deve retornar array vazio quando todas estão resolvidas', async () => {
      const todasResolvidas = recomendacoesSeed.map((r) => ({ ...r, resolvido: true }));
      apiMock.get.mockResolvedValueOnce({ data: todasResolvidas });

      const resultado = await buscarRecomendacoes('22222222-2222-2222-2222-222222222222');

      expect(resultado).toHaveLength(0);
    });

    it('deve retornar array vazio quando não há recomendações', async () => {
      apiMock.get.mockResolvedValueOnce({ data: [] });

      const resultado = await buscarRecomendacoes('22222222-2222-2222-2222-222222222222');

      expect(resultado).toHaveLength(0);
    });

    it('deve propagar erro 401 quando token inválido', async () => {
      const erro = Object.assign(new Error('Unauthorized'), {
        response: { status: 401 },
      });
      apiMock.get.mockRejectedValueOnce(erro);

      await expect(
        buscarRecomendacoes('22222222-2222-2222-2222-222222222222')
      ).rejects.toMatchObject({ response: { status: 401 } });
    });
  });
});
