import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface InterviewTimerProps {
  startTime?: number;
  maxDuration?: number; // in seconds
  onTimeUp?: () => void;
}

/**
 * InterviewTimer Component
 * 
 * Displays elapsed time in MM:SS format
 * Optionally shows a countdown and calls onTimeUp when max duration is reached
 */
export function InterviewTimer({ startTime, maxDuration, onTimeUp }: InterviewTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const start = startTime || now;
      const elapsedSeconds = Math.floor((now - start) / 1000);
      setElapsed(elapsedSeconds);

      if (maxDuration && elapsedSeconds >= maxDuration) {
        onTimeUp?.();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, maxDuration, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isWarning = maxDuration && elapsed > maxDuration * 0.8;
  const isDanger = maxDuration && elapsed > maxDuration * 0.95;

  return (
    <div className="flex items-center gap-2">
      <Clock 
        className={`w-4 h-4 ${
          isDanger ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-gray-600'
        }`} 
      />
      <span 
        className={`font-mono text-sm font-medium ${
          isDanger ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-gray-900'
        }`}
      >
        {formatTime(elapsed)}
        {maxDuration && (
          <span className="text-gray-500"> / {formatTime(maxDuration)}</span>
        )}
      </span>
    </div>
  );
}
