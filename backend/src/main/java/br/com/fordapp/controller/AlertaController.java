package br.com.fordapp.controller;

import br.com.fordapp.dto.AlertaRevisaoResponse;
import br.com.fordapp.service.AlertaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/veiculos")
public class AlertaController {

    private final AlertaService alertaService;

    public AlertaController(AlertaService alertaService) {
        this.alertaService = alertaService;
    }

    @GetMapping("/{id}/alerts")
    ResponseEntity<List<AlertaRevisaoResponse>> buscarAlertas(@PathVariable UUID id) {
        return ResponseEntity.ok(alertaService.buscarPendentesPorVeiculo(id));
    }
}
