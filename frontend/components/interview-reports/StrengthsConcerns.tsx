import { ThumbsUp, AlertTriangle } from 'lucide-react';
import { semantic } from '../../utils/colors';

interface StrengthsConcernsProps {
  strengths: string[];
  concerns: string[];
}

export function StrengthsConcerns({ strengths, concerns }: StrengthsConcernsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className={`bg-gradient-to-br ${semantic.successGradient} rounded-xl p-5 border ${semantic.successBorder}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <ThumbsUp className="w-4 h-4 text-white" />
          </div>
          <h4 className={`text-sm font-semibold ${semantic.textPrimary}`}>Top Strengths</h4>
        </div>
        <ul className="space-y-2">
          {strengths.map((strength, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
              <span className={`${semantic.success} mt-0.5`}>•</span>
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={`bg-gradient-to-br from-amber-50 to-white rounded-xl p-5 border ${semantic.warningBorder}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <h4 className={`text-sm font-semibold ${semantic.textPrimary}`}>Areas of Concern</h4>
        </div>
        <ul className="space-y-2">
          {concerns.map((concern, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
              <span className={`${semantic.warning} mt-0.5`}>•</span>
              <span>{concern}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
