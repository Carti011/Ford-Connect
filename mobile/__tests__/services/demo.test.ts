import { resetarDemo } from '../../services/demo';

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

import api from '../../services/api';
const apiMock = api as jest.Mocked<typeof api>;

describe('demo service', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve chamar POST /api/demo/resetar', async () => {
    apiMock.post.mockResolvedValueOnce({ data: undefined });

    await resetarDemo();

    expect(apiMock.post).toHaveBeenCalledWith('/api/demo/resetar');
  });

  it('deve propagar erro quando o backend falha', async () => {
    apiMock.post.mockRejectedValueOnce(new Error('rede indisponível'));

    await expect(resetarDemo()).rejects.toThrow('rede indisponível');
  });
});
