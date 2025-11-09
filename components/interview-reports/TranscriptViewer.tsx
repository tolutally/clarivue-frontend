import { useState, useImperativeHandle, forwardRef, useRef } from 'react';
import { FileText, Download, Mail, Share2, Search } from 'lucide-react';
import { semantic, backgrounds, shadows } from '../../utils/colors';

interface TranscriptViewerProps {
  transcript: string;
  interviewNumber: number;
}

export interface TranscriptViewerHandle {
  scrollToTimestamp: (timestamp: string) => void;
}

export const TranscriptViewer = forwardRef<TranscriptViewerHandle, TranscriptViewerProps>(
  ({ transcript, interviewNumber }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'star' | 'weak'>('all');
  const [highlightTimestamp, setHighlightTimestamp] = useState<string | null>(null);
  const transcriptContentRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    scrollToTimestamp: (timestamp: string) => {
      setIsOpen(true);
      setHighlightTimestamp(timestamp);
      setTimeout(() => {
        const element = transcriptContentRef.current?.querySelector(`[data-timestamp="${timestamp}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }));

  const extractTimestampFromSection = (section: string): string | null => {
    const timestampMatch = section.match(/(\d{1,2}:\d{2}(?::\d{2})?)/);
    return timestampMatch ? timestampMatch[1] : null;
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i} className={semantic.highlight}>{part}</mark>
        : part
    );
  };

  const filteredTranscript = transcript
    .split('\n\n')
    .filter(section => {
      if (filter === 'all') return true;
      if (filter === 'star') {
        return section.toLowerCase().includes('situation') || 
               section.toLowerCase().includes('task') || 
               section.toLowerCase().includes('action') || 
               section.toLowerCase().includes('result');
      }
      return section.toLowerCase().includes('um') || 
             section.toLowerCase().includes('like') || 
             section.length < 100;
    });

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 ${semantic.surface} border ${semantic.borderMedium} rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium ${semantic.textSecondary}`}
      >
        <FileText className="w-4 h-4" />
        View Raw Transcript
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${semantic.surface} rounded-2xl ${shadows.lg} max-w-4xl w-full max-h-[90vh] flex flex-col`}>
            <div className={`p-6 border-b ${semantic.borderMedium}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${semantic.textPrimary}`}>
                  Interview #{interviewNumber} Transcript
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`${semantic.textMuted} hover:${semantic.textSecondary} transition-colors`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${semantic.textMuted}`} />
                  <input
                    type="text"
                    placeholder="Search transcript..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border ${semantic.borderMedium} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102c64]/20 focus:border-[#102c64] text-sm`}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'all' 
                        ? `${backgrounds.primary} text-white` 
                        : `${semantic.bgSubtle} ${semantic.textSecondary} hover:bg-gray-200`
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('star')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'star' 
                        ? `${backgrounds.primary} text-white` 
                        : `${semantic.bgSubtle} ${semantic.textSecondary} hover:bg-gray-200`
                    }`}
                  >
                    STAR Answers
                  </button>
                  <button
                    onClick={() => setFilter('weak')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'weak' 
                        ? `${backgrounds.primary} text-white` 
                        : `${semantic.bgSubtle} ${semantic.textSecondary} hover:bg-gray-200`
                    }`}
                  >
                    Weak Answers
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button className={`flex items-center gap-2 px-3 py-2 ${semantic.bgSubtle} hover:bg-gray-200 rounded-lg text-sm font-medium ${semantic.textSecondary} transition-colors`}>
                  <Download className="w-4 h-4" />
                  PDF Summary
                </button>
                <button className={`flex items-center gap-2 px-3 py-2 ${semantic.bgSubtle} hover:bg-gray-200 rounded-lg text-sm font-medium ${semantic.textSecondary} transition-colors`}>
                  <Mail className="w-4 h-4" />
                  Email to Student
                </button>
                <button className={`flex items-center gap-2 px-3 py-2 ${semantic.bgSubtle} hover:bg-gray-200 rounded-lg text-sm font-medium ${semantic.textSecondary} transition-colors`}>
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            <div ref={transcriptContentRef} className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-sm max-w-none">
                {filteredTranscript.map((section, index) => {
                  const sectionTimestamp = extractTimestampFromSection(section);
                  const isHighlighted = highlightTimestamp && sectionTimestamp === highlightTimestamp;
                  return (
                    <div 
                      key={index} 
                      data-timestamp={sectionTimestamp || undefined}
                      className={`mb-4 p-4 rounded-lg border transition-all ${
                        isHighlighted 
                          ? 'bg-amber-50 border-amber-300 shadow-md' 
                          : `${semantic.bgSubtle} ${semantic.border}`
                      }`}
                    >
                      <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                        {highlightText(section, searchQuery)}
                      </pre>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
