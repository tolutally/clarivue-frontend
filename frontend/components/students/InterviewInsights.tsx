import { ReadinessTrendChart } from './ReadinessTrendChart';
import { semantic, shadows, text } from '../../utils/colors';
import { TrendingUp, Clock } from 'lucide-react';

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
        <h4 className={`text-sm font-semibold ${semantic.textSecondary} mb-4`}>Outcome Correlation</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-green-700">High Performers</span>
            </div>
            <div className="text-2xl font-bold text-green-900 mb-1">10 days</div>
            <div className="text-xs text-green-700">Avg. time to employer interview</div>
            <div className="text-xs text-green-600 mt-2">Candidates with 75+ readiness</div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">Overall Average</span>
            </div>
            <div className="text-2xl font-bold text-blue-900 mb-1">18 days</div>
            <div className="text-xs text-blue-700">Avg. time to employer interview</div>
            <div className="text-xs text-blue-600 mt-2">All candidates in cohort</div>
          </div>
        </div>
      </div>
    </div>
  );
}
