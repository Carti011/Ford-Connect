package br.com.fordapp.service;

import br.com.fordapp.dto.ConcessionariaResponse;
import br.com.fordapp.repository.ConcessionariaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConcessionariaService {

    private final ConcessionariaRepository concessionariaRepository;

    public ConcessionariaService(ConcessionariaRepository concessionariaRepository) {
        this.concessionariaRepository = concessionariaRepository;
    }

    public List<ConcessionariaResponse> listarOrdenadasPorDistancia() {
        return concessionariaRepository.findAllByOrderByDistanciaKmAsc()
                .stream()
                .map(ConcessionariaResponse::de)
                .toList();
    }
}
