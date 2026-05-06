package br.com.fordapp.controller;

import br.com.fordapp.dto.VeiculoResponse;
import br.com.fordapp.service.VeiculoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/veiculos")
public class VeiculoController {

    private final VeiculoService veiculoService;

    public VeiculoController(VeiculoService veiculoService) {
        this.veiculoService = veiculoService;
    }

    @GetMapping("/{id}")
    ResponseEntity<VeiculoResponse> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(veiculoService.buscarPorId(id));
    }
}
