package br.com.fordapp.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;

public class AtualizarClimatizacaoRequest {

    private Boolean sistemaLigado;

    @Pattern(regexp = "^(ac|aquecedor|desembacador)$", message = "modo deve ser ac, aquecedor ou desembacador")
    private String modo;

    @Min(value = 1, message = "Velocidade mínima é 1")
    @Max(value = 6, message = "Velocidade máxima é 6")
    private Integer velocidadeVentilador;

    public AtualizarClimatizacaoRequest() {}

    public Boolean getSistemaLigado() { return sistemaLigado; }
    public String getModo() { return modo; }
    public Integer getVelocidadeVentilador() { return velocidadeVentilador; }

    public void setSistemaLigado(Boolean sistemaLigado) { this.sistemaLigado = sistemaLigado; }
    public void setModo(String modo) { this.modo = modo; }
    public void setVelocidadeVentilador(Integer velocidadeVentilador) { this.velocidadeVentilador = velocidadeVentilador; }
}
