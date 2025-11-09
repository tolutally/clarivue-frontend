import { Check, Circle, Minus } from 'lucide-react';
import { semantic } from '../../utils/colors';
import type { DetectedSkill } from '../../types';

interface SkillTagsPanelProps {
  skills: DetectedSkill[];
}

export function SkillTagsPanel({ skills }: SkillTagsPanelProps) {
  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'high': return <Check className="w-3 h-3" />;
      case 'mentioned': return <Circle className="w-3 h-3" />;
      case 'missing': return <Minus className="w-3 h-3" />;
      default: return null;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800';
      case 'mentioned': return 'text-blue-600 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800';
      case 'missing': return 'text-gray-400 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800';
      default: return semantic.border;
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, DetectedSkill[]>);

  return (
    <div className={`${semantic.surface} rounded-xl p-5 border ${semantic.border}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className={`text-sm font-semibold ${semantic.textPrimary}`}>Technical Skills Detected</h4>
        <div className={`flex items-center gap-4 text-xs ${semantic.textMuted}`}>
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-600" />
            Confidently discussed
          </span>
          <span className="flex items-center gap-1">
            <Circle className="w-3 h-3 text-blue-600" />
            Mentioned
          </span>
          <span className="flex items-center gap-1">
            <Minus className="w-3 h-3 text-gray-400" />
            Missing
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category}>
            <div className={`text-xs font-semibold ${semantic.textSecondary} uppercase tracking-wider mb-2`}>
              {category}
            </div>
            <div className="flex flex-wrap gap-2">
              {categorySkills.map((skill, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium flex items-center gap-1.5 ${getConfidenceColor(skill.confidence)}`}
                  title={skill.evidenceTimestamp ? `Evidence: ${skill.evidenceTimestamp}` : undefined}
                >
                  {getConfidenceIcon(skill.confidence)}
                  <span>{skill.skill}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
