package br.com.fordapp.service;

import br.com.fordapp.dto.RecomendacaoResponse;
import br.com.fordapp.model.Veiculo;
import br.com.fordapp.repository.RecomendacaoRepository;
import br.com.fordapp.repository.VeiculoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class RecomendacaoService {

    private final RecomendacaoRepository recomendacaoRepository;
    private final VeiculoRepository veiculoRepository;

    public RecomendacaoService(RecomendacaoRepository recomendacaoRepository,
                               VeiculoRepository veiculoRepository) {
        this.recomendacaoRepository = recomendacaoRepository;
        this.veiculoRepository = veiculoRepository;
    }

    public List<RecomendacaoResponse> buscarPendentesPorVeiculo(UUID veiculoId) {
        Veiculo veiculo = veiculoRepository.findById(veiculoId)
                .orElseThrow(() -> new NoSuchElementException("Veículo não encontrado"));

        LocalDate hoje = LocalDate.now();
        Integer kmAtual = veiculo.getQuilometragem();

        return recomendacaoRepository.findByVeiculoIdAndResolvidoFalseOrderByPrioridadeDesc(veiculoId)
                .stream()
                .map(rec -> RecomendacaoResponse.de(rec, kmAtual, hoje))
                .sorted(Comparator.comparingInt(r -> ordemStatus(r.getStatus())))
                .toList();
    }

    private int ordemStatus(String status) {
        return switch (status) {
            case "atrasada" -> 0;
            case "proxima" -> 1;
            default -> 2;
        };
    }
}
