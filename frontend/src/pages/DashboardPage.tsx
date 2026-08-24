import { useEffect, useState, type ComponentType } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileSearch,
  RefreshCw,
  Sparkles,
  Target,
  UserPlus,
  UsersRound,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import FunilContratacao from "../components/FunilContratacao";
import GraficoRosca from "../components/GraficoRosca";
import { funcionarioService } from "../services/funcionarioService";
import type { Indicadores, StatusFuncionario } from "../types/funcionario";

type IndicatorKey = keyof Pick<Indicadores, "emAnalise" | "aprovados" | "reprovados" | "contratados">;

const statusInfo: Array<{
  key: IndicatorKey;
  label: string;
  status: StatusFuncionario;
  color: string;
}> = [
  { key: "emAnalise", label: "Em análise", status: "EM_ANALISE", color: "#e7a624" },
  { key: "aprovados", label: "Aprovados", status: "APROVADO", color: "#21c25e" },
  { key: "contratados", label: "Contratados", status: "CONTRATADO", color: "#3b82f6" },
  { key: "reprovados", label: "Reprovados", status: "REPROVADO", color: "#e05b5b" },
];

function taxa(valor: number, total: number) {
  if (total === 0) return 0;
  return Math.round((valor / total) * 100);
}

function formatarTaxa(valor: number, total: number) {
  return `${taxa(valor, total)}%`;
}

interface MetricCardProps {
  icon: ComponentType<{ "aria-hidden"?: boolean }>;
  label: string;
  value: number;
  detail: string;
  tone: "dark" | "amber" | "green" | "blue";
}

