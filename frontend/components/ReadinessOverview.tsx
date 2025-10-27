import { TrendingUp, Target, ThumbsUp, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { LineChart } from './charts/LineChart';
import { semantic, backgrounds, text } from '../utils/colors';
import type { Student } from '../types';

interface ReadinessOverviewProps {
  students: Student[];
}

const trendData = [
  { week: 'Week 1', score: 54 },
  { week: 'Week 2', score: 61 },
  { week: 'Week 3', score: 68 },
  { week: 'Week 4', score: 72 },
];

export function ReadinessOverview({ students }: ReadinessOverviewProps) {
  return (
    <div>
      <Card className="p-6 rounded-xl shadow-sm border-0">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className={`text-sm ${semantic.textTertiary} mb-1`}>Average Readiness Score</p>
            <div className="flex items-baseline gap-3">
              <h2 className="text-5xl font-bold text-[#001223]">72</h2>
              <span className="text-2xl text-gray-400">/100</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-[#FF5C57]" />
              <span className="text-sm font-medium text-[#FF5C57]">+18% improvement after 2nd mock</span>
            </div>
          </div>
          
          <div className="text-right">
            <LineChart data={trendData} />
          </div>
        </div>
        
        <div className={`grid grid-cols-2 gap-4 pt-4 border-t ${semantic.border}`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-[#FF5C57]" />
            </div>
            <div>
              <p className={`text-xs ${semantic.textTertiary}`}>Top Weakness</p>
              <p className="text-sm font-semibold text-[#001223]">Behavioral Structure (STAR)</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <ThumbsUp className="w-5 h-5 text-[#C8A0FE]" />
            </div>
            <div>
              <p className={`text-xs ${semantic.textTertiary}`}>Top Strength</p>
              <p className="text-sm font-semibold text-[#001223]">Communication Clarity</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
