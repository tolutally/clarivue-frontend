import { MessageSquare, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function FeedbackSummary() {
  return (
    <Card className="p-6 rounded-xl shadow-sm border-0 bg-gradient-to-br from-[#102c64] to-[#C8A0FE] text-white">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5" />
        <h3 className="text-lg font-semibold">AI Feedback Insights</h3>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-white/10 backdrop-blur rounded-lg">
          <p className="text-sm leading-relaxed">
            You tended to rush your answers 🏃‍♀️ — try pausing between key points. STAR structure improved by <span className="font-semibold text-[#FF5C57]">+22%</span> after second mock.
          </p>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Most Improved Skill</p>
            <p className="text-sm text-white/80">Storytelling with concrete examples</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Focus Area</p>
            <p className="text-sm text-white/80">Slowing down under pressure</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
