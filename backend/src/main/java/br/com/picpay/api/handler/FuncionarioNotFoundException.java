package br.com.picpay.api.handler;

public class FuncionarioNotFoundException extends RuntimeException {
    public FuncionarioNotFoundException(Long id) {
        super("Funcionário com ID " + id + " não encontrado");
    }
}
