export type StatusFuncionario = 'EM_ANALISE' | 'APROVADO' | 'REPROVADO' | 'CONTRATADO'

export interface Funcionario {
    id: number
    nome: string
    email: string
    telefone: string
    cargo: string
    departamento: string
    salario: number
    cidade: string
    status: StatusFuncionario
}

export interface FuncionarioRequest {
    nome: string
    email: string
    telefone: string
    cargo: string
    departamento: string
    salario: number
    cidade: string
    status: StatusFuncionario
}

export type FuncionarioPatch = Partial<FuncionarioRequest>

export interface Indicadores {
    total: number
    emAnalise: number
    aprovados: number
    reprovados: number
    contratados: number
}

export interface FuncionarioPesquisa{
    nome?: string
    cargo?: string
    status?: StatusFuncionario
}

export interface ApiError {
    codigoErro: number
    mensagem: string
    erros?: string[]
}