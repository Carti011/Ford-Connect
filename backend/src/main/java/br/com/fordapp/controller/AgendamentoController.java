package br.com.fordapp.controller;

import br.com.fordapp.dto.AgendamentoVeiculoResponse;
import br.com.fordapp.dto.AtualizarAgendamentoRequest;
import br.com.fordapp.service.AgendamentoVeiculoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class AgendamentoController {

    private final AgendamentoVeiculoService agendamentoService;

    public AgendamentoController(AgendamentoVeiculoService agendamentoService) {
        this.agendamentoService = agendamentoService;
    }

    @GetMapping("/veiculos/{id}/agendamentos")
    public ResponseEntity<List<AgendamentoVeiculoResponse>> listar(@PathVariable UUID id) {
        return ResponseEntity.ok(agendamentoService.listarPorVeiculo(id));
    }

    @PatchMapping("/agendamentos/{id}")
    public ResponseEntity<AgendamentoVeiculoResponse> atualizar(
            @PathVariable UUID id,
            @Valid @RequestBody AtualizarAgendamentoRequest request) {
        return ResponseEntity.ok(agendamentoService.atualizar(id, request));
    }

    @PatchMapping("/agendamentos/{id}/ativo")
    public ResponseEntity<AgendamentoVeiculoResponse> alternarAtivo(@PathVariable UUID id) {
        return ResponseEntity.ok(agendamentoService.alternarAtivo(id));
    }
}
