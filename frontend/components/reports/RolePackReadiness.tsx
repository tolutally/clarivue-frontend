import { Award, TrendingUp } from 'lucide-react';
import type { RolePackData } from '../../data/reports-data';

interface RolePackReadinessProps {
  data: RolePackData;
}

export function RolePackReadiness({ data }: RolePackReadinessProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Role-Aligned Readiness</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-600 pb-3 pr-4">Role</th>
                <th className="text-center text-xs font-semibold text-gray-600 pb-3 px-4">% Ready (≥ target)</th>
                <th className="text-center text-xs font-semibold text-gray-600 pb-3 px-4">Avg Score</th>
                <th className="text-left text-xs font-semibold text-gray-600 pb-3 px-4">Biggest Gap</th>
                <th className="text-center text-xs font-semibold text-gray-600 pb-3 pl-4">Students Meeting Target</th>
              </tr>
            </thead>
            <tbody>
              {data.roles.map((role) => (
                <tr key={role.role} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 pr-4">
                    <div className="text-sm font-medium text-gray-900">{role.role}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center">
                      <div className="relative w-20">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#C8A0FE] rounded-full transition-all duration-500"
                            style={{ width: `${role.percentReady}%` }}
                          />
                        </div>
                        <div className="text-xs font-semibold text-gray-900 mt-1 text-center">
                          {role.percentReady}%
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="text-2xl font-bold text-gray-900">{role.avgScore}</div>
                      <div className="text-xs text-gray-500">/100</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#FE686D]/10 text-[#FE686D] rounded-full text-xs font-medium">
                      <TrendingUp className="w-3 h-3 rotate-180" />
                      {role.biggestGap}
                    </div>
                  </td>
                  <td className="py-4 pl-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex items-center gap-1 px-3 py-1.5 bg-[#C8A0FE]/10 text-[#102C64] rounded-lg border border-[#C8A0FE]/30">
                        <Award className="w-4 h-4" />
                        <span className="text-sm font-semibold">{role.badgeCount}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {data.roles.map((role) => (
          <RoleCard key={role.role} role={role} />
        ))}
      </div>

      <div className="bg-gradient-to-br from-[#C8A0FE]/10 to-[#B8CCF4]/10 rounded-lg border border-[#C8A0FE]/20 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Role-Pack Insights</h3>
        <div className="space-y-2">
          <div className="bg-white rounded-lg px-4 py-3 text-sm text-gray-700 border border-[#C8A0FE]/20 shadow-sm">
            RN role shows highest readiness (44%) with strong patient communication skills.
          </div>
          <div className="bg-white rounded-lg px-4 py-3 text-sm text-gray-700 border border-[#C8A0FE]/20 shadow-sm">
            Software Engineer candidates need targeted communication workshops to close the gap.
          </div>
          <div className="bg-white rounded-lg px-4 py-3 text-sm text-gray-700 border border-[#C8A0FE]/20 shadow-sm">
            BDR confidence training shows +14pt improvement when paired with mock cold-call practice.
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ role }: { role: { role: string; percentReady: number; avgScore: number; biggestGap: string; badgeCount: number } }) {
  const getReadinessColor = (percent: number) => {
    if (percent >= 40) return 'text-[#C8A0FE]';
    if (percent >= 30) return 'text-[#B8CCF4]';
    return 'text-[#FE686D]';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="text-xs font-semibold text-gray-600 mb-2">{role.role}</div>
      <div className={`text-3xl font-bold mb-1 ${getReadinessColor(role.percentReady)}`}>
        {role.percentReady}%
      </div>
      <div className="text-xs text-gray-500 mb-3">ready</div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600">Avg: {role.avgScore}</span>
        <div className="flex items-center gap-1 text-[#C8A0FE]">
          <Award className="w-3 h-3" />
          <span className="font-semibold">{role.badgeCount}</span>
        </div>
      </div>
    </div>
  );
}
