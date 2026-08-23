import { Link } from "react-router-dom";
import Button from "./Button";

interface NavbarProps {
  title?: string;
  onMenuToggle?: () => void;
}

export default function Navbar({ title = "Gestão de funcionários", onMenuToggle }: NavbarProps) {
  return (
    <header className="navbar">
      {onMenuToggle && (
        <Button type="button" variant="secondary" onClick={onMenuToggle} aria-label="Abrir menu">
          Menu
        </Button>
      )}
      <Link to="/" aria-label="Ir para o dashboard">{title}</Link>
    </header>
  );
}
