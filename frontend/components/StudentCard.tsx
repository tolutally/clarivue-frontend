import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CircularProgress } from './charts/CircularProgress';
import { Sparkline } from './charts/Sparkline';
import type { Student } from '../types';

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  const isPositive = student.improvement >= 0;
  
  return (
    <Card className="p-2 rounded-lg shadow-sm border-0 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#102c64] to-[#C8A0FE] flex items-center justify-center text-white text-xs font-semibold">
          {student.name.split(' ').map(n => n[0]).join('')}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-semibold text-[#001223] truncate">{student.name}</h4>
          <p className="text-[10px] text-gray-500 truncate">{student.role}</p>
        </div>
        
        <CircularProgress value={student.readinessScore} size={32} />
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-gray-500">Confidence Trend</span>
          <div className="flex items-center gap-0.5">
            {isPositive ? (
              <TrendingUp className="w-3 h-3 text-green-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-500" />
            )}
            <span className={`text-[10px] font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{student.improvement}
            </span>
          </div>
        </div>
        
        <Sparkline data={student.confidenceTrend} />
        
        <p className="text-[10px] text-gray-600 mt-1 line-clamp-2">{student.feedback}</p>
        
        <button className="mt-1.5 w-full py-1 border border-[#102c64] text-[#102c64] rounded text-[10px] font-medium hover:bg-[#102c64] hover:text-white transition-colors">
          View Report
        </button>
      </div>
    </Card>
  );
}
