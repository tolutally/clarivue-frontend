import { ArrowUp, ArrowDown, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { InterventionData } from '../../data/reports-data';

interface InterventionImpactProps {
  data: InterventionData;
}

export function InterventionImpact({ data }: InterventionImpactProps) {
  const intervention = data.selectedIntervention;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-gray-900">Select Intervention</h3>
          <Select defaultValue={data.interventions[0].id}>
            <SelectTrigger className="w-[280px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {data.interventions.map((int) => (
                <SelectItem key={int.id} value={int.id}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{int.name} – {int.date}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {intervention && (
          <>
            <div className="mb-4">
              <h4 className="text-lg font-bold text-gray-900 mb-1">{intervention.name}</h4>
              <p className="text-sm text-gray-600 italic">
                Improvements are correlational; verify with controlled attribution studies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <ImpactCard
                label="Communication"
                value={intervention.beforeAfter.communication}
                positive={true}
              />
              <ImpactCard
                label="Clarity"
                value={intervention.beforeAfter.clarity}
                positive={true}
              />
              <ImpactCard
                label="Red-Flag Rate"
                value={intervention.beforeAfter.redFlagRateBefore - intervention.beforeAfter.redFlagRateAfter}
                suffix="%"
                beforeValue={intervention.beforeAfter.redFlagRateBefore}
                afterValue={intervention.beforeAfter.redFlagRateAfter}
                positive={true}
                isDecrease={true}
              />
              <ImpactCard
                label="% Ready"
                value={intervention.beforeAfter.percentReadyChange}
                suffix="pp"
                positive={true}
              />
              <div className="bg-gradient-to-br from-[#C8A0FE]/10 to-[#B8CCF4]/10 rounded-lg border border-[#C8A0FE]/20 p-4 flex flex-col justify-center items-center">
                <div className="text-xs font-medium text-gray-600 mb-2">Overall Impact</div>
                <div className="text-3xl font-bold text-[#C8A0FE]">Strong</div>
                <div className="text-xs text-gray-500 mt-1">Positive</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BeforeAfterComparison
                metric="Communication Score"
                before={68}
                after={80}
                change={intervention.beforeAfter.communication}
              />
              <BeforeAfterComparison
                metric="Red-Flag Detection Rate"
                before={intervention.beforeAfter.redFlagRateBefore}
                after={intervention.beforeAfter.redFlagRateAfter}
                change={-(intervention.beforeAfter.redFlagRateBefore - intervention.beforeAfter.redFlagRateAfter)}
                isDecrease={true}
              />
            </div>
          </>
        )}
      </div>

      <div className="bg-gradient-to-br from-[#B8CCF4]/10 to-[#B8CCF4]/5 rounded-lg border border-[#B8CCF4]/20 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">What Works: Key Findings</h3>
        <div className="space-y-2">
          <div className="bg-white rounded-lg px-4 py-3 text-sm text-gray-700 border border-[#B8CCF4]/20 shadow-sm">
            STAR Clinic participants show +12 pts in communication; recommend quarterly sessions.
          </div>
          <div className="bg-white rounded-lg px-4 py-3 text-sm text-gray-700 border border-[#B8CCF4]/20 shadow-sm">
            Mock Fair events drive +18% completion rate when scheduled within 3 days of signup.
          </div>
          <div className="bg-white rounded-lg px-4 py-3 text-sm text-gray-700 border border-[#B8CCF4]/20 shadow-sm">
            Behavioral workshops reduce red-flag incidents by 57% (14% → 6%).
          </div>
        </div>
      </div>
    </div>
  );
}

interface ImpactCardProps {
  label: string;
  value: number;
  suffix?: string;
  beforeValue?: number;
  afterValue?: number;
  positive: boolean;
  isDecrease?: boolean;
}

function ImpactCard({ label, value, suffix = '', beforeValue, afterValue, positive, isDecrease = false }: ImpactCardProps) {
  const isPositiveChange = isDecrease ? value > 0 : value > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="text-xs font-medium text-gray-600 mb-2">{label}</div>
      <div className={`flex items-baseline gap-1 mb-2 ${positive && isPositiveChange ? 'text-green-600' : 'text-gray-900'}`}>
        {positive && isPositiveChange && <ArrowUp className="w-5 h-5" />}
        {positive && !isPositiveChange && <ArrowDown className="w-5 h-5 text-red-600" />}
        <div className="text-3xl font-bold">
          {isPositiveChange ? '+' : ''}{value}{suffix}
        </div>
      </div>
      {beforeValue !== undefined && afterValue !== undefined && (
        <div className="text-xs text-gray-500">
          {beforeValue}% → {afterValue}%
        </div>
      )}
    </div>
  );
}

function BeforeAfterComparison({ metric, before, after, change, isDecrease = false }: { metric: string; before: number; after: number; change: number; isDecrease?: boolean }) {
  const maxValue = Math.max(before, after);

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-4">{metric}</h4>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Before</span>
            <span className="font-semibold">{before}{isDecrease ? '%' : ''}</span>
          </div>
          <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#B8CCF4] transition-all duration-500"
              style={{ width: `${(before / maxValue) * 100}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>After</span>
            <span className="font-semibold">{after}{isDecrease ? '%' : ''}</span>
          </div>
          <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C8A0FE] transition-all duration-500"
              style={{ width: `${(after / maxValue) * 100}%` }}
            />
          </div>
        </div>
        <div className="pt-2 border-t border-gray-300">
          <div className={`text-sm font-semibold ${change >= 0 && !isDecrease ? 'text-green-600' : change < 0 && isDecrease ? 'text-green-600' : 'text-gray-600'}`}>
            Change: {change >= 0 ? '+' : ''}{change}{isDecrease ? 'pp' : ' pts'}
          </div>
        </div>
      </div>
    </div>
  );
}
