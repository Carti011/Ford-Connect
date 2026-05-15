package br.com.fordapp.controller;

import br.com.fordapp.dto.RecomendacaoResponse;
import br.com.fordapp.service.RecomendacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/veiculos")
public class RecomendacaoController {

    private final RecomendacaoService recomendacaoService;

    public RecomendacaoController(RecomendacaoService recomendacaoService) {
        this.recomendacaoService = recomendacaoService;
    }

    @GetMapping("/{id}/recomendacoes")
    ResponseEntity<List<RecomendacaoResponse>> buscarRecomendacoes(@PathVariable UUID id) {
        return ResponseEntity.ok(recomendacaoService.buscarPendentesPorVeiculo(id));
    }
}
