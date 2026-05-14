package br.com.fordapp.repository;

import br.com.fordapp.model.ZonaClimatizacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ZonaClimatizacaoRepository extends JpaRepository<ZonaClimatizacao, UUID> {
}