function MetricCard({ icon: Icon, label, value, detail, tone }: MetricCardProps) {
  return (
    <article className={`dashboard-metric dashboard-metric--${tone}`}>
      <div className="dashboard-metric__topline">
        <span className="dashboard-metric__icon"><Icon aria-hidden={true} /></span>
        <span className="dashboard-metric__label">{label}</span>
      </div>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

interface PerformanceCardProps {
  icon: ComponentType<{ "aria-hidden"?: boolean }>;
  label: string;
  value: string;
  description: string;
  progress: number;
  tone: "green" | "blue" | "amber";
}

function PerformanceCard({ icon: Icon, label, value, description, progress, tone }: PerformanceCardProps) {
  return (
    <article className={`performance-card performance-card--${tone}`}>
      <div className="performance-card__header">
        <span className="performance-card__icon"><Icon aria-hidden={true} /></span>
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
      <p>{description}</p>
      <div
        className="performance-card__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <span style={{ width: `${progress}%` }} />
      </div>
    </article>
  );
}

export default function DashboardPage() {
  const [indicadores, setIndicadores] = useState<Indicadores | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [atualizadoEm, setAtualizadoEm] = useState<Date | null>(null);

  useEffect(() => {
    async function carregarIndicadores() {
      setLoading(true);
      try {
        setIndicadores(await funcionarioService.buscarIndicadores());
        setAtualizadoEm(new Date());
      } catch {
        setIndicadores(null);
        // Erros da API também são exibidos pela notificação global
      } finally {
        setLoading(false);
      }
    }

    void carregarIndicadores();
  }, [reloadKey]);

  const horarioAtualizacao = atualizadoEm?.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow"><Sparkles aria-hidden={true} /> Visão analítica</p>
          <h1>Dashboard de contratação</h1>
          <p className="dashboard-subtitle">
            Acompanhe a saúde do processo seletivo e identifique onde agir primeiro.
          </p>
          {horarioAtualizacao && <p className="dashboard-updated">Dados atualizados às {horarioAtualizacao}</p>}
        </div>
        <Link className="dashboard-primary-action" to="/funcionarios/novo">
          <UserPlus aria-hidden={true} />
          Cadastrar funcionário
        </Link>
      </header>

      {loading && (
        <section className="dashboard-loading" aria-label="Carregando indicadores" aria-busy="true">
          <div className="dashboard-loading__metrics">
            {[0, 1, 2, 3].map((item) => <span className="skeleton" key={item} />)}
          </div>
          <div className="dashboard-loading__charts">
            <span className="skeleton" />
            <span className="skeleton" />
          </div>
        </section>
      )}

      {!loading && !indicadores && (
        <section className="dashboard-error" role="alert">
          <span><RefreshCw aria-hidden={true} /></span>
          <div>
            <h2>Não foi possível carregar a visão analítica</h2>
            <p>Verifique a conexão com o serviço e tente atualizar os indicadores.</p>
          </div>
          <button type="button" onClick={() => setReloadKey((current) => current + 1)}>
            Tentar novamente
          </button>
        </section>
      )}

      {indicadores && (() => {
        const analisados = Math.max(indicadores.total - indicadores.emAnalise, 0);
        const decisoesFavoraveis = indicadores.aprovados + indicadores.contratados;
        const taxaAprovacao = taxa(decisoesFavoraveis, analisados);
        const taxaContratacao = taxa(indicadores.contratados, decisoesFavoraveis);
        const taxaFila = taxa(indicadores.emAnalise, indicadores.total);

        let insightTitle = "Pipeline atualizado e sem pendências imediatas";
        let insightDescription = "Continue acompanhando as movimentações para manter o processo seletivo fluindo.";
        let InsightIcon = CheckCircle2;
        let insightHref = "/funcionarios";
        let insightActionLabel = "Ver funcionários";

        if (indicadores.total === 0) {
          insightTitle = "Comece construindo sua base de candidatos";
          insightDescription = "Cadastre o primeiro funcionário para começar a acompanhar conversão e desempenho.";
          InsightIcon = UserPlus;
          insightHref = "/funcionarios/novo";
          insightActionLabel = "Cadastrar agora";
        } else if (indicadores.emAnalise > 0) {
          insightTitle = `${indicadores.emAnalise} ${indicadores.emAnalise === 1 ? "cadastro aguarda" : "cadastros aguardam"} análise`;
          insightDescription = `A fila representa ${formatarTaxa(indicadores.emAnalise, indicadores.total)} do pipeline. Priorizar essa etapa acelera as próximas decisões.`;
          InsightIcon = FileSearch;
          insightHref = "/funcionarios?status=EM_ANALISE";
          insightActionLabel = "Ver pendências";
        } else if (indicadores.aprovados > 0) {
          insightTitle = `${indicadores.aprovados} ${indicadores.aprovados === 1 ? "aprovado está pronto" : "aprovados estão prontos"} para avançar`;
          insightDescription = "O maior ganho agora está em converter as aprovações já realizadas em contratações.";
          InsightIcon = BadgeCheck;
          insightHref = "/funcionarios?status=APROVADO";
          insightActionLabel = "Ver aprovados";
        } else if (indicadores.reprovados > indicadores.contratados) {
          insightTitle = "A reprovação concentra a maior parte das decisões";
          insightDescription = "Vale revisar a origem dos candidatos e o alinhamento dos critérios da seleção.";
          InsightIcon = XCircle;
          insightHref = "/funcionarios?status=REPROVADO";
          insightActionLabel = "Ver reprovados";
        }

        return (
          <>
            <section className="dashboard-metrics" aria-labelledby="resumo-heading">
              <div className="dashboard-section-heading dashboard-section-heading--compact">
                <div>
                  <p>Visão executiva</p>
                  <h2 id="resumo-heading">Resumo do pipeline</h2>
                </div>
              </div>
              <div className="dashboard-metrics__grid">
                <MetricCard
                  icon={UsersRound}
                  label="Total no pipeline"
                  value={indicadores.total}
                  detail="Todos os cadastros ativos"
                  tone="dark"
                />
                <MetricCard
                  icon={Clock3}
                  label="Aguardando análise"
                  value={indicadores.emAnalise}
                  detail={`${formatarTaxa(indicadores.emAnalise, indicadores.total)} do total`}
                  tone="amber"
                />
                <MetricCard
                  icon={BadgeCheck}
                  label="Aprovados"
                  value={indicadores.aprovados}
                  detail="Prontos para a próxima etapa"
                  tone="green"
                />
                <MetricCard
                  icon={BriefcaseBusiness}
                  label="Contratados"
                  value={indicadores.contratados}
                  detail={`${formatarTaxa(indicadores.contratados, indicadores.total)} do pipeline`}
                  tone="blue"
                />
              </div>
            </section>

            <section className="dashboard-analysis" aria-labelledby="analise-heading">
              <div className="dashboard-section-heading">
                <div>
                  <p>Diagnóstico do processo</p>
                  <h2 id="analise-heading">Da entrada à contratação</h2>
                </div>
                <p>O funil mostra avanço entre etapas; a rosca mostra a composição atual.</p>
              </div>
              <div className="dashboard-analysis__grid">
                <FunilContratacao
                  title="Funil de conversão"
                  total={indicadores.total}
                  items={[
                    { label: "Cadastros recebidos", value: indicadores.total, detail: "Base total", color: "#17231c" },
                    { label: "Análises concluídas", value: analisados, detail: `${formatarTaxa(analisados, indicadores.total)} analisados`, color: "#5f7769" },
                    { label: "Decisões favoráveis", value: decisoesFavoraveis, detail: `${taxaAprovacao}% dos analisados`, color: "#21c25e" },
                    { label: "Contratações efetivadas", value: indicadores.contratados, detail: `${taxaContratacao}% das decisões favoráveis`, color: "#3b82f6" },
                  ]}
                />
                <GraficoRosca
                  title="Composição do pipeline"
                  total={indicadores.total}
                  items={statusInfo.map((item) => ({
                    label: item.label,
                    value: indicadores[item.key],
                    color: item.color,
                  }))}
                />
              </div>
            </section>

            <section className="dashboard-performance" aria-labelledby="performance-heading">
              <div className="dashboard-section-heading">
                <div>
                  <p>Eficiência operacional</p>
                  <h2 id="performance-heading">Indicadores de desempenho</h2>
                </div>
                <p>Métricas calculadas sobre as etapas que já tiveram decisão.</p>
              </div>
              <div className="dashboard-performance__grid">
                <PerformanceCard
                  icon={Target}
                  label="Taxa de aprovação"
                  value={`${taxaAprovacao}%`}
                  description={`${decisoesFavoraveis} decisões favoráveis entre ${analisados} análises concluídas.`}
                  progress={taxaAprovacao}
                  tone="green"
                />
                <PerformanceCard
                  icon={BriefcaseBusiness}
                  label="Conversão pós-aprovação"
                  value={`${taxaContratacao}%`}
                  description={`${indicadores.contratados} contratações entre ${decisoesFavoraveis} candidatos aprovados ou contratados.`}
                  progress={taxaContratacao}
                  tone="blue"
                />
                <PerformanceCard
                  icon={Clock3}
                  label="Fila de análise"
                  value={`${taxaFila}%`}
                  description={`${indicadores.emAnalise} de ${indicadores.total} cadastros ainda precisam de uma decisão.`}
                  progress={taxaFila}
                  tone="amber"
                />
              </div>
            </section>

            <section className="dashboard-insight" aria-labelledby="insight-heading">
              <div className="dashboard-insight__icon"><InsightIcon aria-hidden={true} /></div>
              <div>
                <p>Próxima ação recomendada</p>
                <h2 id="insight-heading">{insightTitle}</h2>
                <span>{insightDescription}</span>
              </div>
              <Link to={insightHref}>
                {insightActionLabel}
                <ArrowRight aria-hidden={true} />
              </Link>
            </section>

            <section className="dashboard-actions" aria-labelledby="acoes-heading">
              <div className="dashboard-section-heading dashboard-section-heading--compact">
                <div>
                  <p>Atalhos</p>
                  <h2 id="acoes-heading">Ações rápidas</h2>
                </div>
              </div>
              <div className="dashboard-actions__grid">
                <Link to="/funcionarios/novo">
                  <span><UserPlus aria-hidden={true} /></span>
                  <div>
                    <strong>Cadastrar funcionário</strong>
                    <p>Adicione uma pessoa ao pipeline de contratação.</p>
                  </div>
                  <ArrowRight aria-hidden={true} />
                </Link>
                <Link to="/funcionarios">
                  <span><UsersRound aria-hidden={true} /></span>
                  <div>
                    <strong>Gerenciar funcionários</strong>
                    <p>Consulte, edite e atualize os status cadastrados.</p>
                  </div>
                  <ArrowRight aria-hidden={true} />
                </Link>
              </div>
            </section>
          </>
        );
      })()}
    </main>
  );
}
