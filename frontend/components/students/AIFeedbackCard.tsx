import { Sparkles } from 'lucide-react';
import { semantic, shadows, gradients } from '../../utils/colors';

interface AIFeedbackCardProps {
  feedback: string;
}

export function AIFeedbackCard({ feedback }: AIFeedbackCardProps) {
  return (
    <div className={`bg-gradient-to-br from-[#C8A0FE]/10 via-white to-[#B8CCF4]/10 rounded-2xl ${shadows.sm} border border-[#C8A0FE]/20 p-6`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradients.secondary} flex items-center justify-center`}>
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h3 className={`text-lg font-semibold ${semantic.textPrimary}`}>AI Feedback Summary</h3>
      </div>
      
      <p className="text-gray-700 leading-relaxed">{feedback}</p>
    </div>
  );
}
