package br.com.fordapp.dto;

import br.com.fordapp.model.AgendamentoVeiculo;
import java.util.UUID;

public class AgendamentoVeiculoResponse {

    private UUID id;
    private String tipo;
    private String rotulo;
    private String hora;
    private Boolean ativo;

    public AgendamentoVeiculoResponse() {}

    public static AgendamentoVeiculoResponse de(AgendamentoVeiculo agendamento) {
        AgendamentoVeiculoResponse dto = new AgendamentoVeiculoResponse();
        dto.id = agendamento.getId();
        dto.tipo = agendamento.getTipo();
        dto.rotulo = agendamento.getRotulo();
        dto.hora = agendamento.getHora();
        dto.ativo = agendamento.getAtivo();
        return dto;
    }

    public UUID getId() { return id; }
    public String getTipo() { return tipo; }
    public String getRotulo() { return rotulo; }
    public String getHora() { return hora; }
    public Boolean getAtivo() { return ativo; }

    public void setId(UUID id) { this.id = id; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setRotulo(String rotulo) { this.rotulo = rotulo; }
    public void setHora(String hora) { this.hora = hora; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}
