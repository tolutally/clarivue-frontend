import { FileText } from 'lucide-react';
import { semantic, shadows, text, borders } from '../../utils/colors';

interface TranscriptSnippetsProps {
  early: string;
  recent: string;
}

export function TranscriptSnippets({ early, recent }: TranscriptSnippetsProps) {
  return (
    <div className={`${semantic.surface} rounded-2xl ${shadows.sm} border ${semantic.border} p-6`}>
      <div className="flex items-center gap-3 mb-6">
        <FileText className={`w-5 h-5 ${text.primary}`} />
        <h3 className={`text-lg font-semibold ${semantic.textPrimary}`}>Transcript Snippets</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#FE686D]"></div>
            <h4 className={`text-sm font-semibold ${semantic.textSecondary}`}>Early Mock (v1)</h4>
          </div>
          <div className={`p-4 bg-gradient-to-br from-[#FE686D]/5 to-[#FE686D]/10 border-l-4 ${borders.accent} rounded-lg`}>
            <p className="text-sm text-gray-700 leading-relaxed italic">"{early}"</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <h4 className={`text-sm font-semibold ${semantic.textSecondary}`}>Recent Mock (v3)</h4>
          </div>
          <div className={`p-4 bg-gradient-to-br ${semantic.successGradient} border-l-4 ${semantic.successBorder} rounded-lg`}>
            <p className="text-sm text-gray-700 leading-relaxed italic">"{recent}"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
