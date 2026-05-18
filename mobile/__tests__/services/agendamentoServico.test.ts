import { criarAgendamentoServico, listarAgendamentosServico } from '../../services/agendamentoServico';

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: { post: jest.fn(), get: jest.fn() },
}));

import api from '../../services/api';
const apiMock = api as jest.Mocked<typeof api>;

describe('agendamentoServico service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('criarAgendamentoServico()', () => {
    it('deve chamar POST com payload completo', async () => {
      const veiculoId = '22222222-2222-2222-2222-222222222222';
      const payload = {
        concessionariaId: 'cc-1',
        dataPreferida: '2026-06-01',
        periodo: 'manha' as const,
        recomendacaoIds: ['rec-1', 'rec-2'],
        observacoes: 'Trazer com tanque cheio',
      };

      apiMock.post.mockResolvedValueOnce({
        data: {
          id: 'ag-1',
          dataPreferida: '2026-06-01',
          periodo: 'manha',
          status: 'pendente',
          observacoes: 'Trazer com tanque cheio',
          criadoEm: '2026-05-14T12:00:00',
          concessionaria: {
            id: 'cc-1',
            nome: 'Ford Lapa',
            endereco: 'Av. Antártica',
            cidade: 'São Paulo',
            estado: 'SP',
            telefone: null,
            distanciaKm: 4,
          },
          recomendacoes: [],
        },
      });

      const resp = await criarAgendamentoServico(veiculoId, payload);

      expect(apiMock.post).toHaveBeenCalledWith(
        `/api/veiculos/${veiculoId}/agendamentos-servico`,
        payload
      );
      expect(resp.status).toBe('pendente');
      expect(resp.concessionaria.nome).toBe('Ford Lapa');
    });

    it('deve propagar erro 400 quando payload invalido', async () => {
      const erro = Object.assign(new Error('Bad Request'), {
        response: { status: 400, data: { mensagem: 'Período inválido' } },
      });
      apiMock.post.mockRejectedValueOnce(erro);

      await expect(
        criarAgendamentoServico('vid', {
          concessionariaId: 'cc',
          dataPreferida: '2026-06-01',
          periodo: 'manha',
          recomendacaoIds: ['r'],
        })
      ).rejects.toMatchObject({ response: { status: 400 } });
    });
  });

  describe('listarAgendamentosServico()', () => {
    it('deve chamar GET com o id do veiculo', async () => {
      apiMock.get.mockResolvedValueOnce({ data: [] });

      await listarAgendamentosServico('22222222-2222-2222-2222-222222222222');

      expect(apiMock.get).toHaveBeenCalledWith(
        '/api/veiculos/22222222-2222-2222-2222-222222222222/agendamentos-servico'
      );
    });
  });
});