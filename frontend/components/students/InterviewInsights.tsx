import { ReadinessTrendChart } from './ReadinessTrendChart';
import { semantic, shadows, text } from '../../utils/colors';
import { TrendingUp, Target } from 'lucide-react';

interface InterviewInsightsProps {
  interviewCount: number;
  improvement: number;
  averageDuration: number;
  confidenceTrend: number[];
}

export function InterviewInsights({ 
  interviewCount, 
  improvement, 
  averageDuration, 
  confidenceTrend 
}: InterviewInsightsProps) {
  return (
    <div className={`${semantic.surface} rounded-2xl ${shadows.sm} border ${semantic.border} p-6`}>
      <h3 className={`text-lg font-semibold ${semantic.textPrimary} mb-6`}>Interview Insights</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-[#102c64]/5 to-[#B8CCF4]/10 rounded-xl">
          <div className={`text-2xl font-bold ${text.primary} mb-1`}>{interviewCount}</div>
          <div className={`text-xs ${semantic.textSecondary}`}>Interviews Completed</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-[#C8A0FE]/10 to-[#C8A0FE]/5 rounded-xl">
          <div className={`text-2xl font-bold ${text.primary} mb-1`}>
            {improvement > 0 ? '+' : ''}{improvement}
          </div>
          <div className={`text-xs ${semantic.textSecondary}`}>Overall Improvement</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-[#B8CCF4]/10 to-[#102c64]/5 rounded-xl">
          <div className={`text-2xl font-bold ${text.primary} mb-1`}>{averageDuration}</div>
          <div className={`text-xs ${semantic.textSecondary}`}>Avg Duration (min)</div>
        </div>
      </div>

      <div className={`border-t ${semantic.border} pt-6`}>
        <h4 className={`text-sm font-semibold ${semantic.textSecondary} mb-4`}>Readiness Trend</h4>
        <ReadinessTrendChart data={confidenceTrend} />
      </div>

      <div className={`border-t ${semantic.border} pt-6 mt-6`}>
        <h4 className={`text-sm font-semibold ${semantic.textSecondary} mb-4`}>Job Success Probability</h4>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-green-700">High Performers</span>
            </div>
            <div className="text-3xl font-bold text-green-900 mb-1">2.3×</div>
            <div className="text-xs text-green-700 mb-1">more likely</div>
            <div className="text-xs text-green-600 leading-tight">to receive a job offer within 30 days</div>
            <div className="text-xs text-green-600 mt-2 font-medium">Candidates with 75+ readiness</div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">Overall Average</span>
            </div>
            <div className="text-3xl font-bold text-blue-900 mb-1">1.0×</div>
            <div className="text-xs text-blue-700 mb-1">baseline</div>
            <div className="text-xs text-blue-600 leading-tight">Probability of offer across all candidates</div>
            <div className="text-xs text-blue-600 mt-2 font-medium">All candidates in cohort</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-3 border border-indigo-100">
          <p className="text-xs text-indigo-900 leading-relaxed">
            <span className="font-semibold">Candidates with 75+ readiness are 2.3× more likely</span> to land job offers compared to the cohort average. <span className="font-semibold">Readiness Score = measurable predictor of job success.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
