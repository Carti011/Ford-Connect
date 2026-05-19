package br.com.fordapp.service;

import br.com.fordapp.dto.ConcessionariaResponse;
import br.com.fordapp.model.Concessionaria;
import br.com.fordapp.repository.ConcessionariaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConcessionariaServiceTest {

    @Mock
    private ConcessionariaRepository concessionariaRepository;

    @InjectMocks
    private ConcessionariaService concessionariaService;

    @Test
    void deveRetornarConcessionariasOrdenadasPorDistancia() {
        Concessionaria lapa = concessionaria("Ford Lapa", 4);
        Concessionaria tatuape = concessionaria("Ford Tatuapé", 8);

        when(concessionariaRepository.findAllByOrderByDistanciaKmAsc())
                .thenReturn(List.of(lapa, tatuape));

        List<ConcessionariaResponse> resultado = concessionariaService.listarOrdenadasPorDistancia();

        assertThat(resultado).extracting(ConcessionariaResponse::getNome)
                .containsExactly("Ford Lapa", "Ford Tatuapé");
        assertThat(resultado.get(0).getDistanciaKm()).isEqualTo(4);
        assertThat(resultado.get(1).getDistanciaKm()).isEqualTo(8);
    }

    @Test
    void deveRetornarListaVaziaQuandoSemConcessionarias() {
        when(concessionariaRepository.findAllByOrderByDistanciaKmAsc()).thenReturn(List.of());

        List<ConcessionariaResponse> resultado = concessionariaService.listarOrdenadasPorDistancia();

        assertThat(resultado).isEmpty();
    }

    private Concessionaria concessionaria(String nome, int distanciaKm) {
        Concessionaria c = new Concessionaria();
        c.setId(UUID.randomUUID());
        c.setNome(nome);
        c.setEndereco("Av. Exemplo, 100");
        c.setCidade("São Paulo");
        c.setEstado("SP");
        c.setTelefone("(11) 0000-0000");
        c.setDistanciaKm(distanciaKm);
        return c;
    }
}
