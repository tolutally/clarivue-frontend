import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { semantic, shadows } from '../../utils/colors';
import type { Student } from '../../types';

interface ReadinessIndexProps {
  student: Student;
}

export function ReadinessIndex({ student }: ReadinessIndexProps) {
  const competencyEntries = Object.entries(student.competencies);
  const sortedByScore = [...competencyEntries].sort((a, b) => b[1] - a[1]);
  
  const topStrengths = sortedByScore.slice(0, 2);
  const topWeaknesses = sortedByScore.slice(-2).reverse();
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const recommendations = student.interviewReports?.[0]?.aiRecommendations.slice(0, 2) || [
    'Practice STAR framework with specific metrics',
    'Focus on reducing filler words and improving pacing'
  ];

  return (
    <div className={`bg-white rounded-xl border border-gray-100 ${shadows.sm} p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${semantic.textPrimary}`}>Readiness Index</h3>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-[#102c64]">{student.readinessScore}</span>
          <div className="flex flex-col items-end">
            {student.improvement >= 0 ? (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">+{student.improvement}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600 text-sm">
                <TrendingDown className="w-4 h-4" />
                <span className="font-medium">{student.improvement}</span>
              </div>
            )}
            <span className="text-xs text-gray-500">vs. baseline</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className={`text-sm font-semibold ${semantic.textSecondary} mb-3 flex items-center gap-2`}>
            <TrendingUp className="w-4 h-4 text-green-600" />
            Top Strengths
          </h4>
          <div className="space-y-2">
            {topStrengths.map(([competency, score]) => (
              <div key={competency} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{competency}</span>
                <span className={`text-sm font-semibold ${getScoreColor(score)}`}>{score}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className={`text-sm font-semibold ${semantic.textSecondary} mb-3 flex items-center gap-2`}>
            <AlertCircle className="w-4 h-4 text-orange-500" />
            Areas to Improve
          </h4>
          <div className="space-y-2">
            {topWeaknesses.map(([competency, score]) => (
              <div key={competency} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{competency}</span>
                <span className={`text-sm font-semibold ${getScoreColor(score)}`}>{score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h4 className={`text-sm font-semibold ${semantic.textSecondary} mb-3`}>
          Actionable Recommendations
        </h4>
        <div className="space-y-2">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
