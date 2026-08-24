import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FuncionarioTable from "../components/FuncionarioTable";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Select from "../components/Select";
import { funcionarioService } from "../services/funcionarioService";
import type { Funcionario, FuncionarioPesquisa, StatusFuncionario } from "../types/funcionario";

function lerStatus(value: string | null): StatusFuncionario | "" {
  if (value === "EM_ANALISE" || value === "APROVADO" || value === "REPROVADO" || value === "CONTRATADO") {
    return value;
  }

  return "";
}

export default function FuncionariosPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKey = searchParams.toString();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [nome, setNome] = useState(() => searchParams.get("nome") ?? "");
  const [cargo, setCargo] = useState(() => searchParams.get("cargo") ?? "");
  const [status, setStatus] = useState<StatusFuncionario | "">(() => lerStatus(searchParams.get("status")));
  const [loading, setLoading] = useState(true);
  const [funcionarioParaExcluir, setFuncionarioParaExcluir] = useState<number | null>(null);

  const carregarFuncionarios = useCallback(async (filtros?: FuncionarioPesquisa) => {
    try {
      const resultado = filtros
        ? await funcionarioService.pesquisar(filtros)
        : await funcionarioService.buscar();
      setFuncionarios(resultado);
    } catch {
      // Erros da API são exibidos pela notificação global.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchKey);
    const filtros: FuncionarioPesquisa = {};
    const nomeParam = params.get("nome")?.trim();
    const cargoParam = params.get("cargo")?.trim();
    const statusParam = lerStatus(params.get("status"));

    if (nomeParam) filtros.nome = nomeParam;
    if (cargoParam) filtros.cargo = cargoParam;
    if (statusParam) filtros.status = statusParam;

    // A URL é a fonte do filtro inicial e precisa disparar a consulta ao entrar na página.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregarFuncionarios(Object.keys(filtros).length > 0 ? filtros : undefined);
  }, [carregarFuncionarios, searchKey]);

  function pesquisar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const params = new URLSearchParams();
    if (nome.trim()) params.set("nome", nome.trim());
    if (cargo.trim()) params.set("cargo", cargo.trim());
    if (status) params.set("status", status);

    if (params.toString() === searchKey) {
      const filtros: FuncionarioPesquisa = {};
      if (nome.trim()) filtros.nome = nome.trim();
      if (cargo.trim()) filtros.cargo = cargo.trim();
      if (status) filtros.status = status;
      void carregarFuncionarios(Object.keys(filtros).length > 0 ? filtros : undefined);
      return;
    }

    setSearchParams(params, { replace: true });
  }

  function limparPesquisa() {
    setNome("");
    setCargo("");
    setStatus("");
    setLoading(true);

    if (!searchKey) {
      void carregarFuncionarios();
      return;
    }

    setSearchParams({}, { replace: true });
  }

  async function confirmarExclusao() {
    if (funcionarioParaExcluir === null) return;
    try {
      await funcionarioService.excluir(funcionarioParaExcluir);
      setFuncionarios((current) => current.filter((funcionario) => funcionario.id !== funcionarioParaExcluir));
    } catch {
      // Erros da API são exibidos pela notificação global.
    } finally {
      setFuncionarioParaExcluir(null);
    }
  }

  return (
    <main>
      <h1>Funcionários</h1>

      <form className="employee-filters" onSubmit={pesquisar}>
        <fieldset>
          <legend>Pesquisar</legend>
          <Input id="filtro-nome" label="Nome" value={nome} onChange={(event) => setNome(event.target.value)} placeholder="Ex.: João" />
          <Input id="filtro-cargo" label="Cargo" value={cargo} onChange={(event) => setCargo(event.target.value)} placeholder="Ex.: Desenvolvedor" />
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
          <Button type="submit">Pesquisar</Button>
          <Button type="button" variant="secondary" onClick={limparPesquisa}>Limpar</Button>
        </fieldset>
      </form>

      {loading && <p>Carregando funcionários...</p>}
      {!loading && (
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
