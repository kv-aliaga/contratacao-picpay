package br.com.picpay.api.mapper;

import br.com.picpay.api.dto.FuncionarioReq;
import br.com.picpay.api.dto.FuncionarioResp;
import br.com.picpay.api.model.Funcionario;
import org.springframework.stereotype.Component;

@Component
public class FuncionarioMapper {
    public FuncionarioResp toResponse(Funcionario funcionario) {
        return new FuncionarioResp(
                funcionario.getId(),
                funcionario.getNome(),
                funcionario.getEmail(),
                funcionario.getTelefone(),
                funcionario.getCargo(),
                funcionario.getDepartamento(),
                funcionario.getSalario(),
                funcionario.getCidade(),
                funcionario.getStatus()
        );
    }

    public Funcionario toEntity(FuncionarioReq dto) {
        Funcionario funcionario = new Funcionario();

        funcionario.setCargo(dto.cargo());
        funcionario.setNome(dto.nome());
        funcionario.setCidade(dto.cidade());
        funcionario.setDepartamento(dto.departamento());
        funcionario.setEmail(dto.email());
        funcionario.setSalario(dto.salario());
        funcionario.setStatus(dto.status());
        funcionario.setTelefone(dto.telefone());

        return funcionario;
    }
}
