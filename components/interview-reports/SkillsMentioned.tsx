import { Tag, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import type { DetectedSkill } from '../../types';

interface SkillsMentionedProps {
  skills: DetectedSkill[];
  onTimestampClick?: (timestamp: string) => void;
}

const confidenceColors: Record<'high' | 'mentioned' | 'low' | 'missing', { bg: string; border: string; text: string; label: string }> = {
  high: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-600',
    label: 'High Confidence'
  },
  mentioned: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-600',
    label: 'Mentioned'
  },
  low: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-600',
    label: 'Low Confidence'
  },
  missing: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    text: 'text-slate-500',
    label: 'Not Mentioned'
  }
};

export function SkillsMentioned({ skills, onTimestampClick }: SkillsMentionedProps) {
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, DetectedSkill[]>);

  const highConfidence = skills.filter(s => s.confidence === 'high').length;
  const mentioned = skills.filter(s => s.confidence === 'mentioned').length;
  const missing = skills.filter(s => s.confidence === 'missing').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Skills Mentioned</h3>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">{highConfidence} High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">{mentioned} Mentioned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-slate-400" />
            <span className="text-muted-foreground">{missing} Missing</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {categorySkills.map((skill, index) => {
                const colors = confidenceColors[skill.confidence];
                return (
                  <div
                    key={`${skill.skill}-${index}`}
                    className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border ${colors.bg} ${colors.border} transition-all hover:shadow-sm`}
                  >
                    <span className={`text-sm font-medium ${colors.text}`}>
                      {skill.skill}
                    </span>
                    {skill.evidenceTimestamp && (
                      <button
                        onClick={() => onTimestampClick?.(skill.evidenceTimestamp!)}
                        className={`flex items-center gap-1 ${colors.text} hover:underline text-xs`}
                        title="Jump to transcript"
                      >
                        <Clock className="w-3 h-3" />
                        {skill.evidenceTimestamp}
                      </button>
                    )}
                    {skill.confidence === 'high' && (
                      <TrendingUp className="w-3 h-3 text-emerald-600" />
                    )}
                    {skill.confidence === 'missing' && (
                      <AlertCircle className="w-3 h-3 text-slate-400" />
                    )}

                    {skill.context && (
                      <div className="absolute left-0 top-full mt-2 w-72 p-3 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <p className="text-xs text-muted-foreground mb-1 font-medium">
                          Context:
                        </p>
                        <p className="text-xs text-foreground leading-relaxed">
                          {skill.context}
                        </p>
                        {skill.evidenceTimestamp && (
                          <p className="text-xs text-muted-foreground mt-2">
                            @ {skill.evidenceTimestamp}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Tag className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No skills detected in transcript</p>
        </div>
      )}
    </div>
  );
}
