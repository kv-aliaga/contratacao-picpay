import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { funcionarioService } from "../services/funcionarioService";
import type { Indicadores, StatusFuncionario } from "../types/funcionario";
import Card from "../components/Card";
import GraficoBarras from "../components/GraficoBarras";
import GraficoRosca from "../components/GraficoRosca";

const statusInfo: Array<{ key: keyof Pick<Indicadores, "emAnalise" | "aprovados" | "reprovados" | "contratados">; label: string; status: StatusFuncionario; color: string }> = [
  { key: "emAnalise", label: "Em análise", status: "EM_ANALISE", color: "#f3b63f" },
  { key: "aprovados", label: "Aprovados", status: "APROVADO", color: "#21c25e" },
  { key: "contratados", label: "Contratados", status: "CONTRATADO", color: "#1686c7" },
  { key: "reprovados", label: "Reprovados", status: "REPROVADO", color: "#e05b5b" },
];

function percentual(valor: number, total: number) {
  if (total === 0) return "0%";
  return `${Math.round((valor / total) * 100)}%`;
}

export default function DashboardPage() {
  const [indicadores, setIndicadores] = useState<Indicadores | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function carregarIndicadores() {
      try {
        setIndicadores(await funcionarioService.buscarIndicadores());
      } catch {
        setError("Não foi possível carregar os indicadores.");
      } finally {
        setLoading(false);
      }
    }

    void carregarIndicadores();
  }, []);

  return (
    <main>
      <h1>Dashboard</h1>

      {loading && <p>Carregando indicadores...</p>}
      {error && <p role="alert">{error}</p>}
      {indicadores && (
        <>
          <section aria-labelledby="resumo-heading">
            <h2 id="resumo-heading">Resumo da contratação</h2>
            <Card title="Total de funcionários">
              <p>{indicadores.total}</p>
              <p>Todos os cadastros realizados</p>
            </Card>
            <Card title="Em análise">
              <p>{indicadores.emAnalise}</p>
              <p>{percentual(indicadores.emAnalise, indicadores.total)} do total</p>
            </Card>
            <Card title="Aprovados">
              <p>{indicadores.aprovados}</p>
              <p>{percentual(indicadores.aprovados, indicadores.total)} do total</p>
            </Card>
            <Card title="Contratados">
              <p>{indicadores.contratados}</p>
              <p>{percentual(indicadores.contratados, indicadores.total)} do total</p>
            </Card>
          </section>

          <section aria-labelledby="pipeline-heading">
            <h2 id="pipeline-heading">Pipeline de contratação</h2>
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Quantidade</th>
                  <th>Participação</th>
                </tr>
              </thead>
              <tbody>
                {statusInfo.map((item) => {
                  const quantidade = indicadores[item.key];
                  return (
                    <tr key={item.status}>
                      <td>{item.label}</td>
                      <td>{quantidade}</td>
                      <td>{percentual(quantidade, indicadores.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <section aria-labelledby="graficos-heading">
            <h2 id="graficos-heading">Gráficos</h2>
            <div className="charts-grid">
              <GraficoBarras
                title="Distribuição por status"
                total={indicadores.total}
                items={statusInfo.map((item) => ({
                  label: item.label,
                  value: indicadores[item.key],
                  color: item.color,
                }))}
              />
              <GraficoRosca
                title="Composição da contratação"
                total={indicadores.total}
                items={statusInfo.map((item) => ({
                  label: item.label,
                  value: indicadores[item.key],
                  color: item.color,
                }))}
              />
            </div>
          </section>

          <section aria-labelledby="performance-heading">
            <h2 id="performance-heading">Indicadores de desempenho</h2>
            <p>
              Taxa de aprovação: {percentual(indicadores.aprovados + indicadores.contratados, indicadores.total)}
            </p>
            <p>
              Taxa de reprovação: {percentual(indicadores.reprovados, indicadores.total)}
            </p>
            <p>
              Cadastros aguardando análise: {indicadores.emAnalise}
            </p>
            {indicadores.emAnalise > 0 && <p role="status">Existem funcionários aguardando análise.</p>}
            {indicadores.total === 0 && <p role="status">Ainda não há funcionários cadastrados.</p>}
          </section>

          <section aria-labelledby="acoes-heading">
            <h2 id="acoes-heading">Ações rápidas</h2>
            <p><Link to="/funcionarios/novo">Cadastrar novo funcionário</Link></p>
            <p><Link to="/funcionarios">Ver todos os funcionários</Link></p>
          </section>
        </>
      )}
    </main>
  );
}
