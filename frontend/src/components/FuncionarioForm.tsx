import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Funcionario, FuncionarioRequest, StatusFuncionario } from "../types/funcionario";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";

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
      <Input id="nome" name="nome" label="Nome" value={form.nome} onChange={handleChange} required />
      <Input id="email" name="email" type="email" label="E-mail" value={form.email} onChange={handleChange} required />
      <Input
        id="telefone"
        name="telefone"
        label="Telefone (11 números)"
        value={form.telefone}
        onChange={handleChange}
        inputMode="numeric"
        maxLength={11}
        pattern="[0-9]{11}"
        required
      />
      <Input id="cargo" name="cargo" label="Cargo" value={form.cargo} onChange={handleChange} required />
      <Input id="departamento" name="departamento" label="Departamento" value={form.departamento} onChange={handleChange} required />
      <Input id="salario" name="salario" type="number" label="Salário" min="0.01" step="0.01" value={form.salario || ""} onChange={handleChange} required />
      <Input id="cidade" name="cidade" label="Cidade" value={form.cidade} onChange={handleChange} required />
      <Select id="status" name="status" label="Status" value={form.status} onChange={handleChange} options={statusOptions} required />

      {error && <p role="alert">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
