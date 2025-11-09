import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBackend } from '../contexts/AuthContext';
import { ArrowLeft, Send, CheckCircle, Clock, Users as UsersIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/toast';
import type { CohortStudent } from '../types/cohort';

export function SendInvitesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const backend = useBackend();
  const toast = useToast();
  
  const [cohort, setCohort] = useState<{ name: string; students: CohortStudent[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [timeLimit, setTimeLimit] = useState<number>(45);
  const [numberOfInterviews, setNumberOfInterviews] = useState<number>(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadCohort();
  }, [id]);

  const loadCohort = async () => {
    if (!id) return;
    
    try {
      const data = await backend.cohorts.get({ id });
      setCohort(data);
      
      // Auto-select students who haven't been invited yet
      if (data.students) {
        const uninvitedStudents = data.students
          .filter((s: CohortStudent) => s.status === 'added')
          .map((s: CohortStudent) => s.id);
        setSelectedStudents(new Set(uninvitedStudents));
      }
    } catch (err) {
      console.error('Failed to load cohort:', err);
      navigate(`/cohorts/${id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStudent = (studentId: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleSelectAll = () => {
    if (!cohort?.students) return;
    
    const allIds = cohort.students.map(s => s.id);
    if (selectedStudents.size === allIds.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(allIds));
    }
  };

  const handleSendInvites = async () => {
    if (selectedStudents.size === 0) {
      const errorMsg = 'Please select at least one student';
      setError(errorMsg);
      toast.error('No students selected', errorMsg);
      return;
    }

    setError('');
    setSending(true);

    try {
      await backend.cohorts.sendInvites({
        cohortId: id!,
        studentIds: Array.from(selectedStudents),
        timeLimit,
        numberOfInterviews,
      });

      const successMsg = `Successfully sent invites to ${selectedStudents.size} student${selectedStudents.size > 1 ? 's' : ''}`;
      setSuccess(successMsg);
      toast.success('Invites sent!', `${selectedStudents.size} invitation${selectedStudents.size > 1 ? 's' : ''} sent successfully`);
      
      // Navigate back after 2 seconds
      setTimeout(() => {
        navigate(`/cohorts/${id}`);
      }, 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to send invites';
      setError(errorMsg);
      toast.error('Failed to send invites', errorMsg);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--surface-hover)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  if (!cohort || !cohort.students || cohort.students.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--surface-hover)]">
        <Header activeTab="cohorts" onTabChange={(tab) => {
          if (tab === 'overview') navigate('/overview');
          if (tab === 'cohorts') navigate('/cohorts');
          if (tab === 'students') navigate('/students');
          if (tab === 'reports') navigate('/reports');
        }} />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <UsersIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Students Found</h2>
            <p className="text-gray-600 mb-6">Add students to this cohort before sending invites</p>
            <button
              onClick={() => navigate(`/cohorts/${id}/add-students`)}
              className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--primary-dark)] transition-all"
            >
              Add Students
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface-hover)]">
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
      <Header activeTab="cohorts" onTabChange={(tab) => {
        if (tab === 'overview') navigate('/overview');
        if (tab === 'cohorts') navigate('/cohorts');
        if (tab === 'students') navigate('/students');
        if (tab === 'reports') navigate('/reports');
      }} />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate(`/cohorts/${id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cohort
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Send Interview Invites</h1>
          <p className="text-gray-600 mb-8">
            Configure and send mock interview invitations to students in <strong>{cohort.name}</strong>
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          <div className="space-y-8">
            {/* Configuration Section */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Time Limit per Interview
                </label>
                <select
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Students will have {timeLimit} minutes to complete each interview
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UsersIcon className="w-4 h-4 inline mr-2" />
                  Number of Interviews
                </label>
                <select
                  value={numberOfInterviews}
                  onChange={(e) => setNumberOfInterviews(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                >
                  <option value={1}>1 interview</option>
                  <option value={2}>2 interviews</option>
                  <option value={3}>3 interviews</option>
                  <option value={4}>4 interviews</option>
                  <option value={5}>5 interviews</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Each student will complete {numberOfInterviews} mock interview{numberOfInterviews > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Student Selection Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Students ({selectedStudents.size} of {cohort.students.length})
                </h3>
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium"
                >
                  {selectedStudents.size === cohort.students.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {cohort.students.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => handleToggleStudent(student.id)}
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedStudents.has(student.id)
                        ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.has(student.id)}
                      onChange={() => {}}
                      className="w-5 h-5 text-[var(--primary)] border-gray-300 rounded focus:ring-[var(--primary)]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">{student.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          student.status === 'completed' ? 'bg-green-100 text-green-700' :
                          student.status === 'in-progress' ? 'bg-[var(--primary-light)] text-[var(--primary)]' :
                          student.status === 'invited' ? 'bg-[var(--secondary-light)] text-[var(--secondary)]' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {student.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{student.email}</div>
                    </div>
                    {student.status === 'invited' && (
                      <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                        Already invited
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-3">Invitation Summary</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• {selectedStudents.size} student{selectedStudents.size !== 1 ? 's' : ''} will receive invitations</li>
                <li>• Each student will complete {numberOfInterviews} interview{numberOfInterviews > 1 ? 's' : ''}</li>
                <li>• Time limit: {timeLimit} minutes per interview</li>
                <li>• Students will receive an email with a unique invitation link</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(`/cohorts/${id}`)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvites}
                disabled={sending || selectedStudents.size === 0}
                className="flex-1 bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--primary-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending Invites...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send {selectedStudents.size} Invitation{selectedStudents.size !== 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
