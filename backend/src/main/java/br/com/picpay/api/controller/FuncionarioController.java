package br.com.picpay.api.controller;

import br.com.picpay.api.dto.FuncionarioReq;
import br.com.picpay.api.dto.FuncionarioResp;
import br.com.picpay.api.dto.IndicadoresResp;
import br.com.picpay.api.model.Status;
import br.com.picpay.api.service.FuncionarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/funcionarios")
@RequiredArgsConstructor
public class FuncionarioController {
    private final FuncionarioService service;

    @PostMapping
    public ResponseEntity<FuncionarioResp> inserir(@RequestBody @Valid FuncionarioReq dto){
        return ResponseEntity.status(201).body(service.inserir(dto));
    }

    @GetMapping
    public ResponseEntity<List<FuncionarioResp>> listar(){
        return ResponseEntity.ok(service.buscarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FuncionarioResp> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FuncionarioResp> atualizar(@PathVariable Long id, @RequestBody @Valid FuncionarioReq dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<FuncionarioResp> patch(@PathVariable Long id, @RequestBody Map<String, Object> campos) {
        return ResponseEntity.ok(service.patch(id, campos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pesquisa")
    public ResponseEntity<List<FuncionarioResp>> pesquisar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cargo,
            @RequestParam(required = false) Status status
    ) {
        return ResponseEntity.ok(service.pesquisar(nome, cargo, status));
    }

    @GetMapping("/indicadores")
    public ResponseEntity<IndicadoresResp> indicadores() {
        return ResponseEntity.ok(service.gerarIndicadores());
    }
}
