import type { Funcionario, StatusFuncionario } from "../types/funcionario";
import Button from "./Button";

interface FuncionarioTableProps {
  funcionarios: Funcionario[];
  onDetalhar: (id: number) => void;
  onEditar: (id: number) => void;
  onExcluir: (id: number) => void;
}

const statusLabels: Record<StatusFuncionario, string> = {
  EM_ANALISE: "Em análise",
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado",
  CONTRATADO: "Contratado",
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function FuncionarioTable({ funcionarios, onDetalhar, onEditar, onExcluir }: FuncionarioTableProps) {
  if (funcionarios.length === 0) {
    return <p>Nenhum funcionário encontrado.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>E-mail</th>
          <th>Cargo</th>
          <th>Departamento</th>
          <th>Salário</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {funcionarios.map((funcionario) => (
          <tr key={funcionario.id}>
            <td>{funcionario.nome}</td>
            <td>{funcionario.email}</td>
            <td>{funcionario.cargo}</td>
            <td>{funcionario.departamento}</td>
            <td>{currencyFormatter.format(funcionario.salario)}</td>
            <td>{statusLabels[funcionario.status]}</td>
            <td>
              <Button type="button" variant="secondary" onClick={() => onDetalhar(funcionario.id)}>Detalhar</Button>{" "}
              <Button type="button" variant="secondary" onClick={() => onEditar(funcionario.id)}>Editar</Button>{" "}
              <Button type="button" variant="danger" onClick={() => onExcluir(funcionario.id)}>Excluir</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
