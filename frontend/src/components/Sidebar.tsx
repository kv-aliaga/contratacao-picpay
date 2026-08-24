import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen?: boolean;
  onNavigate?: () => void;
}

export default function Sidebar({ isOpen = true, onNavigate }: SidebarProps) {
  return (
    <aside
      className={`sidebar ${isOpen ? "sidebar-open" : ""}`}
      aria-label="Navegação principal"
    >
      <nav>
        <NavLink to="/" onClick={onNavigate}>Dashboard</NavLink>
        <NavLink to="/funcionarios" end onClick={onNavigate}>Funcionários</NavLink>
        <NavLink to="/funcionarios/novo" onClick={onNavigate}>Novo funcionário</NavLink>
      </nav>
    </aside>
  );
}
