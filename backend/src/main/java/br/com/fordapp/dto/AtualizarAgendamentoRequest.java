package br.com.fordapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class AtualizarAgendamentoRequest {

    @NotBlank(message = "Hora é obrigatória")
    @Pattern(regexp = "^([01]\\d|2[0-3]):[0-5]\\d$", message = "Hora deve estar no formato HH:mm")
    private String hora;

    @NotBlank(message = "Dias da semana é obrigatório")
    @Pattern(regexp = "DIARIAMENTE|DIAS_UTEIS|FINS_DE_SEMANA", message = "Valor inválido para diasSemana")
    private String diasSemana;

    public AtualizarAgendamentoRequest() {}

    public String getHora() { return hora; }
    public String getDiasSemana() { return diasSemana; }

    public void setHora(String hora) { this.hora = hora; }
    public void setDiasSemana(String diasSemana) { this.diasSemana = diasSemana; }
}
