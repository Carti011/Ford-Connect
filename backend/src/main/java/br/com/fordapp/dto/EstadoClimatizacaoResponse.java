package br.com.fordapp.dto;

import br.com.fordapp.model.EstadoClimatizacao;

import java.util.List;
import java.util.UUID;

public class EstadoClimatizacaoResponse {

    private UUID id;
    private UUID veiculoId;
    private Boolean sistemaLigado;
    private String modo;
    private Integer velocidadeVentilador;
    private Integer temperaturaInterna;
    private Integer temperaturaExterna;
    private List<ZonaClimatizacaoResponse> zonas;

    public EstadoClimatizacaoResponse() {}

    public static EstadoClimatizacaoResponse de(EstadoClimatizacao estado, int temperaturaInterna, int temperaturaExterna) {
        EstadoClimatizacaoResponse dto = new EstadoClimatizacaoResponse();
        dto.id = estado.getId();
        dto.veiculoId = estado.getVeiculo().getId();
        dto.sistemaLigado = estado.getSistemaLigado();
        dto.modo = estado.getModo();
        dto.velocidadeVentilador = estado.getVelocidadeVentilador();
        dto.temperaturaInterna = temperaturaInterna;
        dto.temperaturaExterna = temperaturaExterna;
        dto.zonas = estado.getZonas().stream()
                .map(ZonaClimatizacaoResponse::de)
                .toList();
        return dto;
    }

    public UUID getId() { return id; }
    public UUID getVeiculoId() { return veiculoId; }
    public Boolean getSistemaLigado() { return sistemaLigado; }
    public String getModo() { return modo; }
    public Integer getVelocidadeVentilador() { return velocidadeVentilador; }
    public Integer getTemperaturaInterna() { return temperaturaInterna; }
    public Integer getTemperaturaExterna() { return temperaturaExterna; }
    public List<ZonaClimatizacaoResponse> getZonas() { return zonas; }

    public void setId(UUID id) { this.id = id; }
    public void setVeiculoId(UUID veiculoId) { this.veiculoId = veiculoId; }
    public void setSistemaLigado(Boolean sistemaLigado) { this.sistemaLigado = sistemaLigado; }
    public void setModo(String modo) { this.modo = modo; }
    public void setVelocidadeVentilador(Integer velocidadeVentilador) { this.velocidadeVentilador = velocidadeVentilador; }
    public void setTemperaturaInterna(Integer temperaturaInterna) { this.temperaturaInterna = temperaturaInterna; }
    public void setTemperaturaExterna(Integer temperaturaExterna) { this.temperaturaExterna = temperaturaExterna; }
    public void setZonas(List<ZonaClimatizacaoResponse> zonas) { this.zonas = zonas; }
}
