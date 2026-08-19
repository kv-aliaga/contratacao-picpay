package br.com.picpay.api.dto;
import java.util.List;

public record ErroResp(
        int codigoErro,
        String mensagem,
        List<String> erros
) {
    public ErroResp(int codigoErro, String mensagem) {
        this(codigoErro, mensagem, null);
    }
}