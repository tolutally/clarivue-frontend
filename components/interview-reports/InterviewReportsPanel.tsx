import { FileText } from 'lucide-react';
import { semantic, text } from '../../utils/colors';
import type { InterviewReport } from '../../types';
import { InterviewReportCard } from './InterviewReportCard';

interface InterviewReportsPanelProps {
  reports: InterviewReport[];
}

export function InterviewReportsPanel({ reports }: InterviewReportsPanelProps) {
  const sortedReports = [...reports].sort((a, b) => b.interviewNumber - a.interviewNumber);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className={`w-6 h-6 ${text.primary}`} />
        <div>
          <h2 className={`text-2xl font-bold ${semantic.textPrimary}`}>Interview Reports</h2>
          <p className={`text-sm ${semantic.textSecondary}`}>Detailed breakdown of each mock interview session</p>
        </div>
      </div>

      <div className="space-y-4">
        {sortedReports.map((report) => (
          <InterviewReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
