package br.com.picpay.api.handler;

public class RegexException extends RuntimeException{
    public RegexException (String campo) {
        super("O conteúdo digitado em  " + campo + " é inválido");
    }   
}