import { Loader2, MessageSquare, Ear, Brain, CheckCircle2 } from 'lucide-react';

export type InterviewState = 'idle' | 'asking' | 'listening' | 'thinking' | 'finished';

interface StateIndicatorProps {
  state: InterviewState;
  message?: string;
}

/**
 * StateIndicator Component
 * 
 * Visual indicator of the current interview state
 * Shows icons and messages for: idle, asking, listening, thinking, finished
 */
export function StateIndicator({ state, message }: StateIndicatorProps) {
  const stateConfig = {
    idle: {
      icon: null,
      text: message || 'Ready to start',
      className: 'bg-gray-100 text-gray-700',
      iconColor: 'text-gray-600',
    },
    asking: {
      icon: MessageSquare,
      text: message || 'AI is asking a question...',
      className: 'bg-blue-50 text-blue-700',
      iconColor: 'text-blue-600',
    },
    listening: {
      icon: Ear,
      text: message || 'Listening to your response...',
      className: 'bg-green-50 text-green-700',
      iconColor: 'text-green-600',
    },
    thinking: {
      icon: Brain,
      text: message || 'AI is processing...',
      className: 'bg-purple-50 text-purple-700',
      iconColor: 'text-purple-600',
    },
    finished: {
      icon: CheckCircle2,
      text: message || 'Interview complete',
      className: 'bg-emerald-50 text-emerald-700',
      iconColor: 'text-emerald-600',
    },
  };

  const config = stateConfig[state];
  const Icon = config.icon;

  return (
    <div className={`px-6 py-3 rounded-lg flex items-center gap-3 ${config.className}`}>
      {Icon && <Icon className={`w-5 h-5 ${config.iconColor}`} />}
      {!Icon && state === 'idle' && <div className="w-2 h-2 rounded-full bg-gray-400"></div>}
      {(state === 'listening' || state === 'thinking') && (
        <Loader2 className={`w-5 h-5 ${config.iconColor} animate-spin`} />
      )}
      <span className="text-sm font-medium">{config.text}</span>
    </div>
  );
}
