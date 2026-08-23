import type { ReactNode } from "react";
import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
}

export default function Modal({ isOpen, title, children, onClose, footer }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header>
          <h2 id="modal-title">{title}</h2>
          <Button type="button" variant="secondary" onClick={onClose} aria-label="Fechar modal">
            Fechar
          </Button>
        </header>
        <div>{children}</div>
        {footer && <footer>{footer}</footer>}
      </section>
    </div>
  );
}
