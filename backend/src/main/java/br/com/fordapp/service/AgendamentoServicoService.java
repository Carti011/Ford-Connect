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
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.UUID;

@Service
public class AgendamentoServicoService {

    private static final Set<String> PERIODOS_VALIDOS = Set.of("manha", "tarde");

    private final AgendamentoServicoRepository agendamentoRepository;
    private final VeiculoRepository veiculoRepository;
    private final ConcessionariaRepository concessionariaRepository;
    private final RecomendacaoRepository recomendacaoRepository;

    public AgendamentoServicoService(AgendamentoServicoRepository agendamentoRepository,
                                     VeiculoRepository veiculoRepository,
                                     ConcessionariaRepository concessionariaRepository,
                                     RecomendacaoRepository recomendacaoRepository) {
        this.agendamentoRepository = agendamentoRepository;
        this.veiculoRepository = veiculoRepository;
        this.concessionariaRepository = concessionariaRepository;
        this.recomendacaoRepository = recomendacaoRepository;
    }

    public AgendamentoServicoResponse criar(UUID veiculoId, AgendamentoServicoRequest request) {
        // validacao periodo
        if (!PERIODOS_VALIDOS.contains(request.getPeriodo())) {
            throw new IllegalArgumentException("Período inválido. Use 'manha' ou 'tarde'.");
        }

        // veiculo
        Veiculo veiculo = veiculoRepository.findById(veiculoId)
                .orElseThrow(() -> new NoSuchElementException("Veículo não encontrado"));

        // concessionaria
        Concessionaria concessionaria = concessionariaRepository.findById(request.getConcessionariaId())
                .orElseThrow(() -> new NoSuchElementException("Concessionária não encontrada"));

        // recomendacoes pertencem ao veiculo
        List<Recomendacao> recomendacoes = recomendacaoRepository.findAllById(request.getRecomendacaoIds());
        if (recomendacoes.size() != request.getRecomendacaoIds().size()) {
            throw new NoSuchElementException("Uma ou mais recomendações não foram encontradas");
        }
        boolean todasDoVeiculo = recomendacoes.stream()
                .allMatch(r -> r.getVeiculo().getId().equals(veiculoId));
        if (!todasDoVeiculo) {
            throw new IllegalArgumentException("Recomendações não pertencem ao veículo informado");
        }

        // criacao
        AgendamentoServico agendamento = new AgendamentoServico();
        agendamento.setVeiculo(veiculo);
        agendamento.setConcessionaria(concessionaria);
        agendamento.setDataPreferida(request.getDataPreferida());
        agendamento.setPeriodo(request.getPeriodo());
        agendamento.setStatus("pendente");
        agendamento.setObservacoes(request.getObservacoes());
        agendamento.setRecomendacoes(new HashSet<>(recomendacoes));

        AgendamentoServico salvo = agendamentoRepository.save(agendamento);
        return AgendamentoServicoResponse.de(salvo);
    }

    public List<AgendamentoServicoResponse> listarPorVeiculo(UUID veiculoId) {
        return agendamentoRepository.findByVeiculoIdOrderByCriadoEmDesc(veiculoId)
                .stream()
                .map(AgendamentoServicoResponse::de)
                .toList();
    }
}
