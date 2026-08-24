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

type FormErrors = Partial<Record<keyof FuncionarioRequest, string>>;

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatCurrency(value: number) {
  return value > 0 ? currencyFormatter.format(value) : "";
}

function validateForm(data: FuncionarioRequest) {
  const errors: FormErrors = {};

  if (!data.nome.trim()) errors.nome = "Informe o nome.";
  if (!data.email.trim()) errors.email = "Informe o e-mail.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Informe um e-mail válido.";
  if (!/^\d{11}$/.test(data.telefone)) errors.telefone = "Informe um telefone com DDD e 11 números.";
  if (!data.cargo.trim()) errors.cargo = "Informe o cargo.";
  if (!data.departamento.trim()) errors.departamento = "Informe o departamento.";
  if (data.salario <= 0) errors.salario = "Informe um salário maior que zero.";
  if (!data.cidade.trim()) errors.cidade = "Informe a cidade.";
  if (!data.status) errors.status = "Selecione o status.";

  return errors;
}

export default function FuncionarioForm({ funcionario, onSubmit, loading = false }: FuncionarioFormProps) {
  const [form, setForm] = useState<FuncionarioRequest>(funcionario ?? emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    const field = name as keyof FuncionarioRequest;
    let nextValue: string | number = value;

    if (field === "telefone") {
      nextValue = value.replace(/\D/g, "").slice(0, 11);
    } else if (field === "salario") {
      const digits = value.replace(/\D/g, "").slice(0, 12);
      nextValue = digits ? Number(digits) / 100 : 0;
    }

    setForm((current) => ({...current, [field]: nextValue}) as FuncionarioRequest);
    setErrors((current) => ({...current, [field]: undefined}));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedForm: FuncionarioRequest = {
      ...form,
      nome: form.nome.trim(),
      email: form.email.trim(),
      cargo: form.cargo.trim(),
      departamento: form.departamento.trim(),
      cidade: form.cidade.trim(),
    };
    const validationErrors = validateForm(normalizedForm);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      await onSubmit(normalizedForm);
    } catch {
      // Erros da API são exibidos pela notificação global
    }
  }

  return (
    <form className="employee-form" onSubmit={handleSubmit} noValidate>
      <Input id="nome" name="nome" label="Nome" value={form.nome} onChange={handleChange} error={errors.nome} autoComplete="name" placeholder="Ex.: João da Silva" required />
      <Input id="email" name="email" type="email" label="E-mail" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" placeholder="Ex.: joao@empresa.com.br" required />
      <Input
        id="telefone"
        name="telefone"
        type="tel"
        label="Telefone"
        value={formatPhone(form.telefone)}
        onChange={handleChange}
        error={errors.telefone}
        inputMode="numeric"
        autoComplete="tel"
        maxLength={15}
        placeholder="(11) 99999-9999"
        required
      />
      <Input id="cargo" name="cargo" label="Cargo" value={form.cargo} onChange={handleChange} error={errors.cargo} placeholder="Ex.: Desenvolvedor de Software" required />
      <Input id="departamento" name="departamento" label="Departamento" value={form.departamento} onChange={handleChange} error={errors.departamento} placeholder="Ex.: Tecnologia" required />
      <Input
        id="salario"
        name="salario"
        label="Salário"
        value={formatCurrency(form.salario)}
        onChange={handleChange}
        error={errors.salario}
        inputMode="numeric"
        placeholder="R$ 0,00"
        required
      />
      <Input id="cidade" name="cidade" label="Cidade" value={form.cidade} onChange={handleChange} error={errors.cidade} autoComplete="address-level2" placeholder="Ex.: São Paulo" required />
      <Select id="status" name="status" label="Status" value={form.status} onChange={handleChange} error={errors.status} options={statusOptions} required />

      <Button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
