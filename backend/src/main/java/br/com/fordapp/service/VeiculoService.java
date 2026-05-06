package br.com.fordapp.service;

import br.com.fordapp.dto.VeiculoResponse;
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
}
