package br.com.fordapp.controller;

import br.com.fordapp.dto.AtualizarClimatizacaoRequest;
import br.com.fordapp.dto.AtualizarZonaClimatizacaoRequest;
import br.com.fordapp.dto.EstadoClimatizacaoResponse;
import br.com.fordapp.dto.ZonaClimatizacaoResponse;
import br.com.fordapp.service.EstadoClimatizacaoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/veiculos/{idVeiculo}/climatizacao")
public class ClimatizacaoController {

    private final EstadoClimatizacaoService climatizacaoService;

    public ClimatizacaoController(EstadoClimatizacaoService climatizacaoService) {
        this.climatizacaoService = climatizacaoService;
    }

    @GetMapping
    public ResponseEntity<EstadoClimatizacaoResponse> buscar(@PathVariable UUID idVeiculo) {
        return ResponseEntity.ok(climatizacaoService.buscarPorVeiculo(idVeiculo));
    }

    @PatchMapping
    public ResponseEntity<EstadoClimatizacaoResponse> atualizar(
            @PathVariable UUID idVeiculo,
            @Valid @RequestBody AtualizarClimatizacaoRequest request) {
        return ResponseEntity.ok(climatizacaoService.atualizar(idVeiculo, request));
    }

    @PatchMapping("/zonas/{idZona}")
    public ResponseEntity<ZonaClimatizacaoResponse> atualizarZona(
            @PathVariable UUID idVeiculo,
            @PathVariable UUID idZona,
            @Valid @RequestBody AtualizarZonaClimatizacaoRequest request) {
        return ResponseEntity.ok(climatizacaoService.atualizarZona(idVeiculo, idZona, request));
    }
}
