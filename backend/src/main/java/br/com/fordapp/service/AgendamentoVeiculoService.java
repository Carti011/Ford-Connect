package br.com.fordapp.service;

import br.com.fordapp.dto.AgendamentoVeiculoResponse;
import br.com.fordapp.model.AgendamentoVeiculo;
import br.com.fordapp.repository.AgendamentoVeiculoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class AgendamentoVeiculoService {

    private final AgendamentoVeiculoRepository agendamentoRepository;

    public AgendamentoVeiculoService(AgendamentoVeiculoRepository agendamentoRepository) {
        this.agendamentoRepository = agendamentoRepository;
    }

    public List<AgendamentoVeiculoResponse> listarPorVeiculo(UUID veiculoId) {
        return agendamentoRepository.findByVeiculoId(veiculoId)
                .stream()
                .map(AgendamentoVeiculoResponse::de)
                .toList();
    }

    public AgendamentoVeiculoResponse alternarAtivo(UUID id) {
        AgendamentoVeiculo agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Agendamento não encontrado"));
        agendamento.setAtivo(!agendamento.getAtivo());
        return AgendamentoVeiculoResponse.de(agendamentoRepository.save(agendamento));
    }
}
