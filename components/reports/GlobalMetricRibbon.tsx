import { TrendingUp, Briefcase, Clock } from 'lucide-react';

export function GlobalMetricRibbon() {
  return (
    <div className="bg-gradient-to-r from-[#102C64] to-[#102C64]/95 border-b border-[#C8A0FE]/30 px-6 py-3">
      <div className="flex items-center justify-center gap-4">
        <MetricPill
          icon={<TrendingUp className="w-4 h-4" />}
          label="Avg Readiness"
          value="72"
          change="+9 pts"
          gradient="from-[#C8A0FE] to-[#9B6FD8]"
          bgGradient="from-[#C8A0FE]/20 to-[#9B6FD8]/10"
        />
        <MetricPill
          icon={<Briefcase className="w-4 h-4" />}
          label="Offer Probability"
          value="22%"
          change="+5 pp"
          gradient="from-[#B8CCF4] to-[#8AABEB]"
          bgGradient="from-[#B8CCF4]/20 to-[#8AABEB]/10"
        />
        <MetricPill
          icon={<Clock className="w-4 h-4" />}
          label="Time Saved"
          value="32%"
          change="21h → 14h"
          gradient="from-[#FE686D] to-[#FF8B8F]"
          bgGradient="from-[#FE686D]/20 to-[#FF8B8F]/10"
        />
      </div>
    </div>
  );
}

interface MetricPillProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  gradient: string;
  bgGradient: string;
}

function MetricPill({ icon, label, value, change, gradient, bgGradient }: MetricPillProps) {
  return (
    <div className={`relative flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r ${bgGradient} border border-white/20 backdrop-blur-sm hover:scale-105 transition-transform duration-200`}>
      <div className={`flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br ${gradient} shadow-lg`}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div>
          <div className="text-xs font-medium text-white/60">{label}</div>
          <div className="text-lg font-bold text-white">{value}</div>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${gradient} text-white shadow-md`}>
          {change}
        </div>
      </div>
    </div>
  );
}
