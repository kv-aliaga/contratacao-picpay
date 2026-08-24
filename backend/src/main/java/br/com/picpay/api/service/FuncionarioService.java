package br.com.picpay.api.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import br.com.picpay.api.dto.FuncionarioReq;
import br.com.picpay.api.dto.FuncionarioResp;
import br.com.picpay.api.dto.IndicadoresResp;
import br.com.picpay.api.handler.FuncionarioNotFoundException;
import br.com.picpay.api.mapper.FuncionarioMapper;
import br.com.picpay.api.model.Funcionario;
import br.com.picpay.api.model.Status;
import br.com.picpay.api.validation.FuncionarioValidation;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FuncionarioService {
    private Long ultimoId = 0L;
    private final FuncionarioMapper mapper;
    private final FuncionarioValidation validation;
    private final List<Funcionario> funcionarios = new ArrayList<>();

    public FuncionarioResp inserir(FuncionarioReq dto){
        Funcionario funcionario = mapper.toEntity(dto);
        validation.validarDadosContato(dto.email(), dto.telefone(), null, funcionarios);

        funcionario.setId(gerarId());
        funcionarios.add(funcionario);

        return mapper.toResponse(funcionario);
    }

    public List<FuncionarioResp> buscarTodos() {
        return funcionarios.stream()
                .map(mapper::toResponse)
                .toList();
    }

    public FuncionarioResp buscarPorId(Long id) {
        Funcionario funcionario = getFuncionarioById(id);
        return mapper.toResponse(funcionario);
    }

    public FuncionarioResp atualizar(Long id, FuncionarioReq dto) {
        Funcionario funcionario = getFuncionarioById(id);
        validation.validarDadosContato(dto.email(), dto.telefone(), id, funcionarios);

        funcionario.setCargo(dto.cargo());
        funcionario.setNome(dto.nome());
        funcionario.setCidade(dto.cidade());
        funcionario.setDepartamento(dto.departamento());
        funcionario.setEmail(dto.email());
        funcionario.setSalario(dto.salario());
        funcionario.setStatus(dto.status());
        funcionario.setTelefone(dto.telefone());

        return mapper.toResponse(funcionario);
    }

    public FuncionarioResp patch(Long id, Map<String, Object> campos){
        Funcionario funcionario = getFuncionarioById(id);

        if (campos.containsKey("cargo")) funcionario.setCargo((String) campos.get("cargo"));
        if (campos.containsKey("nome")) funcionario.setNome((String) campos.get("nome"));
        if (campos.containsKey("cidade")) funcionario.setCidade((String) campos.get("cidade"));
        if (campos.containsKey("departamento")) funcionario.setDepartamento((String) campos.get("departamento"));
        if (campos.containsKey("salario")) funcionario.setSalario(new BigDecimal(campos.get("salario").toString()));
        if (campos.containsKey("status")) funcionario.setStatus(Status.valueOf(campos.get("status").toString().toUpperCase()));

        if (campos.containsKey("email")) {
            String email = (String) campos.get("email");
            validation.validarEmail(email, id, funcionarios);
            funcionario.setEmail(email);
        }

        if (campos.containsKey("telefone")) {
            String telefone = (String) campos.get("telefone");
            validation.validarTelefone(telefone, id, funcionarios);
            funcionario.setTelefone(telefone);
        }

        return mapper.toResponse(funcionario);
    }

    public void excluir(Long id) {
        funcionarios.removeIf(funcionario -> funcionario.getId().equals(id));
    }

    public List<FuncionarioResp> pesquisar(String nome, String cargo, Status status) {
        return funcionarios.stream()
                .filter(funcionario -> (nome == null || funcionario.getNome().equalsIgnoreCase(nome)) &&
                        (cargo == null || funcionario.getCargo().equalsIgnoreCase(cargo)) &&
                        (status == null || funcionario.getStatus() == status))
                .map(mapper::toResponse)
                .toList();
    }

    public IndicadoresResp gerarIndicadores() {
        long total = funcionarios.size();

        Long emAnalise = funcionarios.stream().filter(funcionario -> funcionario.getStatus() == Status.EM_ANALISE).count();
        Long aprovados = funcionarios.stream().filter(funcionario -> funcionario.getStatus() == Status.APROVADO).count();
        Long reprovados = funcionarios.stream().filter(funcionario -> funcionario.getStatus() == Status.REPROVADO).count();
        Long contratados = funcionarios.stream().filter(funcionario -> funcionario.getStatus() == Status.CONTRATADO).count();

        return new IndicadoresResp(total,emAnalise,aprovados,reprovados,contratados);
    }

    private Long gerarId() {
        return ultimoId ++;
    }

    private Funcionario getFuncionarioById(Long id) {
        return funcionarios.stream()
                .filter(funcionario -> funcionario.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new FuncionarioNotFoundException(id));
    }
}