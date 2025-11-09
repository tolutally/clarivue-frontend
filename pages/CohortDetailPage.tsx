import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBackend } from '../contexts/AuthContext';
import { ArrowLeft, Users, AlertTriangle, Settings as SettingsIcon, CheckCircle, UserPlus, Send, Mail } from 'lucide-react';
import { Header } from '../components/Header';
import type { CohortTags, CohortStudent } from '../types/cohort';

interface CohortDetails {
  id: string;
  name: string;
  description: string | null;
  tags: CohortTags;
  objectives: string[] | null;
  students?: CohortStudent[];
}

type Tab = 'overview' | 'students' | 'settings';

export function CohortDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const backend = useBackend();
  const [cohort, setCohort] = useState<CohortDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    loadCohort();
  }, [id]);

  const loadCohort = async () => {
    if (!id) return;
    
    try {
      const data = await backend.cohorts.get({ id });
      setCohort(data);
    } catch (err) {
      console.error('Failed to load cohort:', err);
      navigate('/cohorts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--surface-hover)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cohort...</p>
        </div>
      </div>
    );
  }

  if (!cohort) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--surface-hover)]">
      <Header activeTab="cohorts" onTabChange={(tab) => {
        if (tab === 'overview') navigate('/overview');
        if (tab === 'cohorts') navigate('/cohorts');
        if (tab === 'students') navigate('/students');
        if (tab === 'reports') navigate('/reports');
      }} />
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/cohorts')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cohorts
        </button>

        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{cohort.name}</h1>
              {cohort.description && (
                <p className="text-gray-600">{cohort.description}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {cohort.tags?.term && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                {cohort.tags.term}
              </span>
            )}
            {cohort.tags?.program && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                {cohort.tags.program}
              </span>
            )}
          </div>
        </div>

        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'border-[var(--primary)] text-[var(--primary)]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'students'
                  ? 'border-[var(--primary)] text-[var(--primary)]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'border-[var(--primary)] text-[var(--primary)]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Total Students</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">0</div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Completion Rate</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">0%</div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-medium text-gray-600">Pending Invites</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">0</div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-gray-600">Low Engagement</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">0</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Feed</h2>
              <div className="text-center py-12 text-gray-500">
                <p>No activity yet</p>
                <p className="text-sm mt-2">Activity will appear once students join and complete interviews</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {cohort.students && cohort.students.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Students ({cohort.students.length})
                  </h2>
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/cohorts/${id}/add-students`)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Add More
                    </button>
                    <button
                      onClick={() => navigate(`/cohorts/${id}/send-invites`)}
                      className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg font-medium hover:bg-[var(--primary-dark)] transition-all flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send Interview Invites
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Progress</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Invited</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cohort.students.map((student) => (
                        <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-900">{student.name}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{student.email}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              student.status === 'completed' ? 'bg-green-100 text-green-700' :
                              student.status === 'in-progress' ? 'bg-[var(--primary-light)] text-[var(--primary)]' :
                              student.status === 'invited' ? 'bg-[var(--secondary-light)] text-[var(--secondary)]' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {student.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                              {student.status === 'invited' && <Mail className="w-3 h-3" />}
                              {student.status.charAt(0).toUpperCase() + student.status.slice(1).replace('-', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {student.totalInterviews ? (
                              `${student.completedInterviews || 0} / ${student.totalInterviews}`
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {student.invitedAt ? new Date(student.invitedAt).toLocaleDateString() : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No students yet</h3>
                <p className="text-gray-600 mb-6">Add students to start tracking their progress</p>
                <button
                  onClick={() => navigate(`/cohorts/${id}/add-students`)}
                  className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--primary-dark)] transition-all"
                >
                  Add Students
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Cohort Settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Objectives</h3>
                {cohort.objectives && cohort.objectives.length > 0 ? (
                  <ul className="space-y-2">
                    {cohort.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <span className="text-[var(--primary)]">•</span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No objectives set</p>
                )}
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 text-red-600">Danger Zone</h3>
                <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                  Archive Cohort
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
