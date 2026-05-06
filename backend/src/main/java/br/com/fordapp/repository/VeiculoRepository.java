package br.com.fordapp.repository;

import br.com.fordapp.model.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface VeiculoRepository extends JpaRepository<Veiculo, UUID> {

    Optional<Veiculo> findByUsuarioId(UUID usuarioId);
}
