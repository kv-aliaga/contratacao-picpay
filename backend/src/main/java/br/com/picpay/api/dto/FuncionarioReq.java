package br.com.picpay.api.dto;

import br.com.picpay.api.model.Status;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record FuncionarioReq(
        @NotBlank
        String nome,

        @NotBlank
        @Email
        String email,

        @NotBlank
        @Pattern(regexp = "\\d{11}", message = "Telefone deve estar no formato XXXXXXXXXXX")
        String telefone,

        @NotBlank
        String cargo,

        @NotBlank
        String departamento,

        @NotNull
        @Positive
        BigDecimal salario,

        @NotBlank
        String cidade,

        @NotNull
        Status status
) {
}
