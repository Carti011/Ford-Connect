package br.com.fordapp.service;

import br.com.fordapp.dto.RecomendacaoResponse;
import br.com.fordapp.model.Recomendacao;
import br.com.fordapp.model.Veiculo;
import br.com.fordapp.repository.RecomendacaoRepository;
import br.com.fordapp.repository.VeiculoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecomendacaoServiceTest {

    @Mock
    private RecomendacaoRepository recomendacaoRepository;

    @Mock
    private VeiculoRepository veiculoRepository;

    @InjectMocks
    private RecomendacaoService recomendacaoService;

    private UUID veiculoId;
    private Veiculo veiculo;

    @BeforeEach
    void setUp() {
        veiculoId = UUID.randomUUID();

        veiculo = new Veiculo();
        veiculo.setId(veiculoId);
        veiculo.setQuilometragem(12000);
    }

    @Test
    void deveOrdenarRecomendacoesPorUrgencia() {
        Recomendacao emDia = recomendacao("Em dia", "baixa", LocalDate.now().plusDays(180), 50000, false);
        Recomendacao proxima = recomendacao("Proxima", "media", LocalDate.now().plusDays(15), null, false);
        Recomendacao atrasada = recomendacao("Atrasada", "alta", LocalDate.now().minusDays(30), null, true);

        when(veiculoRepository.findById(veiculoId)).thenReturn(Optional.of(veiculo));
        when(recomendacaoRepository.findByVeiculoIdAndResolvidoFalseOrderByPrioridadeDesc(veiculoId))
                .thenReturn(List.of(emDia, proxima, atrasada));

        List<RecomendacaoResponse> resultado = recomendacaoService.buscarPendentesPorVeiculo(veiculoId);

        assertThat(resultado).extracting(RecomendacaoResponse::getTitulo)
                .containsExactly("Atrasada", "Proxima", "Em dia");
    }

    @Test
    void deveClassificarStatusComBaseNoKmDoVeiculo() {
        veiculo.setQuilometragem(12000);

        Recomendacao atrasada = recomendacao("Revisao 10mil", "alta", null, 10000, true);
        Recomendacao proxima = recomendacao("Troca freio", "media", null, 13500, false);
        Recomendacao emDia = recomendacao("Alinhamento", "baixa", null, 20000, false);

        when(veiculoRepository.findById(veiculoId)).thenReturn(Optional.of(veiculo));
        when(recomendacaoRepository.findByVeiculoIdAndResolvidoFalseOrderByPrioridadeDesc(veiculoId))
                .thenReturn(List.of(atrasada, proxima, emDia));

        List<RecomendacaoResponse> resultado = recomendacaoService.buscarPendentesPorVeiculo(veiculoId);

        assertThat(resultado.get(0).getStatus()).isEqualTo("atrasada");
        assertThat(resultado.get(1).getStatus()).isEqualTo("proxima");
        assertThat(resultado.get(2).getStatus()).isEqualTo("em_dia");
    }

    @Test
    void deveLancarErroQuandoVeiculoNaoEncontrado() {
        when(veiculoRepository.findById(veiculoId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> recomendacaoService.buscarPendentesPorVeiculo(veiculoId))
                .hasMessageContaining("Veículo não encontrado");
    }

    @Test
    void deveRetornarListaVaziaQuandoSemRecomendacoes() {
        when(veiculoRepository.findById(veiculoId)).thenReturn(Optional.of(veiculo));
        when(recomendacaoRepository.findByVeiculoIdAndResolvidoFalseOrderByPrioridadeDesc(veiculoId))
                .thenReturn(List.of());

        List<RecomendacaoResponse> resultado = recomendacaoService.buscarPendentesPorVeiculo(veiculoId);

        assertThat(resultado).isEmpty();
    }

    private Recomendacao recomendacao(String titulo, String prioridade, LocalDate dataLimite,
                                      Integer kmLimite, boolean obrigatoria) {
        Recomendacao r = new Recomendacao();
        r.setId(UUID.randomUUID());
        r.setVeiculo(veiculo);
        r.setTitulo(titulo);
        r.setPrioridade(prioridade);
        r.setDataLimite(dataLimite);
        r.setQuilometragemLimite(kmLimite);
        r.setResolvido(false);
        r.setObrigatoria(obrigatoria);
        r.setTipo("revisao");
        r.setCustoMin(BigDecimal.valueOf(100));
        r.setCustoMax(BigDecimal.valueOf(200));
        return r;
    }
}
