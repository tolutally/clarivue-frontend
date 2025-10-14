import { TrendingUp, Briefcase, Clock } from 'lucide-react';

export function GlobalMetricRibbon() {
  return (
    <div className="bg-gradient-to-r from-[#102C64] to-[#102C64]/95 border-b border-[#C8A0FE]/30 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <MetricCard
            icon={<TrendingUp className="w-5 h-5 text-[#C8A0FE]" />}
            label="Avg Readiness"
            value="72"
            change="+9 pts"
            subtitle="vs baseline"
          />
          <div className="h-10 w-px bg-white/20" />
          <MetricCard
            icon={<Briefcase className="w-5 h-5 text-[#B8CCF4]" />}
            label="Offer Probability"
            value="22%"
            change="+5 pp"
            subtitle="after ≥2 mocks"
          />
          <div className="h-10 w-px bg-white/20" />
          <MetricCard
            icon={<Clock className="w-5 h-5 text-[#FE686D]" />}
            label="Advisor Time Saved"
            value="32%"
            change="21h → 14h"
            subtitle="avg feedback time"
          />
        </div>
        <div className="text-xs text-white/60 italic">
          ROI metrics refresh with each filter change
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  subtitle: string;
}

function MetricCard({ icon, label, value, change, subtitle }: MetricCardProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm">
        {icon}
      </div>
      <div>
        <div className="text-xs font-medium text-white/70">{label}</div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-white">{value}</span>
          <span className="text-xs font-semibold text-[#C8A0FE] bg-[#C8A0FE]/20 px-2 py-0.5 rounded-full">
            {change}
          </span>
        </div>
        <div className="text-xs text-white/50">{subtitle}</div>
      </div>
    </div>
  );
}
