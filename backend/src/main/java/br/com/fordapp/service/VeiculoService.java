package br.com.fordapp.service;

import br.com.fordapp.dto.AtualizarPreferenciasRequest;
import br.com.fordapp.dto.VeiculoResponse;
import br.com.fordapp.model.Veiculo;
import br.com.fordapp.repository.VeiculoRepository;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class VeiculoService {

    private final VeiculoRepository veiculoRepository;

    public VeiculoService(VeiculoRepository veiculoRepository) {
        this.veiculoRepository = veiculoRepository;
    }

    public VeiculoResponse buscarPorId(UUID id) {
        return veiculoRepository.findById(id)
                .map(VeiculoResponse::de)
                .orElseThrow(() -> new NoSuchElementException("Veículo não encontrado"));
    }

    public VeiculoResponse atualizarPreferencias(UUID id, AtualizarPreferenciasRequest request) {
        Veiculo veiculo = veiculoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Veículo não encontrado"));
        if (request.getClimatizacaoAutomatica() != null) veiculo.setClimatizacaoAutomatica(request.getClimatizacaoAutomatica());
        if (request.getDesembacarParabrisa() != null)    veiculo.setDesembacarParabrisa(request.getDesembacarParabrisa());
        if (request.getBancoAquecido() != null)          veiculo.setBancoAquecido(request.getBancoAquecido());
        if (request.getNotificar() != null)              veiculo.setNotificar(request.getNotificar());
        return VeiculoResponse.de(veiculoRepository.save(veiculo));
    }
}
