import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { semantic } from '../../utils/colors';
import type { AuthenticitySignal } from '../../types';

interface AuthenticitySignalsProps {
  signals: AuthenticitySignal[];
}

export function AuthenticitySignals({ signals }: AuthenticitySignalsProps) {
  const getStatusIcon = (status: string) => {
    if (status === 'healthy') return <CheckCircle2 className={`w-5 h-5 ${semantic.success}`} />;
    if (status === 'minor-concern') return <AlertCircle className={`w-5 h-5 ${semantic.warning}`} />;
    return <AlertCircle className={`w-5 h-5 ${semantic.danger}`} />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'healthy') return `${semantic.successBg} ${semantic.success} ${semantic.successBorder}`;
    if (status === 'minor-concern') return `${semantic.warningBg} ${semantic.warning} ${semantic.warningBorder}`;
    return `${semantic.dangerBg} ${semantic.danger} ${semantic.dangerBorder}`;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Behavioral: 'bg-[#C8A0FE]/10 text-[#C8A0FE] border-[#C8A0FE]/30',
      Linguistic: 'bg-[#B8CCF4]/10 text-[#102c64] border-[#B8CCF4]/30',
      Audio: 'bg-[#102c64]/10 text-[#102c64] border-[#102c64]/30',
      Cognitive: 'bg-[#FE686D]/10 text-[#FE686D] border-[#FE686D]/30',
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="bg-gradient-to-br from-[#C8A0FE]/5 via-white to-[#B8CCF4]/5 rounded-xl p-5 border border-[#C8A0FE]/20">
      <div className="flex items-center justify-between mb-4">
        <h4 className={`text-sm font-semibold ${semantic.textPrimary}`}>Authenticity & Behavioral Signals</h4>
        <div className="group relative">
          <Info className={`w-4 h-4 ${semantic.textMuted} cursor-help`} />
          <div className="absolute right-0 bottom-full mb-2 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            Clarivue flags authenticity and behavioral congruence — helping advisors identify when practice becomes over-rehearsed or non-genuine.
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {signals.map((signal, index) => (
          <div 
            key={index}
            className={`${semantic.surface} rounded-lg p-4 border ${semantic.border} hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                {getStatusIcon(signal.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className={`font-semibold ${semantic.textPrimary} text-sm`}>{signal.signal}</h5>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(signal.type)}`}>
                      {signal.type}
                    </span>
                  </div>
                  <p className={`text-sm ${semantic.textSecondary}`}>{signal.insight}</p>
                  {signal.timestamp && (
                    <p className={`text-xs ${semantic.textMuted} mt-1`}>
                      Detected: {signal.timestamp}
                    </p>
                  )}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusBadge(signal.status)}`}>
                {signal.status === 'healthy' ? '✅ Healthy' : signal.status === 'minor-concern' ? '⚠️ Minor' : '⚠️ Concern'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
