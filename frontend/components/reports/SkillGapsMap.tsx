import { AlertTriangle } from 'lucide-react';
import type { SkillGapsData } from '../../data/reports-data';

interface SkillGapsMapProps {
  data: SkillGapsData;
}

export function SkillGapsMap({ data }: SkillGapsMapProps) {
  const skills = ['communication', 'problemSolving', 'technical', 'confidence', 'clarity'] as const;
  const skillLabels = {
    communication: 'Communication',
    problemSolving: 'Problem Solving',
    technical: 'Technical',
    confidence: 'Confidence',
    clarity: 'Clarity',
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-semibold text-gray-900">Skills Heatmap by Program</h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#FE686D]" />
              <span className="text-gray-600">Campus Benchmark: {data.benchmark}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#C8A0FE]" />
              <span className="text-gray-600">Employer Target: {data.employerTarget}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs font-semibold text-gray-600 pb-3 pr-4">Program</th>
                {skills.map(skill => (
                  <th key={skill} className="text-center text-xs font-semibold text-gray-600 pb-3 px-2">
                    {skillLabels[skill]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.heatmap.map((program) => (
                <tr key={program.program} className="border-t border-gray-100">
                  <td className="py-3 pr-4 text-sm font-medium text-gray-900">{program.program}</td>
                  {skills.map(skill => {
                    const value = program[skill];
                    const color = getHeatmapColor(value, data.benchmark, data.employerTarget);
                    return (
                      <td key={skill} className="py-3 px-2">
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className={`w-full h-12 rounded-lg flex items-center justify-center text-sm font-semibold ${color} transition-all duration-300 hover:scale-105`}
                          >
                            {value}
                          </div>
                          {value < data.benchmark && (
                            <div className="text-xs text-red-600 font-medium">
                              {value - data.benchmark}
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 rounded bg-[#FE686D]/10 border border-[#FE686D]/30" />
            <span className="text-gray-600">Below Benchmark</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 rounded bg-[#B8CCF4]/30 border border-[#B8CCF4]" />
            <span className="text-gray-600">At Benchmark</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 rounded bg-[#C8A0FE]/20 border border-[#C8A0FE]" />
            <span className="text-gray-600">Above Target</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#FE686D]/10 to-[#FE686D]/5 rounded-lg border border-[#FE686D]/20 p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-[#FE686D]" />
          <h3 className="text-sm font-semibold text-gray-900">Skill Gap Callouts</h3>
        </div>
        <div className="space-y-2">
          {data.callouts.map((callout, i) => (
            <div
              key={i}
              className="bg-white rounded-lg px-4 py-3 text-sm text-gray-700 border border-[#FE686D]/20 shadow-sm"
            >
              {callout}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getHeatmapColor(value: number, benchmark: number, target: number): string {
  if (value >= target) {
    return 'bg-[#C8A0FE]/20 text-[#102C64] border border-[#C8A0FE]';
  } else if (value >= benchmark) {
    return 'bg-[#B8CCF4]/30 text-[#102C64] border border-[#B8CCF4]';
  } else if (value >= benchmark - 5) {
    return 'bg-[#FE686D]/20 text-[#FE686D] border border-[#FE686D]/50';
  } else {
    return 'bg-[#FE686D]/10 text-[#FE686D] border border-[#FE686D]/30';
  }
}
