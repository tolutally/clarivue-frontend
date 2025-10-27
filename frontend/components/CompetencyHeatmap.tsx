import { Card } from '@/components/ui/card';
import { students, competencies } from '../data/mock-data';
import { semantic } from '../utils/colors';
import type { Student } from '../types';

interface CompetencyHeatmapProps {
  students: Student[];
  competencies: string[];
}

const getColorClass = (score: number): string => {
  if (score >= 80) return 'bg-[#C8A0FE]';
  if (score >= 70) return 'bg-[#D4B5FF]';
  if (score >= 60) return 'bg-[#E0CBFF]';
  if (score >= 50) return 'bg-[#EBE0FF]';
  return 'bg-[#F5F0FF]';
};

export function CompetencyHeatmap({ students, competencies }: CompetencyHeatmapProps) {
  return (
    <Card className="p-6 rounded-xl shadow-sm border-0">
      <h3 className="text-lg font-semibold text-[#001223] mb-4">Competency Heatmap</h3>
      
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-6 gap-2 mb-3">
            <div className={`text-xs font-medium ${semantic.textTertiary}`}></div>
            {competencies.map((comp) => (
              <div key={comp} className={`text-xs font-medium ${semantic.textSecondary} text-center`}>
                {comp}
              </div>
            ))}
          </div>
          
          {students.map((student) => (
            <div key={student.id} className="grid grid-cols-6 gap-2 mb-2">
              <div className="text-sm font-medium text-gray-700 flex items-center">
                {student.name}
              </div>
              {competencies.map((comp) => {
                const score = student.competencies[comp as keyof typeof student.competencies];
                return (
                  <div
                    key={comp}
                    className="group relative"
                  >
                    <div
                      className={`h-10 rounded-lg ${getColorClass(score)} transition-all duration-200 hover:scale-110 hover:shadow-md flex items-center justify-center`}
                    >
                      <span className="text-xs font-semibold text-[#001223]">{score}</span>
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      {comp}: {score}/100
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      <div className={`flex items-center gap-4 mt-4 pt-4 border-t ${semantic.border}`}>
        <span className={`text-xs ${semantic.textTertiary}`}>Score Range:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#F5F0FF]"></div>
          <span className={`text-xs ${semantic.textSecondary}`}>0-50</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#EBE0FF]"></div>
          <span className="text-xs text-gray-600">50-60</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#E0CBFF]"></div>
          <span className="text-xs text-gray-600">60-70</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#D4B5FF]"></div>
          <span className="text-xs text-gray-600">70-80</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#C8A0FE]"></div>
          <span className="text-xs text-gray-600">80+</span>
        </div>
      </div>
    </Card>
  );
}
