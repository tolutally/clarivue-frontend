import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { semantic, shadows } from '../../utils/colors';

interface ProgramTrend {
  program: string;
  avgReadiness: number;
  improvementRate: number;
  studentsAtRisk: number;
  totalStudents: number;
  weeklyTrend: number[];
}

interface ReadinessTrendsProps {
  cohortName: string;
  showAtRiskOnly?: boolean;
}

const programTrendsData: ProgramTrend[] = [
  {
    program: 'Business',
    avgReadiness: 74,
    improvementRate: 12,
    studentsAtRisk: 18,
    totalStudents: 120,
    weeklyTrend: [65, 68, 70, 72, 74]
  },
  {
    program: 'Engineering',
    avgReadiness: 71,
    improvementRate: 15,
    studentsAtRisk: 24,
    totalStudents: 145,
    weeklyTrend: [58, 62, 66, 68, 71]
  },
  {
    program: 'Arts',
    avgReadiness: 68,
    improvementRate: 9,
    studentsAtRisk: 31,
    totalStudents: 95,
    weeklyTrend: [62, 64, 65, 67, 68]
  },
  {
    program: 'Sciences',
    avgReadiness: 73,
    improvementRate: 11,
    studentsAtRisk: 21,
    totalStudents: 108,
    weeklyTrend: [64, 67, 69, 71, 73]
  },
  {
    program: 'Nursing',
    avgReadiness: 76,
    improvementRate: 13,
    studentsAtRisk: 14,
    totalStudents: 98,
    weeklyTrend: [66, 69, 72, 74, 76]
  }
];

export function ReadinessTrends({ cohortName, showAtRiskOnly = false }: ReadinessTrendsProps) {
  const filteredData = showAtRiskOnly 
    ? programTrendsData.filter(p => (p.studentsAtRisk / p.totalStudents) > 0.15)
    : programTrendsData;

  const sortedData = [...filteredData].sort((a, b) => b.studentsAtRisk - a.studentsAtRisk);

  const getReadinessColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 65) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReadinessBg = (score: number) => {
    if (score >= 75) return 'bg-green-50 border-green-200';
    if (score >= 70) return 'bg-blue-50 border-blue-200';
    if (score >= 65) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getRiskLevel = (riskCount: number, total: number) => {
    const percent = (riskCount / total) * 100;
    if (percent >= 25) return { label: 'High Risk', color: 'text-red-600', bg: 'bg-red-50 border-red-200' };
    if (percent >= 15) return { label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' };
    return { label: 'Low Risk', color: 'text-green-600', bg: 'bg-green-50 border-green-200' };
  };

  const totalAtRisk = sortedData.reduce((sum, p) => sum + p.studentsAtRisk, 0);
  const totalStudents = sortedData.reduce((sum, p) => sum + p.totalStudents, 0);

  return (
    <div className={`${semantic.surface} rounded-xl border ${semantic.border} ${shadows.sm} p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-lg font-semibold ${semantic.textPrimary}`}>
            Readiness Trends by Program
          </h3>
          <p className={`text-sm ${semantic.textSecondary} mt-1`}>
            {cohortName} • {showAtRiskOnly ? 'Students at Risk' : 'All Programs'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {showAtRiskOnly && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-red-700">
                {totalAtRisk} / {totalStudents} at risk
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {sortedData.map((program) => {
          const riskInfo = getRiskLevel(program.studentsAtRisk, program.totalStudents);
          const riskPercent = ((program.studentsAtRisk / program.totalStudents) * 100).toFixed(0);

          return (
            <div
              key={program.program}
              className={`border rounded-lg p-4 transition-all hover:shadow-md ${semantic.border}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h4 className={`font-semibold ${semantic.textPrimary}`}>
                    {program.program}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded border ${riskInfo.bg} ${riskInfo.color} font-medium`}>
                    {riskInfo.label}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getReadinessColor(program.avgReadiness)}`}>
                      {program.avgReadiness}
                    </div>
                    <div className="text-xs text-gray-500">Avg Readiness</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className={`p-3 rounded-lg border ${getReadinessBg(program.avgReadiness)}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Improvement Rate</span>
                    {program.improvementRate >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div className={`text-lg font-bold mt-1 ${program.improvementRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {program.improvementRate >= 0 ? '+' : ''}{program.improvementRate}%
                  </div>
                </div>

                <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                  <span className="text-xs text-gray-600">Students at Risk</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-bold text-red-600">{program.studentsAtRisk}</span>
                    <span className="text-xs text-gray-500">({riskPercent}%)</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border bg-blue-50 border-blue-200">
                  <span className="text-xs text-gray-600">Total Students</span>
                  <div className="text-lg font-bold text-blue-600 mt-1">{program.totalStudents}</div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">5-Week Trend</span>
                  <span className="text-xs text-gray-500">
                    {program.weeklyTrend[0]} → {program.weeklyTrend[4]}
                  </span>
                </div>
                <div className="flex items-end gap-1 h-12">
                  {program.weeklyTrend.map((value, idx) => {
                    const heightPercent = (value / 100) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col justify-end">
                        <div
                          className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all hover:from-blue-600 hover:to-blue-500"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!showAtRiskOnly && filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No programs match the current filter</p>
        </div>
      )}
    </div>
  );
}
