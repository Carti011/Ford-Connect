package br.com.fordapp.controller;

import br.com.fordapp.service.DemoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/demo")
public class DemoController {

    private final DemoService demoService;

    public DemoController(DemoService demoService) {
        this.demoService = demoService;
    }

    @PostMapping("/resetar")
    ResponseEntity<Void> resetar() {
        demoService.resetar();
        return ResponseEntity.noContent().build();
    }
}
