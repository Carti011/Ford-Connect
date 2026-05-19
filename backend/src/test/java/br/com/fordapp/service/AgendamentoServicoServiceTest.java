package br.com.fordapp.service;

import br.com.fordapp.dto.AgendamentoServicoRequest;
import br.com.fordapp.dto.AgendamentoServicoResponse;
import br.com.fordapp.model.AgendamentoServico;
import br.com.fordapp.model.Concessionaria;
import br.com.fordapp.model.Recomendacao;
import br.com.fordapp.model.Veiculo;
import br.com.fordapp.repository.AgendamentoServicoRepository;
import br.com.fordapp.repository.ConcessionariaRepository;
import br.com.fordapp.repository.RecomendacaoRepository;
import br.com.fordapp.repository.VeiculoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AgendamentoServicoServiceTest {

    @Mock
    private AgendamentoServicoRepository agendamentoRepository;
    @Mock
    private VeiculoRepository veiculoRepository;
    @Mock
    private ConcessionariaRepository concessionariaRepository;
    @Mock
    private RecomendacaoRepository recomendacaoRepository;

    @InjectMocks
    private AgendamentoServicoService service;

    private UUID veiculoId;
    private UUID concessionariaId;
    private UUID recomendacaoId;
    private Veiculo veiculo;
    private Concessionaria concessionaria;
    private Recomendacao recomendacao;

    @BeforeEach
    void setUp() {
        veiculoId = UUID.randomUUID();
        concessionariaId = UUID.randomUUID();
        recomendacaoId = UUID.randomUUID();

        veiculo = new Veiculo();
        veiculo.setId(veiculoId);

        concessionaria = new Concessionaria();
        concessionaria.setId(concessionariaId);
        concessionaria.setNome("Ford Lapa");
        concessionaria.setEndereco("Av. Antártica, 1500");
        concessionaria.setCidade("São Paulo");
        concessionaria.setEstado("SP");
        concessionaria.setDistanciaKm(4);

        recomendacao = new Recomendacao();
        recomendacao.setId(recomendacaoId);
        recomendacao.setVeiculo(veiculo);
        recomendacao.setTitulo("Revisão de 10.000 km");
        recomendacao.setObrigatoria(true);
        recomendacao.setTipo("revisao");
    }

    @Test
    void deveCriarAgendamentoValido() {
        AgendamentoServicoRequest req = montarRequest();

        when(veiculoRepository.findById(veiculoId)).thenReturn(Optional.of(veiculo));
        when(concessionariaRepository.findById(concessionariaId)).thenReturn(Optional.of(concessionaria));
        when(recomendacaoRepository.findAllById(List.of(recomendacaoId))).thenReturn(List.of(recomendacao));
        when(agendamentoRepository.save(any(AgendamentoServico.class))).thenAnswer(invocation -> {
            AgendamentoServico ag = invocation.getArgument(0);
            ag.setId(UUID.randomUUID());
            return ag;
        });

        AgendamentoServicoResponse resp = service.criar(veiculoId, req);

        assertThat(resp.getStatus()).isEqualTo("pendente");
        assertThat(resp.getPeriodo()).isEqualTo("manha");
        assertThat(resp.getConcessionaria().getNome()).isEqualTo("Ford Lapa");
        assertThat(resp.getRecomendacoes()).hasSize(1);
        assertThat(resp.getRecomendacoes().get(0).getTitulo()).isEqualTo("Revisão de 10.000 km");
    }

    @Test
    void deveRecusarPeriodoInvalido() {
        AgendamentoServicoRequest req = montarRequest();
        req.setPeriodo("noite");

        assertThatThrownBy(() -> service.criar(veiculoId, req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Período inválido");
    }

    @Test
    void deveRecusarQuandoVeiculoNaoEncontrado() {
        when(veiculoRepository.findById(veiculoId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.criar(veiculoId, montarRequest()))
                .isInstanceOf(NoSuchElementException.class)
                .hasMessageContaining("Veículo não encontrado");
    }

    @Test
    void deveRecusarQuandoConcessionariaNaoEncontrada() {
        when(veiculoRepository.findById(veiculoId)).thenReturn(Optional.of(veiculo));
        when(concessionariaRepository.findById(concessionariaId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.criar(veiculoId, montarRequest()))
                .isInstanceOf(NoSuchElementException.class)
                .hasMessageContaining("Concessionária não encontrada");
    }

    @Test
    void deveRecusarRecomendacaoQueNaoPertenceAoVeiculo() {
        UUID outroVeiculoId = UUID.randomUUID();
        Veiculo outroVeiculo = new Veiculo();
        outroVeiculo.setId(outroVeiculoId);
        recomendacao.setVeiculo(outroVeiculo);

        when(veiculoRepository.findById(veiculoId)).thenReturn(Optional.of(veiculo));
        when(concessionariaRepository.findById(concessionariaId)).thenReturn(Optional.of(concessionaria));
        when(recomendacaoRepository.findAllById(List.of(recomendacaoId))).thenReturn(List.of(recomendacao));

        assertThatThrownBy(() -> service.criar(veiculoId, montarRequest()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("não pertencem ao veículo");
    }

    @Test
    void deveListarAgendamentosPorVeiculo() {
        AgendamentoServico ag = new AgendamentoServico();
        ag.setId(UUID.randomUUID());
        ag.setVeiculo(veiculo);
        ag.setConcessionaria(concessionaria);
        ag.setDataPreferida(LocalDate.now().plusDays(3));
        ag.setPeriodo("tarde");
        ag.setStatus("pendente");

        when(agendamentoRepository.findByVeiculoIdOrderByCriadoEmDesc(veiculoId))
                .thenReturn(List.of(ag));

        List<AgendamentoServicoResponse> resp = service.listarPorVeiculo(veiculoId);

        assertThat(resp).hasSize(1);
        assertThat(resp.get(0).getPeriodo()).isEqualTo("tarde");
    }

    private AgendamentoServicoRequest montarRequest() {
        AgendamentoServicoRequest req = new AgendamentoServicoRequest();
        req.setConcessionariaId(concessionariaId);
        req.setDataPreferida(LocalDate.now().plusDays(7));
        req.setPeriodo("manha");
        req.setRecomendacaoIds(List.of(recomendacaoId));
        req.setObservacoes("Trazer carro com tanque cheio");
        return req;
    }
}
