package br.com.fordapp.repository;

import br.com.fordapp.model.RegistroManutencao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface RegistroManutencaoRepository extends JpaRepository<RegistroManutencao, UUID> {

    List<RegistroManutencao> findByVeiculoIdOrderByDataServicoDesc(UUID veiculoId);
}
