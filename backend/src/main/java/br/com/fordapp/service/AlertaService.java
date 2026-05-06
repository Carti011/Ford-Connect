package br.com.fordapp.service;

import br.com.fordapp.dto.AlertaRevisaoResponse;
import br.com.fordapp.repository.AlertaRevisaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AlertaService {

    private final AlertaRevisaoRepository alertaRepository;

    public AlertaService(AlertaRevisaoRepository alertaRepository) {
        this.alertaRepository = alertaRepository;
    }

    public List<AlertaRevisaoResponse> buscarPendentesPorVeiculo(UUID veiculoId) {
        return alertaRepository.findByVeiculoIdAndResolvidoFalseOrderByPrioridadeDesc(veiculoId)
                .stream()
                .map(AlertaRevisaoResponse::de)
                .toList();
    }
}
