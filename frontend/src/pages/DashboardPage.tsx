import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { funcionarioService } from "../services/funcionarioService";
import type { Indicadores, StatusFuncionario } from "../types/funcionario";

const statusInfo: Array<{ key: keyof Pick<Indicadores, "emAnalise" | "aprovados" | "reprovados" | "contratados">; label: string; status: StatusFuncionario }> = [
  { key: "emAnalise", label: "Em análise", status: "EM_ANALISE" },
  { key: "aprovados", label: "Aprovados", status: "APROVADO" },
  { key: "contratados", label: "Contratados", status: "CONTRATADO" },
  { key: "reprovados", label: "Reprovados", status: "REPROVADO" },
];

function percentual(valor: number, total: number) {
  if (total === 0) return "0%";
  return `${Math.round((valor / total) * 100)}%`;
}

function percentualNumero(valor: number, total: number) {
  if (total === 0) return 0;
  return Math.round((valor / total) * 100);
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
      <nav>
        <Link to="/funcionarios">Funcionários</Link>{" | "}
        <Link to="/funcionarios/novo">Novo funcionário</Link>
      </nav>

      {loading && <p>Carregando indicadores...</p>}
      {error && <p role="alert">{error}</p>}
      {indicadores && (
        <>
          <section aria-labelledby="resumo-heading">
            <h2 id="resumo-heading">Resumo da contratação</h2>
            <article>
              <h3>Total de funcionários</h3>
              <p>{indicadores.total}</p>
              <p>Todos os cadastros realizados</p>
            </article>
            <article>
              <h3>Em análise</h3>
              <p>{indicadores.emAnalise}</p>
              <p>{percentual(indicadores.emAnalise, indicadores.total)} do total</p>
            </article>
            <article>
              <h3>Aprovados</h3>
              <p>{indicadores.aprovados}</p>
              <p>{percentual(indicadores.aprovados, indicadores.total)} do total</p>
            </article>
            <article>
              <h3>Contratados</h3>
              <p>{indicadores.contratados}</p>
              <p>{percentual(indicadores.contratados, indicadores.total)} do total</p>
            </article>
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

            <figure aria-labelledby="distribuicao-heading">
              <figcaption id="distribuicao-heading">Distribuição por status</figcaption>
              {statusInfo.map((item) => {
                const quantidade = indicadores[item.key];
                const valor = percentualNumero(quantidade, indicadores.total);
                return (
                  <p key={`grafico-${item.status}`}>
                    <label htmlFor={`barra-${item.status}`}>
                      {item.label}: {quantidade} ({valor}%)
                    </label><br />
                    <progress id={`barra-${item.status}`} max="100" value={valor}>
                      {valor}%
                    </progress>
                  </p>
                );
              })}
            </figure>

            <figure aria-labelledby="desempenho-heading">
              <figcaption id="desempenho-heading">Desempenho do processo</figcaption>
              <p>
                <label htmlFor="barra-aprovacao">
                  Aprovados ou contratados: {percentual(indicadores.aprovados + indicadores.contratados, indicadores.total)}
                </label><br />
                <progress
                  id="barra-aprovacao"
                  max="100"
                  value={percentualNumero(indicadores.aprovados + indicadores.contratados, indicadores.total)}
                />
              </p>
              <p>
                <label htmlFor="barra-reprovacao">
                  Reprovados: {percentual(indicadores.reprovados, indicadores.total)}
                </label><br />
                <progress
                  id="barra-reprovacao"
                  max="100"
                  value={percentualNumero(indicadores.reprovados, indicadores.total)}
                />
              </p>
              <p>
                <label htmlFor="barra-analise">
                  Aguardando análise: {percentual(indicadores.emAnalise, indicadores.total)}
                </label><br />
                <progress
                  id="barra-analise"
                  max="100"
                  value={percentualNumero(indicadores.emAnalise, indicadores.total)}
                />
              </p>
            </figure>
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
