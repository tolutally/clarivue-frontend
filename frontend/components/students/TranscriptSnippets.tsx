import { TrendingUp, AlertCircle } from 'lucide-react';
import { semantic, shadows } from '../../utils/colors';

interface TranscriptSnippetsProps {
  early: string;
  recent: string;
}

export function TranscriptSnippets({ early, recent }: TranscriptSnippetsProps) {
  const topStrengths = [
    { label: 'Communication', score: 84 },
    { label: 'Clarity', score: 80 }
  ];
  
  const topConcerns = [
    { label: 'Confidence', score: 65 },
    { label: 'Problem Solving', score: 70 }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`${semantic.surface} rounded-2xl ${shadows.sm} border ${semantic.border} p-6`}>
      <div className="flex items-center gap-3 mb-6">
        <h3 className={`text-lg font-semibold ${semantic.textPrimary}`}>Readiness Index</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <h4 className={`text-sm font-semibold ${semantic.textSecondary}`}>Top Strengths</h4>
          </div>
          <div className="space-y-2">
            {topStrengths.map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className={`text-sm font-semibold ${getScoreColor(item.score)}`}>{item.score}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-orange-500" />
            <h4 className={`text-sm font-semibold ${semantic.textSecondary}`}>Top Concerns</h4>
          </div>
          <div className="space-y-2">
            {topConcerns.map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-100 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className={`text-sm font-semibold ${getScoreColor(item.score)}`}>{item.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
