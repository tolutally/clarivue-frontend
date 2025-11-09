import { BarChart3, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { BarChart } from './charts/BarChart';

const programData = [
  { program: 'Business', score: 74 },
  { program: 'Engineering', score: 66 },
  { program: 'Arts', score: 71 },
];

const weaknesses = [
  { label: 'Behavioral Structure', size: 'text-lg' },
  { label: 'Confidence', size: 'text-base' },
  { label: 'Conciseness', size: 'text-sm' },
  { label: 'Time Management', size: 'text-xs' },
  { label: 'Eye Contact', size: 'text-xs' },
];

export function AdvisorInsights() {
  return (
    <Card className="p-6 rounded-xl shadow-sm border-0">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-[#001223]" />
        <h3 className="text-lg font-semibold text-[#001223]">Advisor Insights</h3>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-3">Average Readiness by Program</p>
        <BarChart data={programData} />
      </div>
      
      <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
        <p className="text-sm font-medium text-[#001223] mb-2">Common Weaknesses</p>
        <div className="flex flex-wrap gap-2">
          {weaknesses.map((weakness) => (
            <span
              key={weakness.label}
              className={`px-3 py-1 bg-white rounded-full ${weakness.size} font-medium text-gray-700 shadow-sm`}
            >
              {weakness.label}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
        <div className="w-10 h-10 rounded-full bg-[#001223] flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-[#001223]">74%</p>
          <p className="text-xs text-gray-600">Students completed ≥2 mocks</p>
        </div>
      </div>
    </Card>
  );
}
