import { semantic } from '../../utils/colors';

interface BarChartProps {
  data: Array<{ program: string; score: number }>;
}

export function BarChart({ data }: BarChartProps) {
  const max = Math.max(...data.map(d => d.score));
  
  const getColor = (index: number) => {
    const colors = ['#102c64', '#C8A0FE', '#FF5C57'];
    return colors[index % colors.length];
  };
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.program}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs ${semantic.textSecondary}`}>{item.program}</span>
            <span className="text-xs font-semibold text-[#001223]">{item.score}</span>
          </div>
          <div className={`w-full ${semantic.bgSubtle} rounded-full h-2`}>
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${(item.score / max) * 100}%`,
                backgroundColor: getColor(index),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
