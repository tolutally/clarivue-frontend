interface LineChartProps {
  data: Array<{ week: string; score: number }>;
}

export function LineChart({ data }: LineChartProps) {
  const max = Math.max(...data.map(d => d.score));
  const min = Math.min(...data.map(d => d.score));
  const range = max - min;
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 160;
    const y = 60 - ((item.score - min) / range) * 50;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="w-40">
      <svg width="160" height="60" className="overflow-visible">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C8A0FE" />
            <stop offset="100%" stopColor="#FF5C57" />
          </linearGradient>
        </defs>
        <polyline
          points={points}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 160;
          const y = 60 - ((item.score - min) / range) * 50;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="white"
              stroke="#FF5C57"
              strokeWidth="2"
            />
          );
        })}
      </svg>
    </div>
  );
}
