import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import FuncionarioTable from "../components/FuncionarioTable";
import { funcionarioService } from "../services/funcionarioService";
import type { Funcionario, FuncionarioPesquisa, StatusFuncionario } from "../types/funcionario";

export default function FuncionariosPage() {
  const navigate = useNavigate();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [status, setStatus] = useState<StatusFuncionario | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const carregarFuncionarios = useCallback(async (filtros?: FuncionarioPesquisa) => {
    try {
      const resultado = filtros
        ? await funcionarioService.pesquisar(filtros)
        : await funcionarioService.buscar();
      setFuncionarios(resultado);
      setError("");
    } catch {
      setError("Não foi possível carregar os funcionários.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // O carregamento inicial precisa acontecer quando a página entra em cena.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregarFuncionarios();
  }, [carregarFuncionarios]);

  function pesquisar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const filtros: FuncionarioPesquisa = {};
    if (nome.trim()) filtros.nome = nome.trim();
    if (cargo.trim()) filtros.cargo = cargo.trim();
    if (status) filtros.status = status;
    void carregarFuncionarios(filtros);
  }

  function limparPesquisa() {
    setNome("");
    setCargo("");
    setStatus("");
    void carregarFuncionarios();
  }

  async function excluirFuncionario(id: number) {
    if (!window.confirm("Deseja realmente excluir este funcionário?")) return;

    try {
      await funcionarioService.excluir(id);
      setFuncionarios((current) => current.filter((funcionario) => funcionario.id !== id));
    } catch {
      setError("Não foi possível excluir o funcionário.");
    }
  }

  return (
    <main>
      <h1>Funcionários</h1>
      <p>
        <Link to="/">Dashboard</Link>{" | "}
        <Link to="/funcionarios/novo">Novo funcionário</Link>
      </p>

      <form onSubmit={pesquisar}>
        <fieldset>
          <legend>Pesquisar</legend>
          <label htmlFor="filtro-nome">Nome</label>{" "}
          <input id="filtro-nome" value={nome} onChange={(event) => setNome(event.target.value)} />{" "}
          <label htmlFor="filtro-cargo">Cargo</label>{" "}
          <input id="filtro-cargo" value={cargo} onChange={(event) => setCargo(event.target.value)} />{" "}
          <label htmlFor="filtro-status">Status</label>{" "}
          <select id="filtro-status" value={status} onChange={(event) => setStatus(event.target.value as StatusFuncionario | "")}>
            <option value="">Todos</option>
            <option value="EM_ANALISE">Em análise</option>
            <option value="APROVADO">Aprovado</option>
            <option value="REPROVADO">Reprovado</option>
            <option value="CONTRATADO">Contratado</option>
          </select>{" "}
          <button type="submit">Pesquisar</button>{" "}
          <button type="button" onClick={limparPesquisa}>Limpar</button>
        </fieldset>
      </form>

      {loading && <p>Carregando funcionários...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && (
        <FuncionarioTable
          funcionarios={funcionarios}
          onDetalhar={(id) => navigate(`/funcionarios/${id}`)}
          onEditar={(id) => navigate(`/funcionarios/${id}/editar`)}
          onExcluir={excluirFuncionario}
        />
      )}
    </main>
  );
}
