package br.com.fordapp.repository;

import br.com.fordapp.model.Concessionaria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ConcessionariaRepository extends JpaRepository<Concessionaria, UUID> {

    List<Concessionaria> findAllByOrderByDistanciaKmAsc();
}
