package br.com.picpay.api.handler;

public class UniqueException extends RuntimeException{
    public UniqueException (String campo) {
        super("Já existe um registro com o conteúdo deste " + campo);
    }
}
