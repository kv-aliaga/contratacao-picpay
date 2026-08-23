import { Link, useNavigate } from "react-router-dom";
import FuncionarioForm from "../components/FuncionarioForm";
import { funcionarioService } from "../services/funcionarioService";
import type { FuncionarioRequest } from "../types/funcionario";

export default function NovoFuncionarioPage() {
  const navigate = useNavigate();

  async function criarFuncionario(dados: FuncionarioRequest) {
    await funcionarioService.inserir(dados);
    navigate("/funcionarios");
  }

  return (
    <main>
      <h1>Novo funcionário</h1>
      <p><Link to="/funcionarios">Voltar para funcionários</Link></p>
      <FuncionarioForm onSubmit={criarFuncionario} />
    </main>
  );
}
