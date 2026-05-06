package br.com.fordapp.service;

import br.com.fordapp.dto.RegistroManutencaoResponse;
import br.com.fordapp.repository.RegistroManutencaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ManutencaoService {

    private final RegistroManutencaoRepository manutencaoRepository;

    public ManutencaoService(RegistroManutencaoRepository manutencaoRepository) {
        this.manutencaoRepository = manutencaoRepository;
    }

    public List<RegistroManutencaoResponse> buscarPorVeiculo(UUID veiculoId) {
        return manutencaoRepository.findByVeiculoIdOrderByDataServicoDesc(veiculoId)
                .stream()
                .map(RegistroManutencaoResponse::de)
                .toList();
    }
}
