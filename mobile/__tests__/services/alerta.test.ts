import { buscarAlertas } from '../../services/alerta';

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

import api from '../../services/api';
const apiMock = api as jest.Mocked<typeof api>;

const alertasSeed = [
  {
    id: 'aaa',
    titulo: 'Revisão de 50.000 km',
    descricao: 'Próxima revisão programada.',
    dataLimite: '2025-01-15',
    quilometragemLimite: 50000,
    prioridade: 'alta',
    resolvido: false,
  },
  {
    id: 'bbb',
    titulo: 'Troca de pneus',
    descricao: 'Pneus dianteiros com desgaste.',
    dataLimite: '2024-12-31',
    quilometragemLimite: null,
    prioridade: 'media',
    resolvido: false,
  },
  {
    id: 'ccc',
    titulo: 'Revisão já feita',
    descricao: 'Este alerta já foi resolvido.',
    dataLimite: '2024-01-01',
    quilometragemLimite: null,
    prioridade: 'baixa',
    resolvido: true,
  },
];

describe('alerta service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('buscarAlertas()', () => {
    it('deve chamar GET /api/veiculos/{id}/alertas', async () => {
      apiMock.get.mockResolvedValueOnce({ data: alertasSeed });

      await buscarAlertas('22222222-2222-2222-2222-222222222222');

      expect(apiMock.get).toHaveBeenCalledWith(
        '/api/veiculos/22222222-2222-2222-2222-222222222222/alertas'
      );
    });

    it('deve retornar apenas alertas não resolvidos', async () => {
      apiMock.get.mockResolvedValueOnce({ data: alertasSeed });

      const resultado = await buscarAlertas('22222222-2222-2222-2222-222222222222');

      expect(resultado).toHaveLength(2);
      expect(resultado.every((a) => !a.resolvido)).toBe(true);
    });

    it('deve retornar array vazio quando todos os alertas estão resolvidos', async () => {
      const todosResolvidos = alertasSeed.map((a) => ({ ...a, resolvido: true }));
      apiMock.get.mockResolvedValueOnce({ data: todosResolvidos });

      const resultado = await buscarAlertas('22222222-2222-2222-2222-222222222222');

      expect(resultado).toHaveLength(0);
    });

    it('deve retornar array vazio quando não há alertas', async () => {
      apiMock.get.mockResolvedValueOnce({ data: [] });

      const resultado = await buscarAlertas('22222222-2222-2222-2222-222222222222');

      expect(resultado).toHaveLength(0);
    });

    it('deve propagar erro 401 quando token inválido', async () => {
      const erro = Object.assign(new Error('Unauthorized'), {
        response: { status: 401 },
      });
      apiMock.get.mockRejectedValueOnce(erro);

      await expect(
        buscarAlertas('22222222-2222-2222-2222-222222222222')
      ).rejects.toMatchObject({ response: { status: 401 } });
    });
  });
});
