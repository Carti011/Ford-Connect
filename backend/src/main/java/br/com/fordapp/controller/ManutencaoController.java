package br.com.fordapp.controller;

import br.com.fordapp.dto.RegistroManutencaoResponse;
import br.com.fordapp.service.ManutencaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/veiculos")
public class ManutencaoController {

    private final ManutencaoService manutencaoService;

    public ManutencaoController(ManutencaoService manutencaoService) {
        this.manutencaoService = manutencaoService;
    }

    @GetMapping("/{id}/maintenance")
    ResponseEntity<List<RegistroManutencaoResponse>> buscarHistorico(@PathVariable UUID id) {
        return ResponseEntity.ok(manutencaoService.buscarPorVeiculo(id));
    }
}
