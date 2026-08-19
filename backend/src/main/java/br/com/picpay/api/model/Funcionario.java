package br.com.picpay.api.model;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class Funcionario {
    Long id;
    String nome;
    String email;
    String telefone;
    String cargo;
    String departamento;
    BigDecimal salario;
    String cidade;
    Status status;
}
