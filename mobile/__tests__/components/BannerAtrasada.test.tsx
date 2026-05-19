import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { BannerAtrasada } from '../../components/BannerAtrasada';
import { Recomendacao } from '../../types';

const onPressMock = jest.fn();

function recomendacao(overrides: Partial<Recomendacao> = {}): Recomendacao {
  return {
    id: 'rec-' + Math.random().toString(36).slice(2),
    titulo: 'Revisão',
    descricao: '',
    tipo: 'revisao',
    obrigatoria: false,
    dataLimite: null,
    quilometragemLimite: null,
    prioridade: 'media',
    custoMin: 100,
    custoMax: 200,
    porQueImporta: null,
    resolvido: false,
    status: 'em_dia',
    ...overrides,
  };
}

describe('BannerAtrasada', () => {
  beforeEach(() => jest.clearAllMocks());

  it('nao renderiza quando nao ha recomendacoes atrasadas', () => {
    const { toJSON } = render(
      <BannerAtrasada
        recomendacoes={[
          recomendacao({ status: 'em_dia' }),
          recomendacao({ status: 'proxima' }),
        ]}
        onPress={onPressMock}
      />
    );

    expect(toJSON()).toBeNull();
  });

  it('renderiza com o titulo da unica atrasada e sufixo Atrasada', () => {
    render(
      <BannerAtrasada
        recomendacoes={[
          recomendacao({ titulo: 'Revisão dos 10.000 km', status: 'atrasada' }),
          recomendacao({ titulo: 'Pastilha de freio', status: 'proxima' }),
        ]}
        onPress={onPressMock}
      />
    );

    expect(screen.getByText('Revisão dos 10.000 km')).toBeTruthy();
    expect(screen.getByText(/Atrasada/)).toBeTruthy();
    expect(screen.getByText(/Toque para agendar/)).toBeTruthy();
  });

  it('quando ha multiplas atrasadas mostra a primeira e e mais N', () => {
    render(
      <BannerAtrasada
        recomendacoes={[
          recomendacao({ titulo: 'Revisão dos 10.000 km', status: 'atrasada' }),
          recomendacao({ titulo: 'Troca de óleo', status: 'atrasada' }),
          recomendacao({ titulo: 'Filtro de ar', status: 'atrasada' }),
        ]}
        onPress={onPressMock}
      />
    );

    expect(screen.getByText('Revisão dos 10.000 km e mais 2')).toBeTruthy();
    expect(screen.getByText(/3 atrasadas/)).toBeTruthy();
  });

  it('chama onPress ao tocar no banner', () => {
    render(
      <BannerAtrasada
        recomendacoes={[recomendacao({ titulo: 'Revisão', status: 'atrasada' })]}
        onPress={onPressMock}
      />
    );

    fireEvent.press(screen.getByText('Revisão'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
