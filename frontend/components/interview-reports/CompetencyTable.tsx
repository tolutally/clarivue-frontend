import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { semantic, hover } from '../../utils/colors';
import type { CompetencyBreakdownItem } from '../../types';

interface CompetencyTableProps {
  competencies: CompetencyBreakdownItem[];
}

export function CompetencyTable({ competencies }: CompetencyTableProps) {
  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className={`w-4 h-4 ${semantic.success}`} />;
    if (change < 0) return <TrendingDown className={`w-4 h-4 ${semantic.danger}`} />;
    return <Minus className={`w-4 h-4 ${semantic.textMuted}`} />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return semantic.success;
    if (change < 0) return semantic.danger;
    return semantic.textSecondary;
  };

  const getScoreColor = (score: number, benchmark: number) => {
    if (score >= benchmark) return semantic.success;
    if (score >= benchmark - 5) return semantic.warning;
    return semantic.danger;
  };

  return (
    <div className={`${semantic.surface} rounded-xl p-5 border ${semantic.border}`}>
      <h4 className={`text-sm font-semibold ${semantic.textPrimary} mb-4`}>Competency Breakdown</h4>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${semantic.borderMedium}`}>
              <th className={`text-left text-xs font-semibold ${semantic.textSecondary} uppercase tracking-wider pb-3`}>
                Competency
              </th>
              <th className="text-center text-xs font-semibold text-gray-600 uppercase tracking-wider pb-3">
                Score
              </th>
              <th className="text-center text-xs font-semibold text-gray-600 uppercase tracking-wider pb-3">
                Change
              </th>
              <th className="text-center text-xs font-semibold text-gray-600 uppercase tracking-wider pb-3">
                Benchmark
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${semantic.border}`}>
            {competencies.map((item) => (
              <tr key={item.competency} className={`${hover.primaryLight} transition-colors`}>
                <td className={`py-3 text-sm font-medium ${semantic.textPrimary}`}>
                  <div>
                    <div>{item.competency}</div>
                    {item.reason && (
                      <div className={`text-xs ${semantic.textSecondary} mt-1`}>
                        {item.reason}
                      </div>
                    )}
                    {item.evidenceTimestamp && (
                      <div className={`text-xs ${semantic.textMuted} mt-0.5`}>
                        Evidence: {item.evidenceTimestamp}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 text-center">
                  <span className={`text-sm font-bold ${getScoreColor(item.score, item.benchmark)}`}>
                    {item.score}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center justify-center gap-1">
                    {getChangeIcon(item.change)}
                    <span className={`text-sm font-semibold ${getChangeColor(item.change)}`}>
                      {item.change > 0 ? '+' : ''}{item.change}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-center">
                  <span className={`text-sm ${semantic.textSecondary}`}>{item.benchmark}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
