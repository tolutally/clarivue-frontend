import { Sparkles, Lightbulb } from 'lucide-react';
import { semantic, gradients, text } from '../../utils/colors';

interface AIFeedbackRecommendationsProps {
  summary: string;
  recommendations: string[];
}

export function AIFeedbackRecommendations({ summary, recommendations }: AIFeedbackRecommendationsProps) {
  return (
    <div className="bg-gradient-to-br from-[#C8A0FE]/10 via-white to-[#B8CCF4]/10 rounded-xl p-5 border border-[#C8A0FE]/20">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradients.secondary} flex items-center justify-center`}>
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h4 className={`text-sm font-semibold ${semantic.textPrimary}`}>AI Feedback Summary</h4>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6 p-4 bg-white/50 rounded-lg border ${semantic.border}">
        {summary}
      </p>

      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className={`w-5 h-5 ${text.primary}`} />
          <h5 className={`text-sm font-semibold ${semantic.textPrimary}`}>Personalized Recommendations</h5>
        </div>
        
        {recommendations.map((rec, index) => (
          <div 
            key={index}
            className={`flex items-start gap-3 p-3 ${semantic.surface} rounded-lg border ${semantic.border} hover:border-[#102c64]/30 transition-all group`}
          >
            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${gradients.tertiary} flex items-center justify-center flex-shrink-0 text-white text-xs font-bold group-hover:scale-110 transition-transform`}>
              {index + 1}
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{rec}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
