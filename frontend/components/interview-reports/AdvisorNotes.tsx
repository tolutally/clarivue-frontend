import { useState } from 'react';
import { MessageSquare, Plus, Eye, EyeOff } from 'lucide-react';
import { semantic, backgrounds, hover, text } from '../../utils/colors';
import type { AdvisorNote } from '../../types';

interface AdvisorNotesProps {
  notes?: AdvisorNote[];
}

export function AdvisorNotes({ notes = [] }: AdvisorNotesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [visibleToStudent, setVisibleToStudent] = useState(true);
  const [allNotes, setAllNotes] = useState<AdvisorNote[]>(notes);

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: AdvisorNote = {
      id: `note-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      author: 'Current Advisor',
      content: newNote,
      visibleToStudent
    };

    setAllNotes([note, ...allNotes]);
    setNewNote('');
    setIsAdding(false);
  };

  return (
    <div className={`${semantic.surface} rounded-xl p-5 border ${semantic.border}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className={`w-5 h-5 ${text.primary}`} />
          <h4 className={`text-sm font-semibold ${semantic.textPrimary}`}>Advisor Notes & Actions</h4>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`flex items-center gap-2 px-3 py-1.5 ${backgrounds.primary} text-white rounded-lg ${hover.primary} transition-colors text-sm font-medium`}
        >
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </div>

      {isAdding && (
        <div className={`mb-4 p-4 ${semantic.bgSubtle} rounded-lg border ${semantic.borderMedium}`}>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter your note or action item..."
            className={`w-full p-3 border ${semantic.borderMedium} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#102c64]/20 focus:border-[#102c64] text-sm resize-none`}
            rows={3}
          />
          
          <div className="flex items-center justify-between mt-3">
            <label className={`flex items-center gap-2 text-sm ${semantic.textSecondary} cursor-pointer`}>
              <input
                type="checkbox"
                checked={visibleToStudent}
                onChange={(e) => setVisibleToStudent(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#102c64] focus:ring-[#102c64]/20"
              />
              <span className="flex items-center gap-1">
                {visibleToStudent ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                Visible to Student
              </span>
            </label>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewNote('');
                }}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                className={`px-3 py-1.5 ${backgrounds.primary} text-white rounded-lg ${hover.primary} transition-colors text-sm font-medium`}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {allNotes.length === 0 ? (
          <p className={`text-sm ${semantic.textTertiary} text-center py-4`}>No advisor notes yet.</p>
        ) : (
          allNotes.map((note) => (
            <div 
              key={note.id}
              className="p-4 bg-gradient-to-r from-[#102c64]/5 to-[#B8CCF4]/10 rounded-lg border border-gray-100"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${semantic.textPrimary}`}>{note.author}</span>
                  <span className={`text-xs ${semantic.textTertiary}`}>•</span>
                  <span className={`text-xs ${semantic.textTertiary}`}>{note.date}</span>
                </div>
                {note.visibleToStudent ? (
                  <span className={`flex items-center gap-1 text-xs ${semantic.success} ${semantic.successBg} px-2 py-0.5 rounded-full border ${semantic.successBorder}`}>
                    <Eye className="w-3 h-3" />
                    Visible
                  </span>
                ) : (
                  <span className={`flex items-center gap-1 text-xs ${semantic.textSecondary} ${semantic.bgSubtle} px-2 py-0.5 rounded-full border ${semantic.borderMedium}`}>
                    <EyeOff className="w-3 h-3" />
                    Private
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{note.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
