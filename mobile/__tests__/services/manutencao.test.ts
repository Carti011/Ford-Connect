import { buscarManutencoes } from '../../services/manutencao';

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

import api from '../../services/api';
const apiMock = api as jest.Mocked<typeof api>;

const manutencoesSeed = [
  {
    id: 'aaa',
    tipo: 'Revisão de 10.000 km',
    descricao: 'Troca de óleo e filtro de óleo.',
    quilometragemNoServico: 10000,
    dataServico: '2022-11-15',
    concessionaria: 'Ford Interlagos — São Paulo/SP',
    custo: 650.0,
  },
  {
    id: 'bbb',
    tipo: 'Revisão de 20.000 km',
    descricao: 'Troca de óleo e filtro de ar.',
    quilometragemNoServico: 20000,
    dataServico: '2023-05-20',
    concessionaria: 'Ford Interlagos — São Paulo/SP',
    custo: 980.0,
  },
];

describe('manutencao service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('buscarManutencoes()', () => {
    it('deve chamar GET /api/veiculos/{id}/manutencoes', async () => {
      apiMock.get.mockResolvedValueOnce({ data: manutencoesSeed });

      await buscarManutencoes('22222222-2222-2222-2222-222222222222');

      expect(apiMock.get).toHaveBeenCalledWith(
        '/api/veiculos/22222222-2222-2222-2222-222222222222/manutencoes'
      );
    });

    it('deve retornar array de manutenções', async () => {
      apiMock.get.mockResolvedValueOnce({ data: manutencoesSeed });

      const resultado = await buscarManutencoes('22222222-2222-2222-2222-222222222222');

      expect(resultado).toHaveLength(2);
      expect(resultado[0].tipo).toBe('Revisão de 10.000 km');
      expect(resultado[1].custo).toBe(980.0);
    });

    it('deve retornar array vazio quando não há manutenções', async () => {
      apiMock.get.mockResolvedValueOnce({ data: [] });

      const resultado = await buscarManutencoes('22222222-2222-2222-2222-222222222222');

      expect(resultado).toHaveLength(0);
    });

    it('deve propagar erro 401 quando token inválido', async () => {
      const erro = Object.assign(new Error('Unauthorized'), {
        response: { status: 401 },
      });
      apiMock.get.mockRejectedValueOnce(erro);

      await expect(
        buscarManutencoes('22222222-2222-2222-2222-222222222222')
      ).rejects.toMatchObject({ response: { status: 401 } });
    });
  });
});
