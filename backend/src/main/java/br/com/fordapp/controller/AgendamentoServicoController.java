package br.com.fordapp.controller;

import br.com.fordapp.dto.AgendamentoServicoRequest;
import br.com.fordapp.dto.AgendamentoServicoResponse;
import br.com.fordapp.service.AgendamentoServicoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/veiculos")
public class AgendamentoServicoController {

    private final AgendamentoServicoService agendamentoServicoService;

    public AgendamentoServicoController(AgendamentoServicoService agendamentoServicoService) {
        this.agendamentoServicoService = agendamentoServicoService;
    }

    @PostMapping("/{id}/agendamentos-servico")
    public ResponseEntity<AgendamentoServicoResponse> criar(
            @PathVariable UUID id,
            @Valid @RequestBody AgendamentoServicoRequest request) {
        return ResponseEntity.status(201).body(agendamentoServicoService.criar(id, request));
    }

    @GetMapping("/{id}/agendamentos-servico")
    public ResponseEntity<List<AgendamentoServicoResponse>> listar(@PathVariable UUID id) {
        return ResponseEntity.ok(agendamentoServicoService.listarPorVeiculo(id));
    }
}
