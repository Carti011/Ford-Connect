package br.com.fordapp.dto;

import br.com.fordapp.model.Veiculo;
import java.util.UUID;

public class VeiculoResponse {

    private UUID id;
    private String nomeProprietario;
    private String marca;
    private String modelo;
    private String versao;
    private Integer ano;
    private String placa;
    private Integer quilometragem;
    private String statusVeiculo;
    private Integer nivelCombustivel;
    private Integer autonomiaKm;

    public VeiculoResponse() {}

    public static VeiculoResponse de(Veiculo veiculo) {
        VeiculoResponse dto = new VeiculoResponse();
        dto.id = veiculo.getId();
        dto.nomeProprietario = veiculo.getNomeProprietario();
        dto.marca = veiculo.getMarca();
        dto.modelo = veiculo.getModelo();
        dto.versao = veiculo.getVersao();
        dto.ano = veiculo.getAno();
        dto.placa = veiculo.getPlaca();
        dto.quilometragem = veiculo.getQuilometragem();
        dto.statusVeiculo = veiculo.getStatusVeiculo();
        dto.nivelCombustivel = veiculo.getNivelCombustivel();
        dto.autonomiaKm = veiculo.getAutonomiaKm();
        return dto;
    }

    public UUID getId() { return id; }
    public String getNomeProprietario() { return nomeProprietario; }
    public String getMarca() { return marca; }
    public String getModelo() { return modelo; }
    public String getVersao() { return versao; }
    public Integer getAno() { return ano; }
    public String getPlaca() { return placa; }
    public Integer getQuilometragem() { return quilometragem; }
    public String getStatusVeiculo() { return statusVeiculo; }
    public Integer getNivelCombustivel() { return nivelCombustivel; }
    public Integer getAutonomiaKm() { return autonomiaKm; }

    public void setId(UUID id) { this.id = id; }
    public void setNomeProprietario(String nomeProprietario) { this.nomeProprietario = nomeProprietario; }
    public void setMarca(String marca) { this.marca = marca; }
    public void setModelo(String modelo) { this.modelo = modelo; }
    public void setVersao(String versao) { this.versao = versao; }
    public void setAno(Integer ano) { this.ano = ano; }
    public void setPlaca(String placa) { this.placa = placa; }
    public void setQuilometragem(Integer quilometragem) { this.quilometragem = quilometragem; }
    public void setStatusVeiculo(String statusVeiculo) { this.statusVeiculo = statusVeiculo; }
    public void setNivelCombustivel(Integer nivelCombustivel) { this.nivelCombustivel = nivelCombustivel; }
    public void setAutonomiaKm(Integer autonomiaKm) { this.autonomiaKm = autonomiaKm; }
}
