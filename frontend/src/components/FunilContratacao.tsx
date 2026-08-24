export interface FunilItem {
  label: string;
  value: number;
  detail: string;
  color: string;
}

interface FunilContratacaoProps {
  title: string;
  items: FunilItem[];
  total: number;
}

export default function FunilContratacao({ title, items, total }: FunilContratacaoProps) {
  return (
    <figure className="chart-card funnel-card">
      <figcaption>{title}</figcaption>
      <p className="chart-card__description">Progressão acumulada dos candidatos em cada etapa.</p>
      <div className="funnel" role="img" aria-label={`${title}. ${items.map((item) => `${item.label}: ${item.value}`).join(", ")}`}>
        {items.map((item) => {
          const percentage = total === 0 ? 0 : Math.round((item.value / total) * 100);

          return (
            <div className="funnel__stage" key={item.label}>
              <div className="funnel__stage-heading">
                <div>
                  <span>{item.label}</span>
                  <small>{item.detail}</small>
                </div>
                <strong>{item.value}</strong>
              </div>
              <div className="funnel__track" aria-hidden="true">
                <span style={{ width: `${percentage}%`, backgroundColor: item.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
