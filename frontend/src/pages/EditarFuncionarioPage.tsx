import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FuncionarioForm from "../components/FuncionarioForm";
import { funcionarioService } from "../services/funcionarioService";
import type { Funcionario, FuncionarioRequest } from "../types/funcionario";

export default function EditarFuncionarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const funcionarioId = Number(id);
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function carregarFuncionario() {
      if (!Number.isInteger(funcionarioId)) {
        setLoading(false);
        return;
      }

      try {
        setFuncionario(await funcionarioService.buscarPorId(funcionarioId));
      } catch {
        // Erros da API são exibidos pela notificação global.
      } finally {
        setLoading(false);
      }
    }

    void carregarFuncionario();
  }, [funcionarioId]);

  async function salvarFuncionario(dados: FuncionarioRequest) {
    setSaving(true);
    try {
      await funcionarioService.atualizar(funcionarioId, dados);
      navigate(`/funcionarios/${funcionarioId}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main>
      <h1>Editar funcionário</h1>
      <p><Link to="/funcionarios">Voltar para funcionários</Link></p>
      {loading && <p>Carregando...</p>}
      {funcionario && <FuncionarioForm funcionario={funcionario} onSubmit={salvarFuncionario} loading={saving} />}
    </main>
  );
}
