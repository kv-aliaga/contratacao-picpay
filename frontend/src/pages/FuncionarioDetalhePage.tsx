import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { funcionarioService } from "../services/funcionarioService";
import type { Funcionario } from "../types/funcionario";

export default function FuncionarioDetalhePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const funcionarioId = Number(id);
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function carregarFuncionario() {
      if (!Number.isInteger(funcionarioId)) {
        setError("Identificador inválido.");
        setLoading(false);
        return;
      }

      try {
        setFuncionario(await funcionarioService.buscarPorId(funcionarioId));
      } catch {
        setError("Funcionário não encontrado.");
      } finally {
        setLoading(false);
      }
    }

    void carregarFuncionario();
  }, [funcionarioId]);

  async function excluirFuncionario() {
    if (!funcionario || !window.confirm("Deseja realmente excluir este funcionário?")) return;
    await funcionarioService.excluir(funcionario.id);
    navigate("/funcionarios");
  }

  return (
    <main>
      <h1>Detalhes do funcionário</h1>
      <p><Link to="/funcionarios">Voltar para funcionários</Link></p>
      {loading && <p>Carregando...</p>}
      {error && <p role="alert">{error}</p>}
      {funcionario && (
        <section>
          <dl>
            <dt>Nome</dt><dd>{funcionario.nome}</dd>
            <dt>E-mail</dt><dd>{funcionario.email}</dd>
            <dt>Telefone</dt><dd>{funcionario.telefone}</dd>
            <dt>Cargo</dt><dd>{funcionario.cargo}</dd>
            <dt>Departamento</dt><dd>{funcionario.departamento}</dd>
            <dt>Salário</dt><dd>{funcionario.salario}</dd>
            <dt>Cidade</dt><dd>{funcionario.cidade}</dd>
            <dt>Status</dt><dd>{funcionario.status}</dd>
          </dl>
          <button type="button" onClick={() => navigate(`/funcionarios/${funcionario.id}/editar`)}>Editar</button>{" "}
          <button type="button" onClick={() => void excluirFuncionario()}>Excluir</button>
        </section>
      )}
    </main>
  );
}
