export interface GraficoItem {
  label: string;
  value: number;
  color: string;
}

interface GraficoBarrasProps {
  title: string;
  items: GraficoItem[];
  total: number;
}

const width = 640;
const height = 320;
const left = 48;
const right = 20;
const top = 30;
const bottom = 64;
const chartWidth = width - left - right;
const chartHeight = height - top - bottom;

export default function GraficoBarras({ title, items, total }: GraficoBarrasProps) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);
  const columnWidth = chartWidth / items.length;
  const barWidth = columnWidth * 0.54;
  const titleId = `grafico-barras-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <figure className="chart-card">
      <figcaption id={titleId}>{title}</figcaption>
      <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={titleId}>
        <title>{title}</title>
        {[0, 0.25, 0.5, 0.75, 1].map((step) => {
          const y = top + chartHeight - chartHeight * step;
          return (
            <g key={step}>
              <line className="chart-gridline" x1={left} x2={width - right} y1={y} y2={y} />
              <text className="chart-axis-label" x={left - 10} y={y + 4} textAnchor="end">
                {Math.round(maxValue * step)}
              </text>
            </g>
          );
        })}

        {items.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = left + columnWidth * index + (columnWidth - barWidth) / 2;
          const y = top + chartHeight - barHeight;
          const percentage = total === 0 ? 0 : Math.round((item.value / total) * 100);

          return (
            <g key={item.label}>
              <rect className="chart-bar" x={x} y={y} width={barWidth} height={Math.max(barHeight, 3)} rx="8" fill={item.color}>
                <title>{`${item.label}: ${item.value} (${percentage}%)`}</title>
              </rect>
              <text className="chart-value" x={x + barWidth / 2} y={Math.max(y - 10, 18)} textAnchor="middle">
                {item.value}
              </text>
              <text className="chart-label" x={x + barWidth / 2} y={top + chartHeight + 28} textAnchor="middle">
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
