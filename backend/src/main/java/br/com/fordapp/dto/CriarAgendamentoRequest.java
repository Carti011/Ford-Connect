package br.com.fordapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class CriarAgendamentoRequest {

    @NotBlank(message = "Tipo é obrigatório")
    private String tipo;

    @NotBlank(message = "Rótulo é obrigatório")
    private String rotulo;

    @Pattern(regexp = "^([01]\\d|2[0-3]):[0-5]\\d$", message = "Hora deve estar no formato HH:mm")
    private String hora;

    @Pattern(regexp = "^[0-6](,[0-6]){0,6}$", message = "diasSemana deve ser dias separados por vírgula (ex: 1,2,3,4,5)")
    private String diasSemana;

    public CriarAgendamentoRequest() {}

    public String getTipo() { return tipo; }
    public String getRotulo() { return rotulo; }
    public String getHora() { return hora; }
    public String getDiasSemana() { return diasSemana; }

    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setRotulo(String rotulo) { this.rotulo = rotulo; }
    public void setHora(String hora) { this.hora = hora; }
    public void setDiasSemana(String diasSemana) { this.diasSemana = diasSemana; }
}
