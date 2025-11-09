import { Info } from 'lucide-react';
import { semantic, text } from '../../utils/colors';

interface ToneMetrics {
  confidence: number;
  clarity: number;
  emotionalConsistency: number;
  energyLevel: 'Low' | 'Moderate' | 'High';
}

interface ToneDetectionProps {
  metrics: ToneMetrics;
}

export function ToneDetection({ metrics }: ToneDetectionProps) {
  const getEnergyColor = (level: string) => {
    if (level === 'High') return `${semantic.success} ${semantic.successBg} ${semantic.successBorder}`;
    if (level === 'Moderate') return `${text.primary} bg-[#B8CCF4]/10 border-[#B8CCF4]/30`;
    return `${semantic.warning} ${semantic.warningBg} ${semantic.warningBorder}`;
  };

  const GaugeMeter = ({ value, label }: { value: number; label: string }) => {
    const percentage = value;
    const rotation = (percentage / 100) * 180 - 90;

    return (
      <div className="text-center">
        <div className="relative w-24 h-12 mx-auto mb-2">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            <path
              d="M 10 45 A 40 40 0 0 1 90 45"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M 10 45 A 40 40 0 0 1 90 45"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(percentage / 100) * 126} 126`}
            />
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FE686D" />
                <stop offset="50%" stopColor="#C8A0FE" />
                <stop offset="100%" stopColor="#102c64" />
              </linearGradient>
            </defs>
            <line
              x1="50"
              y1="45"
              x2="50"
              y2="15"
              stroke="#102c64"
              strokeWidth="2"
              strokeLinecap="round"
              transform={`rotate(${rotation} 50 45)`}
            />
            <circle cx="50" cy="45" r="3" fill="#102c64" />
          </svg>
        </div>
        <div className={`text-2xl font-bold ${text.primary} mb-1`}>{value}/100</div>
        <div className={`text-xs ${semantic.textSecondary}`}>{label}</div>
      </div>
    );
  };

  return (
    <div className={`${semantic.surface} rounded-xl p-5 border ${semantic.border}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className={`text-sm font-semibold ${semantic.textPrimary}`}>Tone Detection</h4>
        <div className="group relative">
          <Info className={`w-4 h-4 ${semantic.textMuted} cursor-help`} />
          <div className="absolute right-0 bottom-full mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            Tone detection analyzes speech pacing, filler words, and emotional variation to measure confidence & clarity.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <GaugeMeter value={metrics.confidence} label="Confidence" />
        <GaugeMeter value={metrics.clarity} label="Clarity" />
        <GaugeMeter value={metrics.emotionalConsistency} label="Emotional Consistency" />
      </div>

      <div className={`flex items-center justify-center gap-2 pt-4 border-t ${semantic.border}`}>
        <span className={`text-sm ${semantic.textSecondary}`}>Energy Level:</span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getEnergyColor(metrics.energyLevel)}`}>
          {metrics.energyLevel}
        </span>
      </div>
    </div>
  );
}
