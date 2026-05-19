package br.com.fordapp.repository;

import br.com.fordapp.model.AgendamentoServico;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AgendamentoServicoRepository extends JpaRepository<AgendamentoServico, UUID> {

    List<AgendamentoServico> findByVeiculoIdOrderByCriadoEmDesc(UUID veiculoId);
}
