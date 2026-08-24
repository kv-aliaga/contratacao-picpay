import { useEffect, useState } from "react";
import { API_ERROR_EVENT, type ApiErrorDetail } from "../services/api";

export default function ApiErrorToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: number | undefined;

    function showError(event: Event) {
      const { detail } = event as CustomEvent<ApiErrorDetail>;
      if (!detail?.message) return;

      if (timeoutId) window.clearTimeout(timeoutId);
      setMessage(detail.message);
      timeoutId = window.setTimeout(() => setMessage(null), 4000);
    }

    window.addEventListener(API_ERROR_EVENT, showError);
    return () => {
      window.removeEventListener(API_ERROR_EVENT, showError);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  if (!message) return null;

  return (
    <aside className="api-error-toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div>
        <strong>Algo deu errado</strong>
        <p>{message}</p>
      </div>
      <button type="button" onClick={() => setMessage(null)} aria-label="Fechar notificação">
        ×
      </button>
    </aside>
  );
}
