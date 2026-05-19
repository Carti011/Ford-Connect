package br.com.fordapp.repository;

import br.com.fordapp.model.Recomendacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface RecomendacaoRepository extends JpaRepository<Recomendacao, UUID> {

    List<Recomendacao> findByVeiculoIdAndResolvidoFalseOrderByPrioridadeDesc(UUID veiculoId);
}
