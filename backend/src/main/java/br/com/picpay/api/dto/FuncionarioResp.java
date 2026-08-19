package br.com.picpay.api.dto;

import br.com.picpay.api.model.Status;

import java.math.BigDecimal;

public record FuncionarioResp(
        Long id,
        String nome,
        String email,
        String telefone,
        String cargo,
        String departamento,
        BigDecimal salario,
        String cidade,
        Status status
) {
}
