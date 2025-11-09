interface SparklineProps {
  data: number[];
}

export function Sparkline({ data }: SparklineProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg className="w-full h-12" preserveAspectRatio="none" viewBox="0 0 100 100">
      <polyline
        points={points}
        fill="none"
        stroke="#C8A0FE"
        strokeWidth="2"
        className="transition-all duration-300"
      />
    </svg>
  );
}
