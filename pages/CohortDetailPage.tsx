import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, AlertTriangle, Settings as SettingsIcon, CheckCircle, UserPlus, Send, Mail, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '../components/Header';
import { useCohort, useCohortMembers, useDeleteCohort } from '@/hooks/useCohorts';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/toast';
import { backgrounds } from '@/utils/colors';
import { navigateFromDashboardTab } from '@/utils/dashboardTabNavigation';
import type { CohortMember } from '@/services';

type Tab = 'overview' | 'students' | 'settings';

export function CohortDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const toast = useToast();
  
  const { data: cohort, isLoading: loading, isError } = useCohort(id);
  const { data: membersData, isLoading: membersLoading } = useCohortMembers(
    activeTab === 'students' ? id : undefined,
    { page: 1, page_size: 100 }
  );
  const deleteCohort = useDeleteCohort();

  const members = (membersData?.items || []) as CohortMember[];

  useEffect(() => {
    if (isError) {
      navigate('/cohorts');
    }
  }, [isError, navigate]);

  const handleDeleteCohort = async () => {
    if (!id) return;

    try {
      await deleteCohort.mutateAsync(id);
      toast.success('Cohort deleted', `${cohort?.name} has been permanently deleted`);
      navigate('/cohorts');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error?.detail || err?.message || 'Failed to delete cohort';
      toast.error('Failed to delete cohort', errorMessage);
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cohort...</p>
        </div>
      </div>
    );
  }

  if (!cohort) {
    return null;
  }

  return (
    <div className={`min-h-screen ${backgrounds.surfaceActive}`}>
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
      <Header activeTab="cohorts" onTabChange={(tab) => navigateFromDashboardTab(navigate, tab)} />
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <Button
          onClick={() => navigate('/cohorts')}
          variant="ghost"
          startIcon={<ArrowLeft className="w-5 h-5" />}
          className="text-gray-600 hover:text-gray-900 mb-6 w-fit"
        >
          Back to Cohorts
        </Button>

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
            {cohort.term?.name && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                {cohort.term.name}
              </span>
            )}
            {cohort.program?.name && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                {cohort.program.name}
              </span>
            )}
            {cohort.custom_tags?.map((tag) => (
              <span key={tag._id} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-6">
            {(['overview', 'students', 'settings'] as Tab[]).map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                variant="ghost"
                className={`pb-3 px-1 border-b-2 font-medium transition-colors rounded-none ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Total Members</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{cohort.member_count || 0}</div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Completion Rate</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {cohort.member_count > 0 && cohort.session_invite_count > 0
                    ? Math.min(100, Math.round((cohort.member_count / cohort.session_invite_count) * 100))
                    : 0}%
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-medium text-gray-600">Session Invites</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{cohort.session_invite_count || 0}</div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Engagement</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {cohort.member_count > 0 ? 'Active' : '—'}
                </div>
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
            {membersLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading members...</p>
              </div>
            ) : members && members.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Members ({membersData?.total || members.length})
                  </h2>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => navigate(`/cohorts/${id}/add-students`)}
                      variant="outline"
                      className="font-medium flex items-center gap-2"
                      startIcon={<UserPlus className="w-4 h-4" />}
                    >
                      Add More
                    </Button>
                    <Button
                      onClick={() => navigate(`/cohorts/${id}/send-invites`)}
                      variant="primary"
                      className="font-medium flex items-center gap-2"
                      startIcon={<Send className="w-4 h-4" />}
                    >
                      Send Interview Invites
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-900">
                            {member.user?.name || '—'}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{member.user?.email || '—'}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              {member.user?.role?.name || 'Member'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {member.created_at ? new Date(member.created_at).toLocaleDateString() : '—'}
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No members yet</h3>
                <p className="text-gray-600 mb-6">Add members to start tracking their progress</p>
                <Button
                  onClick={() => navigate(`/cohorts/${id}/add-students`)}
                  variant="primary"
                  size="lg"
                >
                  Add Members
                </Button>
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
                    {cohort.objectives.map((obj) => (
                      <li key={obj._id} className="flex items-start gap-2 text-gray-700">
                        <span className="text-primary">•</span>
                        {obj.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No objectives set</p>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Custom Tags</h3>
                {cohort.custom_tags && cohort.custom_tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {cohort.custom_tags.map((tag) => (
                      <span key={tag._id} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No custom tags set</p>
                )}
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Once you delete a cohort, there is no going back. Please be certain.
                </p>
                <Button
                  onClick={() => setShowDeleteModal(true)}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                  startIcon={<Trash2 className="w-4 h-4" />}
                >
                  Delete Cohort
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Delete Cohort
                </h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <span className="font-semibold">"{cohort?.name}"</span>? 
              This will permanently delete the cohort and all associated data, including member records and interview history.
            </p>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="outline"
                className="flex-1"
                disabled={deleteCohort.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteCohort}
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                loading={deleteCohort.isPending}
                disabled={deleteCohort.isPending}
              >
                {deleteCohort.isPending ? 'Deleting...' : 'Delete Cohort'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
