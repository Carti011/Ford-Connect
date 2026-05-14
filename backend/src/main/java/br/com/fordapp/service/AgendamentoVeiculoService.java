package br.com.fordapp.service;

import br.com.fordapp.dto.AgendamentoVeiculoResponse;
import br.com.fordapp.dto.AtualizarAgendamentoRequest;
import br.com.fordapp.dto.CriarAgendamentoRequest;
import br.com.fordapp.model.AgendamentoVeiculo;
import br.com.fordapp.model.Veiculo;
import br.com.fordapp.repository.AgendamentoVeiculoRepository;
import br.com.fordapp.repository.VeiculoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class AgendamentoVeiculoService {

    private final AgendamentoVeiculoRepository agendamentoRepository;
    private final VeiculoRepository veiculoRepository;

    public AgendamentoVeiculoService(
            AgendamentoVeiculoRepository agendamentoRepository,
            VeiculoRepository veiculoRepository) {
        this.agendamentoRepository = agendamentoRepository;
        this.veiculoRepository = veiculoRepository;
    }

    public List<AgendamentoVeiculoResponse> listarPorVeiculo(UUID veiculoId) {
        return agendamentoRepository.findByVeiculoId(veiculoId)
                .stream()
                .map(AgendamentoVeiculoResponse::de)
                .toList();
    }

    public AgendamentoVeiculoResponse atualizar(UUID id, AtualizarAgendamentoRequest request) {
        AgendamentoVeiculo agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Agendamento não encontrado"));
        if (request.getHora() != null)            agendamento.setHora(request.getHora());
        if (request.getDiasSemana() != null)      agendamento.setDiasSemana(request.getDiasSemana());
        if (request.getDuracaoMinutos() != null)  agendamento.setDuracaoMinutos(request.getDuracaoMinutos());
        if (request.getAlvoTemperatura() != null) agendamento.setAlvoTemperatura(request.getAlvoTemperatura());
        return AgendamentoVeiculoResponse.de(agendamentoRepository.save(agendamento));
    }

    public AgendamentoVeiculoResponse alternarAtivo(UUID id) {
        AgendamentoVeiculo agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Agendamento não encontrado"));
        agendamento.setAtivo(!agendamento.getAtivo());
        return AgendamentoVeiculoResponse.de(agendamentoRepository.save(agendamento));
    }

    public AgendamentoVeiculoResponse criar(UUID veiculoId, CriarAgendamentoRequest request) {
        Veiculo veiculo = veiculoRepository.findById(veiculoId)
                .orElseThrow(() -> new NoSuchElementException("Veículo não encontrado"));
        AgendamentoVeiculo novo = new AgendamentoVeiculo();
        novo.setVeiculo(veiculo);
        novo.setTipo(request.getTipo());
        novo.setRotulo(request.getRotulo());
        novo.setHora(request.getHora());
        novo.setDiasSemana(request.getDiasSemana());
        novo.setAtivo(false);
        return AgendamentoVeiculoResponse.de(agendamentoRepository.save(novo));
    }

    public void deletar(UUID id) {
        AgendamentoVeiculo agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Agendamento não encontrado"));
        agendamentoRepository.delete(agendamento);
    }
}
