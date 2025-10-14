import { Code2 } from 'lucide-react';
import { semantic, gradients } from '../../utils/colors';
import type { TechnicalDepthIndex as TDI } from '../../types';

interface TechnicalDepthIndexProps {
  tdi: TDI;
}

export function TechnicalDepthIndex({ tdi }: TechnicalDepthIndexProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Advanced': return 'text-emerald-600';
      case 'Strong': return 'text-green-600';
      case 'Moderate': return 'text-amber-600';
      case 'Low': return 'text-red-600';
      default: return semantic.textSecondary;
    }
  };

  const getLevelBg = (level: string) => {
    switch (level) {
      case 'Advanced': return 'bg-emerald-50 dark:bg-emerald-950';
      case 'Strong': return 'bg-green-50 dark:bg-green-950';
      case 'Moderate': return 'bg-amber-50 dark:bg-amber-950';
      case 'Low': return 'bg-red-50 dark:bg-red-950';
      default: return semantic.bgSubtle;
    }
  };

  return (
    <div className={`${semantic.surface} rounded-xl p-6 border ${semantic.border}`}>
      <div className="flex items-start gap-4">
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradients.secondary} flex items-center justify-center flex-shrink-0`}>
          <Code2 className="w-8 h-8 text-white" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className={`text-lg font-semibold ${semantic.textPrimary}`}>Technical Depth Index</h4>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelBg(tdi.level)} ${getLevelColor(tdi.level)}`}>
              {tdi.level}
            </span>
          </div>
          <p className={`text-sm ${semantic.textSecondary} mb-3`}>
            {tdi.insight}
          </p>
        </div>

        <div className="text-right">
          <div className={`text-4xl font-bold ${getLevelColor(tdi.level)}`}>
            {tdi.score}
          </div>
          <div className={`text-xs ${semantic.textMuted} mt-1`}>out of 100</div>
        </div>
      </div>
    </div>
  );
}
