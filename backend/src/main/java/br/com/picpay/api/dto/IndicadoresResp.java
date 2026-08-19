package br.com.picpay.api.dto;

public record IndicadoresResp(
        Long total,
        Long emAnalise,
        Long aprovados,
        Long reprovados,
        Long contratados
) {
}
