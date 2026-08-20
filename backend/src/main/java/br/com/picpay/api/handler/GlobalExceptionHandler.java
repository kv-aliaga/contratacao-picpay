package br.com.picpay.api.handler;

import br.com.picpay.api.dto.ErroResp;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.MethodNotAllowedException;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {
//    Erro 404
//    ID não encontrado
    @ExceptionHandler(FuncionarioNotFoundException.class)
    public ResponseEntity<ErroResp> handleNotFound(FuncionarioNotFoundException fnfe){
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErroResp(404, fnfe.getMessage()));
    }

//    Erro 400
//    Falha no @Valid
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResp> handleValidation(MethodArgumentNotValidException manve){
        List<String> erros = manve.getBindingResult() // pega resultado do @Valid
                .getFieldErrors() // lista todos os campos que falharam
                .stream() // transforma lista em stream
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .toList();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErroResp(400, "Erro de validação: ", erros));
    }

    //    Falha em validações diretas
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErroResp> handleValidation(ConstraintViolationException cve){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErroResp(400, "Erro de validação " + cve.getMessage()));
    }

    //    JSON mal formatado
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErroResp> handleValidation(HttpMessageNotReadableException hmnre){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErroResp(400, "Erro de validação " + hmnre.getMessage()));
    }

    //    Argumento inválido
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErroResp> handleValidation(IllegalArgumentException iae){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErroResp(400, "Argumento inválido " + iae.getMessage()));
    }

    //    Erro 403
//    Forbidden (sem permissão no Spring Security)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErroResp> handleForbidden(AccessDeniedException ade){
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ErroResp(403, "Sem permissão " + ade.getMessage()));
    }

    //    Erro 405
//    HTTP não permitido (ex.: POST em GET)
    @ExceptionHandler(MethodNotAllowedException.class)
    public ResponseEntity<ErroResp> handleMethodNotAllowed(MethodNotAllowedException mnae){
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(new ErroResp(405, "Método não permitido " + mnae.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErroResp> handleConflict(IllegalStateException ise){
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErroResp(409, "Estado inválido na operação " + ise.getMessage()));
    }

//    Erro 500
//    Erro interno
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<ErroResp> handleInternalServerError(NullPointerException npe){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErroResp(500, "Erro interno no servidor: " + npe.getMessage()));
    }

    //    Erro genérico
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResp> handleInternalServerError(Exception e){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErroResp(500, "Erro interno no servidor " + e.getMessage()));
    }
}
