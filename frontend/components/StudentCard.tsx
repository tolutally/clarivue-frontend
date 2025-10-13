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
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#102c64] to-[#C8A0FE] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {student.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="text-sm font-semibold text-[#001223]">{student.name}</div>
            <div className="text-xs text-gray-500">{student.role}</div>
          </div>
        </div>
      </td>
      
      <td className="py-3 px-4 text-center">
        <div className="flex items-center justify-center">
          <CircularProgress value={student.readinessScore} size={36} />
        </div>
      </td>
      
      <td className="py-3 px-4 text-center">
        <div className="flex items-center justify-center gap-1">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{student.improvement}
          </span>
        </div>
      </td>
      
      <td className="py-3 px-4">
        <div className="w-32">
          <Sparkline data={student.confidenceTrend} />
        </div>
      </td>
      
      <td className="py-3 px-4">
        <div className="text-xs text-gray-600 max-w-xs">{student.feedback}</div>
      </td>
      
      <td className="py-3 px-4 text-right">
        <button className="px-3 py-1.5 border border-[#102c64] text-[#102c64] rounded text-xs font-medium hover:bg-[#102c64] hover:text-white transition-colors">
          View Details
        </button>
      </td>
    </tr>
  );
}
