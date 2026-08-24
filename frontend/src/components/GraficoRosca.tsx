import type { GraficoItem } from "./GraficoBarras";

interface GraficoRoscaProps {
  title: string;
  items: GraficoItem[];
  total: number;
}

const centerX = 120;
const centerY = 120;
const radius = 74;
const circumference = 2 * Math.PI * radius;

export default function GraficoRosca({ title, items, total }: GraficoRoscaProps) {
  const titleId = `grafico-rosca-${title.toLowerCase().replace(/\s+/g, "-")}`;
  const segments = items.reduce<Array<{ item: GraficoItem; segment: number; offset: number }>>((result, item) => {
    const previous = result[result.length - 1];
    const segment = total === 0 ? 0 : (item.value / total) * circumference;
    const offset = previous ? previous.offset + previous.segment : 0;
    return [...result, { item, segment, offset }];
  }, []);

  return (
    <figure className="chart-card">
      <figcaption id={titleId}>{title}</figcaption>
      <p className="chart-card__description">Distribuição dos cadastros por status atual.</p>
      <svg className="chart-donut" viewBox="0 0 520 250" role="img" aria-labelledby={titleId}>
        <title>{title}</title>
        <circle className="chart-donut-background" cx={centerX} cy={centerY} r={radius} />
        {segments.map(({ item, segment, offset }) => {
          return (
            <circle
              key={item.label}
              className="chart-donut-segment"
              cx={centerX}
              cy={centerY}
              r={radius}
              stroke={item.color}
              strokeDasharray={`${segment} ${circumference - segment}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${centerX} ${centerY})`}
            >
              <title>{`${item.label}: ${item.value}`}</title>
            </circle>
          );
        })}
        <text className="chart-donut-total" x={centerX} y={centerY - 3} textAnchor="middle">{total}</text>
        <text className="chart-donut-caption" x={centerX} y={centerY + 20} textAnchor="middle">total</text>

        {items.map((item, index) => {
          const y = 58 + index * 42;
          const percentage = total === 0 ? 0 : Math.round((item.value / total) * 100);
          return (
            <g key={`legenda-${item.label}`}>
              <rect x="270" y={y - 12} width="12" height="12" rx="3" fill={item.color} />
              <text className="chart-legend-label" x="292" y={y - 1}>{item.label}</text>
              <text className="chart-legend-value" x="490" y={y - 1} textAnchor="end">{item.value} ({percentage}%)</text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
