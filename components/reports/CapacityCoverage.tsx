import { Clock, Users, TrendingUp, CheckCircle2 } from 'lucide-react';
import type { CapacityData } from '../../data/reports-data';

interface CapacityCoverageProps {
  data: CapacityData;
}

export function CapacityCoverage({ data }: CapacityCoverageProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Users className="w-5 h-5" />}
          label="Student Coverage"
          value={`${data.kpis.studentCoverage.value}%`}
          color="blue"
        />
        <MetricCard
          icon={<Clock className="w-5 h-5" />}
          label="Queue Time to First Review"
          value={`${data.kpis.queueTime.value}h`}
          sublabel="median"
          color="green"
        />
        <MetricCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Practice Intensity"
          value={data.kpis.practiceIntensity.value.toFixed(1)}
          sublabel="mocks per active student"
          color="purple"
        />
        <MetricCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="Throughput"
          value={data.kpis.throughput.value}
          sublabel="mock sessions this term"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CapacityGauge data={data.capacityGauge} />
        <StudentFunnel data={data.funnel} />
      </div>

      <div className="bg-gradient-to-br from-[#B8CCF4]/10 to-[#B8CCF4]/5 rounded-lg border border-[#B8CCF4]/20 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Capacity Insights</h3>
        <div className="space-y-2">
          {data.insights.map((insight, i) => (
            <div
              key={i}
              className="bg-white rounded-lg px-4 py-3 text-sm text-gray-700 border border-[#B8CCF4]/20 shadow-sm"
            >
              {insight}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sublabel?: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function MetricCard({ icon, label, value, sublabel, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-[#102C64]/10 text-[#102C64] border-[#102C64]/20',
    green: 'bg-[#B8CCF4]/10 text-[#102C64] border-[#B8CCF4]/20',
    purple: 'bg-[#C8A0FE]/10 text-[#102C64] border-[#C8A0FE]/20',
    orange: 'bg-[#FE686D]/10 text-[#FE686D] border-[#FE686D]/20',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      {sublabel && <div className="text-xs text-gray-500">{sublabel}</div>}
    </div>
  );
}

function CapacityGauge({ data }: { data: { actual: number; target: number } }) {
  const percentage = (data.actual / data.target) * 100;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Coverage vs Target</h3>
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="16"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="#C8A0FE"
              strokeWidth="16"
              strokeDasharray={`${(percentage / 100) * 502.4} 502.4`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-gray-900">{data.actual}%</div>
            <div className="text-sm text-gray-500">of {data.target}% target</div>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#C8A0FE]" />
            <span className="text-sm text-gray-600">Actual Coverage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <span className="text-sm text-gray-600">Gap to Target</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentFunnel({ data }: { data: Array<{ stage: string; count: number } > }) {
  const maxCount = data[0].count;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Student Journey Funnel</h3>
      <div className="space-y-3">
        {data.map((stage, index) => {
          const percentage = (stage.count / maxCount) * 100;
          const dropoff = index > 0 ? data[index - 1].count - stage.count : 0;
          const dropoffPercentage = index > 0 ? ((dropoff / data[index - 1].count) * 100).toFixed(0) : 0;

          return (
            <div key={stage.stage} className="relative">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{stage.count}</span>
                  {dropoff > 0 && (
                    <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      -{dropoffPercentage}%
                    </span>
                  )}
                </div>
              </div>
              <div className="h-10 bg-gray-100 rounded-lg overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-[#C8A0FE] to-[#102C64] transition-all duration-700 flex items-center justify-end pr-3"
                  style={{ width: `${percentage}%` }}
                >
                  {percentage > 20 && (
                    <span className="text-xs font-semibold text-white">
                      {percentage.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
