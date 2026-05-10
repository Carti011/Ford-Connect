package br.com.fordapp.repository;

import br.com.fordapp.model.AgendamentoVeiculo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AgendamentoVeiculoRepository extends JpaRepository<AgendamentoVeiculo, UUID> {

    List<AgendamentoVeiculo> findByVeiculoId(UUID veiculoId);
}
