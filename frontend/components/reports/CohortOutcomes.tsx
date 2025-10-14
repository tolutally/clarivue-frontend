import { TrendingUp, TrendingDown } from 'lucide-react';
import { Sparkline } from '../charts/Sparkline';
import type { CohortOutcomesData } from '../../data/reports-data';
import { colors } from '../../utils/colors';

interface CohortOutcomesProps {
  data: CohortOutcomesData;
  compareData?: CohortOutcomesData;
  cohortAName?: string;
  cohortBName?: string;
}

export function CohortOutcomes({ data, compareData, cohortAName, cohortBName }: CohortOutcomesProps) {
  const isComparing = !!compareData;
  return (
    <div className="space-y-6">
      {isComparing && (
        <div className="bg-gradient-to-r from-[#C8A0FE]/10 to-[#FE686D]/10 rounded-lg border border-[#C8A0FE]/30 p-4 mb-6">
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#C8A0FE]" />
              <span className="text-sm font-semibold text-gray-900">{cohortAName}</span>
            </div>
            <span className="text-gray-400">vs</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#FE686D]" />
              <span className="text-sm font-semibold text-gray-900">{cohortBName}</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Avg Readiness"
          value={data.kpis.avgReadiness.value}
          suffix="/100"
          delta={data.kpis.avgReadiness.delta}
          sparklineData={data.weeklyReadiness}
          compareValue={compareData?.kpis.avgReadiness.value}
        />
        <KPICard
          label="Improvement After ≥2 Mocks"
          value={data.kpis.improvementAfter2Mocks.value}
          prefix="+"
          suffix=" pts"
          sparklineData={[12, 14, 16, 17, 18]}
          compareValue={compareData?.kpis.improvementAfter2Mocks.value}
        />
        <KPICard
          label="% Ready (≥80)"
          value={data.kpis.percentReady.value}
          suffix="%"
          sparklineData={[28, 30, 32, 33, 34]}
          compareValue={compareData?.kpis.percentReady.value}
        />
        <KPICard
          label="Placement/Offer Rate"
          value={data.kpis.offerRate.value}
          suffix="%"
          sublabel="verified + self-reported"
          sparklineData={[18, 19, 20, 21, 22]}
          compareValue={compareData?.kpis.offerRate.value}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressCurve weeklyData={data.weeklyReadiness} compareWeeklyData={compareData?.weeklyReadiness} cohortAName={cohortAName} cohortBName={cohortBName} />
        {/* Disabled for MVP
        <BeforeAfterBars data={data.beforeAfter} />
        */}
        <DistributionHistogram data={data.distribution} compareData={compareData?.distribution} cohortAName={cohortAName} cohortBName={cohortBName} />
      </div>

      <InsightChips insights={data.insights} />
    </div>
  );
}

interface KPICardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  sublabel?: string;
  delta?: number;
  sparklineData?: number[];
  compareValue?: number;
}

function KPICard({ label, value, prefix = '', suffix = '', sublabel, delta, sparklineData, compareValue }: KPICardProps) {
  const diff = compareValue !== undefined ? value - compareValue : undefined;
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="text-sm font-medium text-gray-600 mb-2">{label}</div>
      <div className="flex items-baseline gap-2 mb-1">
        <div className="text-3xl font-bold text-[#C8A0FE]">
          {prefix}{value}{suffix}
        </div>
        {delta !== undefined && !compareValue && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {delta >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {delta >= 0 ? '+' : ''}{delta}
          </div>
        )}
      </div>
      {compareValue !== undefined && (
        <div className="mb-2">
          <div className="text-sm text-gray-900 mb-1">
            vs <span className="font-semibold text-[#FE686D]">{prefix}{compareValue}{suffix}</span>
          </div>
          {diff !== undefined && diff !== 0 && (
            <div className={`flex items-center gap-1 text-xs font-semibold ${diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {diff > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {diff > 0 ? '+' : ''}{diff} difference
            </div>
          )}
        </div>
      )}
      {sublabel && (
        <div className="text-xs text-gray-500 mb-2">{sublabel}</div>
      )}
      {sparklineData && (
        <div className="mt-3 h-10">
          <Sparkline data={sparklineData} />
        </div>
      )}
    </div>
  );
}

function ProgressCurve({ weeklyData, compareWeeklyData, cohortAName, cohortBName }: { weeklyData: number[]; compareWeeklyData?: number[]; cohortAName?: string; cohortBName?: string }) {
  const allData = compareWeeklyData ? [...weeklyData, ...compareWeeklyData] : weeklyData;
  const max = Math.max(...allData);
  const min = Math.min(...allData);
  const range = max - min || 1;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Progress Curve</h3>
        {compareWeeklyData && (
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-[#C8A0FE]" />
              <span>{cohortAName}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-[#FE686D]" />
              <span>{cohortBName}</span>
            </div>
          </div>
        )}
      </div>
      <div className="relative h-48">
        <svg className="w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="none">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.secondary} stopOpacity="0.2" />
              <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            d={`M 0 ${150 - ((weeklyData[0] - min) / range) * 120} ${weeklyData.map((val, i) => `L ${(i / (weeklyData.length - 1)) * 300} ${150 - ((val - min) / range) * 120}`).join(' ')} L 300 150 L 0 150 Z`}
            fill="url(#progressGradient)"
          />
          <path
            d={`M 0 ${150 - ((weeklyData[0] - min) / range) * 120} ${weeklyData.map((val, i) => `L ${(i / (weeklyData.length - 1)) * 300} ${150 - ((val - min) / range) * 120}`).join(' ')}`}
            stroke={colors.secondary}
            strokeWidth="2"
            fill="none"
          />
          {compareWeeklyData && (
            <path
              d={`M 0 ${150 - ((compareWeeklyData[0] - min) / range) * 120} ${compareWeeklyData.map((val, i) => `L ${(i / (compareWeeklyData.length - 1)) * 300} ${150 - ((val - min) / range) * 120}`).join(' ')}`}
              stroke="#FE686D"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4 2"
            />
          )}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 mt-2">
          {weeklyData.map((_, i) => (
            <span key={i}>Week {i + 1}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function BeforeAfterBars({ data }: { data: Array<{ cohort: string; first: number; latest: number }> }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Before/After by Cohort</h3>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.cohort}>
            <div className="text-xs text-gray-600 mb-2">{item.cohort}</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden flex">
                <div
                  className="bg-[#B8CCF4] flex items-center justify-center text-xs font-semibold text-[#102C64]"
                  style={{ width: `${(item.first / 100) * 100}%` }}
                >
                  {item.first}
                </div>
                <div
                  className="bg-[#102C64] flex items-center justify-center text-xs font-semibold text-white"
                  style={{ width: `${((item.latest - item.first) / 100) * 100}%` }}
                >
                  {item.latest}
                </div>
              </div>
              <div className="text-xs font-semibold text-green-600">
                +{item.latest - item.first}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DistributionHistogram({ data, compareData, cohortAName, cohortBName }: { data: Array<{ range: string; count: number }>; compareData?: Array<{ range: string; count: number }>; cohortAName?: string; cohortBName?: string }) {
  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Readiness Distribution</h3>
        {compareData && (
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-[#C8A0FE]" />
              <span>{cohortAName}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-[#FE686D]/60" />
              <span>{cohortBName}</span>
            </div>
          </div>
        )}
      </div>
      <div className="space-y-3">
        {data.map((item, idx) => {
          const compareItem = compareData?.[idx];
          return (
            <div key={item.range}>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{item.range}</span>
                <div className="flex gap-3">
                  <span className="font-semibold text-[#C8A0FE]">{item.count}</span>
                  {compareItem && <span className="font-semibold text-[#FE686D]">vs {compareItem.count}</span>}
                </div>
              </div>
              <div className="relative h-6">
                <div className="absolute inset-0 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C8A0FE] to-[#102C64] transition-all duration-500"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
                {compareItem && (
                  <div className="absolute inset-0 flex items-center">
                    <div
                      className="h-3 bg-[#FE686D]/60 rounded-full transition-all duration-500"
                      style={{ width: `${(compareItem.count / maxCount) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InsightChips({ insights }: { insights: string[] }) {
  return (
    <div className="bg-gradient-to-br from-[#C8A0FE]/10 to-[#B8CCF4]/10 rounded-lg border border-[#C8A0FE]/20 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Insights</h3>
      <div className="space-y-2">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="bg-white rounded-lg px-4 py-3 text-sm text-gray-700 border border-[#C8A0FE]/20 shadow-sm"
          >
            {insight}
          </div>
        ))}
      </div>
    </div>
  );
}
