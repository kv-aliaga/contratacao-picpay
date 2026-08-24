package br.com.picpay.api.validation;

import java.util.List;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

import br.com.picpay.api.handler.UniqueException;
import br.com.picpay.api.handler.RegexException;
import br.com.picpay.api.model.Funcionario;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class FuncionarioValidation {
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    private static final Pattern TELEFONE_PATTERN = Pattern.compile("^\\d{10,11}$");

    public void validarEmail(String email, Long idIgnorar, List<Funcionario> funcionarios) {
        if (!EMAIL_PATTERN.matcher(email).matches()) throw new RegexException(email);
        boolean emailExiste = funcionarios.stream()
                .anyMatch(funcionario -> funcionario.getEmail().equalsIgnoreCase(email) && !mesmoFuncionario(funcionario, idIgnorar));

        if (emailExiste) throw new UniqueException("email");
    }

    public void validarTelefone(String telefone, Long idIgnorar, List<Funcionario> funcionarios) {
        if (!TELEFONE_PATTERN.matcher(telefone).matches()) throw new RegexException(telefone);
        boolean telefoneExiste = funcionarios.stream()
                .anyMatch(funcionario -> funcionario.getTelefone().equals(telefone) && !mesmoFuncionario(funcionario, idIgnorar));

        if (telefoneExiste) throw new UniqueException("telefone");
    }

    public void validarDadosContato(String email, String telefone, Long idIgnorar, List<Funcionario> funcionarios) {
        validarEmail(email, idIgnorar, funcionarios);
        validarTelefone(telefone, idIgnorar, funcionarios);
    }

    private boolean mesmoFuncionario(Funcionario funcionario, Long idIgnorar) {
        return idIgnorar != null && funcionario.getId().equals(idIgnorar);
    }
}