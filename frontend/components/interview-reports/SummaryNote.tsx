import { semantic } from '../../utils/colors';

interface SummaryNoteProps {
  note: string;
}

export function SummaryNote({ note }: SummaryNoteProps) {
  return (
    <div className={`bg-gradient-to-br from-[#B8CCF4]/10 to-white rounded-xl p-4 border ${semantic.border}`}>
      <h4 className={`text-sm font-semibold ${semantic.textSecondary} mb-2`}>Summary Note</h4>
      <p className="text-gray-700 leading-relaxed italic">"{note}"</p>
    </div>
  );
}
