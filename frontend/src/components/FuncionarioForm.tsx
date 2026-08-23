import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Funcionario, FuncionarioRequest, StatusFuncionario } from "../types/funcionario";

interface FuncionarioFormProps {
  funcionario?: Funcionario;
  onSubmit: (dados: FuncionarioRequest) => Promise<void>;
  loading?: boolean;
}

const statusOptions: Array<{ value: StatusFuncionario; label: string }> = [
  { value: "EM_ANALISE", label: "Em análise" },
  { value: "APROVADO", label: "Aprovado" },
  { value: "REPROVADO", label: "Reprovado" },
  { value: "CONTRATADO", label: "Contratado" },
];

const emptyForm: FuncionarioRequest = {
  nome: "",
  email: "",
  telefone: "",
  cargo: "",
  departamento: "",
  salario: 0,
  cidade: "",
  status: "EM_ANALISE",
};

export default function FuncionarioForm({ funcionario, onSubmit, loading = false }: FuncionarioFormProps) {
  const [form, setForm] = useState<FuncionarioRequest>(funcionario ?? emptyForm);
  const [error, setError] = useState("");

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === "salario" ? Number(value) : value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (form.telefone.length !== 11) {
      setError("O telefone deve conter 11 números.");
      return;
    }

    if (form.salario <= 0) {
      setError("O salário deve ser maior que zero.");
      return;
    }

    try {
      await onSubmit(form);
    } catch {
      setError("Não foi possível salvar o funcionário.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <label htmlFor="nome">Nome</label><br />
        <input id="nome" name="nome" value={form.nome} onChange={handleChange} required />
      </p>

      <p>
        <label htmlFor="email">E-mail</label><br />
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
      </p>

      <p>
        <label htmlFor="telefone">Telefone (11 números)</label><br />
        <input
          id="telefone"
          name="telefone"
          value={form.telefone}
          onChange={handleChange}
          inputMode="numeric"
          maxLength={11}
          pattern="[0-9]{11}"
          required
        />
      </p>

      <p>
        <label htmlFor="cargo">Cargo</label><br />
        <input id="cargo" name="cargo" value={form.cargo} onChange={handleChange} required />
      </p>

      <p>
        <label htmlFor="departamento">Departamento</label><br />
        <input id="departamento" name="departamento" value={form.departamento} onChange={handleChange} required />
      </p>

      <p>
        <label htmlFor="salario">Salário</label><br />
        <input id="salario" name="salario" type="number" min="0.01" step="0.01" value={form.salario || ""} onChange={handleChange} required />
      </p>

      <p>
        <label htmlFor="cidade">Cidade</label><br />
        <input id="cidade" name="cidade" value={form.cidade} onChange={handleChange} required />
      </p>

      <p>
        <label htmlFor="status">Status</label><br />
        <select id="status" name="status" value={form.status} onChange={handleChange} required>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </p>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
