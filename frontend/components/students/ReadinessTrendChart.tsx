import { semantic, text } from '../../utils/colors';

interface ReadinessTrendChartProps {
  data: number[];
}

export function ReadinessTrendChart({ data }: ReadinessTrendChartProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return { x, y, value };
  });

  const pathD = points
    .map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      return `L ${point.x} ${point.y}`;
    })
    .join(' ');

  const areaD = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <div className="relative h-32">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#102c64" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#102c64" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        <path
          d={areaD}
          fill="url(#trendGradient)"
        />
        
        <path
          d={pathD}
          fill="none"
          stroke="#102c64"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="2"
              fill="#102c64"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
      </svg>

      <div className={`absolute bottom-0 left-0 right-0 flex justify-between text-xs ${semantic.textTertiary} mt-2`}>
        {data.map((value, index) => (
          <div key={index} className="text-center">
            <div className={`font-semibold ${text.primary}`}>{value}</div>
            <div>v{index + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
