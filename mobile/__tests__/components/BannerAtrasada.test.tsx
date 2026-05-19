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

  it('mostra label no singular quando ha uma atrasada', () => {
    render(
      <BannerAtrasada
        recomendacoes={[
          recomendacao({ status: 'atrasada' }),
          recomendacao({ status: 'proxima' }),
        ]}
        onPress={onPressMock}
      />
    );

    expect(screen.getByText('Agendar revisão atrasada')).toBeTruthy();
  });

  it('mostra label no plural quando ha multiplas atrasadas', () => {
    render(
      <BannerAtrasada
        recomendacoes={[
          recomendacao({ status: 'atrasada' }),
          recomendacao({ status: 'atrasada' }),
        ]}
        onPress={onPressMock}
      />
    );

    expect(screen.getByText('Agendar revisões atrasadas')).toBeTruthy();
  });

  it('chama onPress ao tocar no botao', () => {
    render(
      <BannerAtrasada
        recomendacoes={[recomendacao({ status: 'atrasada' })]}
        onPress={onPressMock}
      />
    );

    fireEvent.press(screen.getByText('Agendar revisão atrasada'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
