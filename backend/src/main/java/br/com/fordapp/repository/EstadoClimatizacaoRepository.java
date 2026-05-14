package br.com.fordapp.repository;

import br.com.fordapp.model.EstadoClimatizacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EstadoClimatizacaoRepository extends JpaRepository<EstadoClimatizacao, UUID> {

    Optional<EstadoClimatizacao> findByVeiculoId(UUID veiculoId);
}
