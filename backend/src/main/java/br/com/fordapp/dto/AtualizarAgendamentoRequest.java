package br.com.fordapp.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;

public class AtualizarAgendamentoRequest {

    @Pattern(regexp = "^([01]\\d|2[0-3]):[0-5]\\d$", message = "Hora deve estar no formato HH:mm")
    private String hora;

    @Pattern(regexp = "^[0-6](,[0-6]){0,6}$", message = "diasSemana deve ser dias separados por vírgula (ex: 1,2,3,4,5)")
    private String diasSemana;

    @Min(value = 1, message = "Duração mínima é 1 minuto")
    @Max(value = 120, message = "Duração máxima é 120 minutos")
    private Integer duracaoMinutos;

    @Min(value = 16, message = "Alvo mínimo é 16°C")
    @Max(value = 30, message = "Alvo máximo é 30°C")
    private Integer alvoTemperatura;

    public AtualizarAgendamentoRequest() {}

    public String getHora() { return hora; }
    public String getDiasSemana() { return diasSemana; }
    public Integer getDuracaoMinutos() { return duracaoMinutos; }
    public Integer getAlvoTemperatura() { return alvoTemperatura; }

    public void setHora(String hora) { this.hora = hora; }
    public void setDiasSemana(String diasSemana) { this.diasSemana = diasSemana; }
    public void setDuracaoMinutos(Integer duracaoMinutos) { this.duracaoMinutos = duracaoMinutos; }
    public void setAlvoTemperatura(Integer alvoTemperatura) { this.alvoTemperatura = alvoTemperatura; }
}
