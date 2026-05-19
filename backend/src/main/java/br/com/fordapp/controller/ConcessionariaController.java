package br.com.fordapp.controller;

import br.com.fordapp.dto.ConcessionariaResponse;
import br.com.fordapp.service.ConcessionariaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/concessionarias")
public class ConcessionariaController {

    private final ConcessionariaService concessionariaService;

    public ConcessionariaController(ConcessionariaService concessionariaService) {
        this.concessionariaService = concessionariaService;
    }

    @GetMapping
    ResponseEntity<List<ConcessionariaResponse>> listar() {
        return ResponseEntity.ok(concessionariaService.listarOrdenadasPorDistancia());
    }
}
