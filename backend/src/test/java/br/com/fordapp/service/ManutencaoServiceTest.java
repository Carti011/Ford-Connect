package br.com.fordapp.service;

import br.com.fordapp.dto.RegistroManutencaoResponse;
import br.com.fordapp.model.RegistroManutencao;
import br.com.fordapp.model.Veiculo;
import br.com.fordapp.repository.RegistroManutencaoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ManutencaoServiceTest {

    @Mock
    private RegistroManutencaoRepository manutencaoRepository;

    @InjectMocks
    private ManutencaoService manutencaoService;

    private UUID veiculoId;
    private List<RegistroManutencao> registros;

    @BeforeEach
    void setUp() {
        veiculoId = UUID.randomUUID();

        Veiculo veiculo = new Veiculo();
        veiculo.setId(veiculoId);

        RegistroManutencao r1 = new RegistroManutencao();
        r1.setId(UUID.randomUUID());
        r1.setVeiculo(veiculo);
        r1.setTipo("Revisão de 40.000 km");
        r1.setDataServico(LocalDate.of(2024, 6, 14));
        r1.setCusto(new BigDecimal("1750.00"));

        RegistroManutencao r2 = new RegistroManutencao();
        r2.setId(UUID.randomUUID());
        r2.setVeiculo(veiculo);
        r2.setTipo("Revisão de 30.000 km");
        r2.setDataServico(LocalDate.of(2023, 11, 8));
        r2.setCusto(new BigDecimal("1420.00"));

        registros = List.of(r1, r2);
    }

    @Test
    void deveRetornarHistoricoOrdenadoParaVeiculoExistente() {
        when(manutencaoRepository.findByVeiculoIdOrderByDataServicoDesc(veiculoId))
                .thenReturn(registros);

        List<RegistroManutencaoResponse> resultado = manutencaoService.buscarPorVeiculo(veiculoId);

        assertThat(resultado).hasSize(2);
        assertThat(resultado.get(0).getTipo()).isEqualTo("Revisão de 40.000 km");
        assertThat(resultado.get(1).getTipo()).isEqualTo("Revisão de 30.000 km");
    }

    @Test
    void deveRetornarListaVaziaQuandoSemHistorico() {
        when(manutencaoRepository.findByVeiculoIdOrderByDataServicoDesc(veiculoId))
                .thenReturn(List.of());

        List<RegistroManutencaoResponse> resultado = manutencaoService.buscarPorVeiculo(veiculoId);

        assertThat(resultado).isEmpty();
    }
}
