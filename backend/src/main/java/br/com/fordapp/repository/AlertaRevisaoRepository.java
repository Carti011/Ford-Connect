package br.com.fordapp.repository;

import br.com.fordapp.model.AlertaRevisao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AlertaRevisaoRepository extends JpaRepository<AlertaRevisao, UUID> {

    List<AlertaRevisao> findByVeiculoIdAndResolvidoFalseOrderByPrioridadeDesc(UUID veiculoId);
}
