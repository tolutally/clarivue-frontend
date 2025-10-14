import { Lightbulb, Download, FileText, FileSpreadsheet, Mail, HelpCircle, Clock, Target, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { semantic, text } from '../../utils/colors';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface AutoInsightsPanelProps {
  insights: {
    efficiency: string[];
    skillGaps: string[];
    equity: string[];
  };
}

export function AutoInsightsPanel({ insights }: AutoInsightsPanelProps) {
  const insightGroups = [
    { 
      theme: 'Efficiency', 
      icon: Clock, 
      color: 'text-green-600', 
      bgColor: 'bg-green-50',
      borderColor: 'border-green-100',
      items: insights.efficiency 
    },
    { 
      theme: 'Skill Gaps', 
      icon: Target, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      items: insights.skillGaps 
    },
    { 
      theme: 'Equity', 
      icon: Users, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      items: insights.equity 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#C8A0FE]/10 to-[#B8CCF4]/10 rounded-lg border border-[#C8A0FE]/20 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-[#C8A0FE]" />
          <h3 className={`text-sm font-semibold ${semantic.textPrimary}`}>Auto-Generated Insights</h3>
        </div>
        <div className="space-y-4">
          {insightGroups.map((group) => (
            <div key={group.theme}>
              <div className="flex items-center gap-2 mb-2">
                <group.icon className={`w-4 h-4 ${group.color}`} />
                <h4 className={`text-xs font-semibold ${group.color} uppercase tracking-wide`}>{group.theme}</h4>
              </div>
              <div className="space-y-2">
                {group.items.map((insight, i) => (
                  <div
                    key={i}
                    className={`${group.bgColor} rounded-lg px-3 py-2 text-xs font-medium text-gray-800 border ${group.borderColor}`}
                  >
                    {insight}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${semantic.surface} rounded-lg border ${semantic.borderMedium} p-5`}>
        <h3 className={`text-sm font-semibold ${semantic.textPrimary} mb-4`}>Export & Schedule</h3>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start gap-3">
            <FileText className="w-4 h-4 text-[#FE686D]" />
            Export as PDF
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3">
            <FileSpreadsheet className="w-4 h-4 text-[#C8A0FE]" />
            Export as CSV
          </Button>
          <div className={`border-t ${semantic.borderMedium} my-3`} />
          <Button variant="outline" className="w-full justify-start gap-3">
            <Mail className={`w-4 h-4 ${text.primary}`} />
            Schedule Weekly Email
          </Button>
        </div>
      </div>

      <DefinitionsPanel />
    </div>
  );
}

function DefinitionsPanel() {
  const definitions = [
    {
      term: 'Readiness Score',
      definition: 'Weighted composite — Communication (25), Problem Solving (20), Technical (25), Confidence (15), Clarity (15).',
    },
    {
      term: 'Improvement After ≥2 Mocks',
      definition: 'Latest mock score minus first mock score for students completing at least 2 practice sessions.',
    },
    {
      term: 'Practice Intensity',
      definition: 'Median number of mock interview sessions per active student within the selected time period.',
    },
    {
      term: 'Red-Flag Rate',
      definition: '% of sessions with authenticity/behavioral flags: rehearsed phrasing spikes, contradictions, or off-topic drift.',
    },
    {
      term: 'Offer Rate',
      definition: 'Percentage of candidates who received job/internship offers. Self-reported or verified with employer feedback.',
    },
  ];

  return (
    <div className={`${semantic.surface} rounded-lg border ${semantic.borderMedium} p-5`}>
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className={`w-4 h-4 ${semantic.textSecondary}`} />
        <h3 className={`text-sm font-semibold ${semantic.textPrimary}`}>Definitions</h3>
      </div>
      <div className="space-y-3">
        {definitions.map((def, i) => (
          <Popover key={i}>
            <PopoverTrigger asChild>
              <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-700 transition-colors">
                {def.term}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80" side="left">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">{def.term}</h4>
                <p className="text-xs text-gray-600">{def.definition}</p>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  );
}
