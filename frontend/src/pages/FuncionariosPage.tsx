import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import FuncionarioTable from "../components/FuncionarioTable";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Select from "../components/Select";
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
  const [funcionarioParaExcluir, setFuncionarioParaExcluir] = useState<number | null>(null);

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

  async function confirmarExclusao() {
    if (funcionarioParaExcluir === null) return;
    try {
      await funcionarioService.excluir(funcionarioParaExcluir);
      setFuncionarios((current) => current.filter((funcionario) => funcionario.id !== funcionarioParaExcluir));
    } catch {
      setError("Não foi possível excluir o funcionário.");
    } finally {
      setFuncionarioParaExcluir(null);
    }
  }

  return (
    <main>
      <h1>Funcionários</h1>

      <form onSubmit={pesquisar}>
        <fieldset>
          <legend>Pesquisar</legend>
          <Input id="filtro-nome" label="Nome" value={nome} onChange={(event) => setNome(event.target.value)} />
          <Input id="filtro-cargo" label="Cargo" value={cargo} onChange={(event) => setCargo(event.target.value)} />
          <Select
            id="filtro-status"
            label="Status"
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFuncionario | "")}
            options={[
              { value: "", label: "Todos" },
              { value: "EM_ANALISE", label: "Em análise" },
              { value: "APROVADO", label: "Aprovado" },
              { value: "REPROVADO", label: "Reprovado" },
              { value: "CONTRATADO", label: "Contratado" },
            ]}
          />
          <Button type="submit">Pesquisar</Button>{" "}
          <Button type="button" variant="secondary" onClick={limparPesquisa}>Limpar</Button>
        </fieldset>
      </form>

      {loading && <p>Carregando funcionários...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && (
        <FuncionarioTable
          funcionarios={funcionarios}
          onDetalhar={(id) => navigate(`/funcionarios/${id}`)}
          onEditar={(id) => navigate(`/funcionarios/${id}/editar`)}
          onExcluir={(id) => setFuncionarioParaExcluir(id)}
        />
      )}

      <Modal
        isOpen={funcionarioParaExcluir !== null}
        title="Excluir funcionário"
        onClose={() => setFuncionarioParaExcluir(null)}
        footer={(
          <>
            <Button type="button" variant="secondary" onClick={() => setFuncionarioParaExcluir(null)}>Cancelar</Button>{" "}
            <Button type="button" variant="danger" onClick={() => void confirmarExclusao()}>Excluir</Button>
          </>
        )}
      >
        <p>Deseja realmente excluir este funcionário?</p>
      </Modal>
    </main>
  );
}
