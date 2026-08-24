import { Link } from "react-router-dom";

interface ErrorPageProps {
  code?: string;
  title?: string;
  message?: string;
}

export default function ErrorPage({
  code = "404",
  title = "Página não encontrada",
  message = "A página que você tentou acessar não existe ou foi movida.",
}: ErrorPageProps) {
  return (
    <main className="error-page">
      <section className="error-page-card" aria-labelledby="error-page-title">
        <span className="error-page-code">{code}</span>
        <h1 id="error-page-title">{title}</h1>
        <p>{message}</p>
        <Link className="button" to="/funcionarios">Voltar para funcionários</Link>
      </section>
    </main>
  );
}
