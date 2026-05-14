package br.com.fordapp.service;

import br.com.fordapp.dto.AtualizarClimatizacaoRequest;
import br.com.fordapp.dto.AtualizarZonaClimatizacaoRequest;
import br.com.fordapp.dto.EstadoClimatizacaoResponse;
import br.com.fordapp.dto.ZonaClimatizacaoResponse;
import br.com.fordapp.model.EstadoClimatizacao;
import br.com.fordapp.model.ZonaClimatizacao;
import br.com.fordapp.repository.EstadoClimatizacaoRepository;
import br.com.fordapp.repository.ZonaClimatizacaoRepository;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class EstadoClimatizacaoService {

    // sensores mockados nesta sprint — ver ADR 032
    private static final int TEMPERATURA_INTERNA_MOCK = 28;
    private static final int TEMPERATURA_EXTERNA_MOCK = 31;

    private final EstadoClimatizacaoRepository estadoRepository;
    private final ZonaClimatizacaoRepository zonaRepository;

    public EstadoClimatizacaoService(EstadoClimatizacaoRepository estadoRepository,
                                     ZonaClimatizacaoRepository zonaRepository) {
        this.estadoRepository = estadoRepository;
        this.zonaRepository = zonaRepository;
    }

    public EstadoClimatizacaoResponse buscarPorVeiculo(UUID veiculoId) {
        EstadoClimatizacao estado = estadoRepository.findByVeiculoId(veiculoId)
                .orElseThrow(() -> new NoSuchElementException("Estado de climatização não encontrado"));
        return EstadoClimatizacaoResponse.de(estado, TEMPERATURA_INTERNA_MOCK, TEMPERATURA_EXTERNA_MOCK);
    }

    public EstadoClimatizacaoResponse atualizar(UUID veiculoId, AtualizarClimatizacaoRequest request) {
        EstadoClimatizacao estado = estadoRepository.findByVeiculoId(veiculoId)
                .orElseThrow(() -> new NoSuchElementException("Estado de climatização não encontrado"));

        if (request.getSistemaLigado() != null)        estado.setSistemaLigado(request.getSistemaLigado());
        if (request.getModo() != null)                 estado.setModo(request.getModo());
        if (request.getVelocidadeVentilador() != null) estado.setVelocidadeVentilador(request.getVelocidadeVentilador());

        EstadoClimatizacao salvo = estadoRepository.save(estado);
        return EstadoClimatizacaoResponse.de(salvo, TEMPERATURA_INTERNA_MOCK, TEMPERATURA_EXTERNA_MOCK);
    }

    public ZonaClimatizacaoResponse atualizarZona(UUID veiculoId, UUID zonaId, AtualizarZonaClimatizacaoRequest request) {
        ZonaClimatizacao zona = zonaRepository.findById(zonaId)
                .orElseThrow(() -> new NoSuchElementException("Zona de climatização não encontrada"));

        // protege contra IDOR: zona precisa pertencer ao estado do veículo informado na URL
        if (!zona.getEstadoClimatizacao().getVeiculo().getId().equals(veiculoId)) {
            throw new NoSuchElementException("Zona de climatização não encontrada");
        }

        if (request.getTemperatura() != null) zona.setTemperatura(request.getTemperatura());
        if (request.getAtiva() != null)       zona.setAtiva(request.getAtiva());

        return ZonaClimatizacaoResponse.de(zonaRepository.save(zona));
    }
}
