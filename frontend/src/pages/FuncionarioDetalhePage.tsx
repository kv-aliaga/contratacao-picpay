import { useEffect, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowLeft,
  Briefcase,
  Building2,
  CircleDollarSign,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Trash2,
  UserRound,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import { funcionarioService } from "../services/funcionarioService";
import type { Funcionario, StatusFuncionario } from "../types/funcionario";

const statusInfo: Record<StatusFuncionario, { label: string; className: string }> = {
  EM_ANALISE: { label: "Em análise", className: "status-analysis" },
  APROVADO: { label: "Aprovado", className: "status-approved" },
  REPROVADO: { label: "Reprovado", className: "status-rejected" },
  CONTRATADO: { label: "Contratado", className: "status-hired" },
};

const formatadorSalario = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatarTelefone(valor: string) {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);

  if (digitos.length === 11) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  }

  if (digitos.length === 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }

  return valor;
}

interface DetailCardProps {
  icon: ReactNode;
  label: string;
  tone: "green" | "blue" | "amber" | "purple";
  children: ReactNode;
}

function DetailCard({ icon, label, tone, children }: DetailCardProps) {
  return (
    <div className="detail-card">
      <dt>
        <span className={`detail-card-icon detail-card-icon--${tone}`} aria-hidden="true">
          {icon}
        </span>
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

function obterIniciais(nome: string) {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();
}

export default function FuncionarioDetalhePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const funcionarioId = Number(id);
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [loading, setLoading] = useState(true);

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

  async function excluirFuncionario() {
    if (!funcionario || !window.confirm("Deseja realmente excluir este funcionário?")) return;

    try {
      await funcionarioService.excluir(funcionario.id);
      navigate("/funcionarios");
    } catch {
      // Erros da API são exibidos pela notificação global.
    }
  }

  const status = funcionario ? statusInfo[funcionario.status] : null;

  return (
    <main className="employee-detail-page">
      <header className="detail-page-header">
        <Link className="detail-back-link" to="/funcionarios">
          <ArrowLeft aria-hidden="true" />
          Voltar para funcionários
        </Link>
        <div>
          <p className="detail-eyebrow">Perfil do candidato</p>
          <h1>Detalhes do funcionário</h1>
          <p>Consulte as informações pessoais e profissionais deste cadastro.</p>
        </div>
      </header>

      {loading && (
        <section className="detail-loading" aria-label="Carregando dados do funcionário" aria-live="polite">
          <div className="detail-loading-hero skeleton" />
          <div className="detail-grid">
            {Array.from({ length: 8 }, (_, index) => (
              <div className="detail-loading-card skeleton" key={index} />
            ))}
          </div>
          <span className="sr-only">Carregando...</span>
        </section>
      )}

      {!loading && !funcionario && (
        <section className="state-container">
          <UserRound aria-hidden="true" />
          <h2>Funcionário não encontrado</h2>
          <p>Não foi possível localizar os dados deste cadastro.</p>
          <Link className="button" to="/funcionarios">Ver todos os funcionários</Link>
        </section>
      )}

      {funcionario && status && (
        <>
          <section className="detail-hero" aria-labelledby="employee-name">
            <div className="detail-avatar" aria-hidden="true">
              {obterIniciais(funcionario.nome)}
            </div>

            <div className="detail-identity">
              <p>Funcionário #{funcionario.id}</p>
              <h2 id="employee-name">{funcionario.nome}</h2>
              <div className="detail-identity-meta">
                <span className={`status-badge ${status.className}`}>
                  <Activity aria-hidden="true" />
                  {status.label}
                </span>
                <span>
                  <MapPin aria-hidden="true" />
                  {funcionario.cidade}
                </span>
              </div>
            </div>

            <div className="detail-actions" aria-label="Ações do funcionário">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(`/funcionarios/${funcionario.id}/editar`)}
              >
                <Pencil aria-hidden="true" />
                Editar
              </Button>
              <Button type="button" variant="danger" onClick={() => void excluirFuncionario()}>
                <Trash2 aria-hidden="true" />
                Excluir
              </Button>
            </div>
          </section>

          <section className="detail-information" aria-labelledby="detail-information-title">
            <div className="detail-section-heading">
              <div>
                <p className="detail-eyebrow">Cadastro completo</p>
                <h2 id="detail-information-title">Informações do funcionário</h2>
              </div>
              <p>Dados atualizados disponíveis neste perfil.</p>
            </div>

            <dl className="detail-grid">
              <DetailCard icon={<UserRound />} label="Nome completo" tone="green">
                {funcionario.nome}
              </DetailCard>
              <DetailCard icon={<Mail />} label="E-mail" tone="blue">
                <a href={`mailto:${funcionario.email}`}>{funcionario.email}</a>
              </DetailCard>
              <DetailCard icon={<Phone />} label="Telefone" tone="purple">
                <a href={`tel:${funcionario.telefone}`}>{formatarTelefone(funcionario.telefone)}</a>
              </DetailCard>
              <DetailCard icon={<Briefcase />} label="Cargo" tone="amber">
                {funcionario.cargo}
              </DetailCard>
              <DetailCard icon={<Building2 />} label="Departamento" tone="blue">
                {funcionario.departamento}
              </DetailCard>
              <DetailCard icon={<CircleDollarSign />} label="Salário" tone="green">
                {formatadorSalario.format(funcionario.salario)}
              </DetailCard>
              <DetailCard icon={<MapPin />} label="Cidade" tone="purple">
                {funcionario.cidade}
              </DetailCard>
              <DetailCard icon={<Activity />} label="Status" tone="amber">
                <span className={`status-badge ${status.className}`}>{status.label}</span>
              </DetailCard>
            </dl>
          </section>
        </>
      )}
    </main>
  );
}
