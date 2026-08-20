import { api } from './api'
import type { Funcionario, FuncionarioPatch, FuncionarioRequest, FuncionarioPesquisa, Indicadores  } from "../types/funcionario.ts";

export const funcionarioService = {
    async buscar(): Promise<Funcionario[]> {
        const response = await api.get<Funcionario[]>('/funcionarios')
        return response.data
    },

    async buscarPorId(id: number): Promise<Funcionario> {
        const response = await api.get<Funcionario>(`/funcionarios/${id}`)
        return response.data
    },

    async inserir(funcionario: FuncionarioRequest): Promise<Funcionario> {
        const response = await api.post('/funcionarios', funcionario)
        return response.data
    },

    async atualizar(id: number, funcionario: FuncionarioRequest): Promise<Funcionario> {
        const response = await api.put(`/funcionarios/${id}`, funcionario)
        return response.data
    },

    async patch(id: number, campos: FuncionarioPatch): Promise<Funcionario> {
        const response = await api.patch(`/funcionarios/${id}`, campos)
        return response.data
    },

    async excluir(id: number): Promise<void> {
        await api.delete(`/funcionarios/${id}`)
    },

    async pesquisar(filtros: FuncionarioPesquisa): Promise<Funcionario[]> {
        const response = await api.get(`/funcionarios/pesquisa`, {
            params: filtros
        })
        return response.data
    },

    async buscarIndicadores(): Promise<Indicadores> {
        const response = await api.get(`/funcionarios/indicadores`)
        return response.data
    }
}