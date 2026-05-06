package br.com.fordapp.service;

import br.com.fordapp.dto.AlertaRevisaoResponse;
import br.com.fordapp.model.AlertaRevisao;
import br.com.fordapp.model.Veiculo;
import br.com.fordapp.repository.AlertaRevisaoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AlertaServiceTest {

    @Mock
    private AlertaRevisaoRepository alertaRepository;

    @InjectMocks
    private AlertaService alertaService;

    private UUID veiculoId;
    private List<AlertaRevisao> alertas;

    @BeforeEach
    void setUp() {
        veiculoId = UUID.randomUUID();

        Veiculo veiculo = new Veiculo();
        veiculo.setId(veiculoId);

        AlertaRevisao a1 = new AlertaRevisao();
        a1.setId(UUID.randomUUID());
        a1.setVeiculo(veiculo);
        a1.setTitulo("Revisão de 50.000 km");
        a1.setPrioridade("alta");
        a1.setDataLimite(LocalDate.of(2025, 1, 15));
        a1.setResolvido(false);

        AlertaRevisao a2 = new AlertaRevisao();
        a2.setId(UUID.randomUUID());
        a2.setVeiculo(veiculo);
        a2.setTitulo("Troca de pneus");
        a2.setPrioridade("media");
        a2.setResolvido(false);

        alertas = List.of(a1, a2);
    }

    @Test
    void deveRetornarApenasAlertasPendentes() {
        when(alertaRepository.findByVeiculoIdAndResolvidoFalseOrderByPrioridadeDesc(veiculoId))
                .thenReturn(alertas);

        List<AlertaRevisaoResponse> resultado = alertaService.buscarPendentesPorVeiculo(veiculoId);

        assertThat(resultado).hasSize(2);
        assertThat(resultado).allMatch(a -> !a.getResolvido());
    }

    @Test
    void deveRetornarListaVaziaQuandoSemAlertas() {
        when(alertaRepository.findByVeiculoIdAndResolvidoFalseOrderByPrioridadeDesc(veiculoId))
                .thenReturn(List.of());

        List<AlertaRevisaoResponse> resultado = alertaService.buscarPendentesPorVeiculo(veiculoId);

        assertThat(resultado).isEmpty();
    }
}
