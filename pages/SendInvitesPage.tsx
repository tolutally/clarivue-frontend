import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Send, CheckCircle, Clock, Users as UsersIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { Button } from '@/components/ui/button';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/toast';
import { useCohort, useCohortMembers } from '@/hooks/useCohorts';
import { useCreateBatchInvite } from '@/hooks/useSessionInvites';
import type { CohortMember } from '@/services';
import { backgrounds } from '@/utils/colors';

export function SendInvitesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  
  const { data: cohort, isLoading: cohortLoading } = useCohort(id);
  const { data: membersData, isLoading: membersLoading } = useCohortMembers(id, { page: 1, page_size: 100 });
  const createBatchInvite = useCreateBatchInvite();
  
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [timeLimit, setTimeLimit] = useState<number>(45);
  const [isCustomTimeLimit, setIsCustomTimeLimit] = useState<boolean>(false);
  const [customTimeLimit, setCustomTimeLimit] = useState<number>(45);
  const [numberOfInterviews, setNumberOfInterviews] = useState<number>(1);
  const [description, setDescription] = useState<string>('');
  const [expiresInDays, setExpiresInDays] = useState<number>(30);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const members = membersData?.items || [];
  const loading = cohortLoading || membersLoading;

  // Auto-select all members on mount
  useEffect(() => {
    if (members.length > 0 && selectedMembers.size === 0) {
      const allMemberIds = members.map(m => m.user._id);
      setSelectedMembers(new Set(allMemberIds));
    }
  }, [members]);

  const handleToggleMember = (userId: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedMembers(newSelected);
  };

  const handleSelectAll = () => {
    if (members.length === 0) return;
    
    const allIds = members.map(m => m.user._id);
    if (selectedMembers.size === allIds.length) {
      setSelectedMembers(new Set());
    } else {
      setSelectedMembers(new Set(allIds));
    }
  };

  const handleSendInvites = async () => {
    if (selectedMembers.size === 0) {
      const errorMsg = 'Please select at least one member';
      setError(errorMsg);
      toast.error('No members selected', errorMsg);
      return;
    }

    if (!id || !cohort) return;

    setError('');

    try {
      // Get user emails from selected members
      const selectedMemberObjects = members.filter(m => selectedMembers.has(m.user._id));
      const userEmails = selectedMemberObjects.map(m => m.user.email);

      const finalTimeLimit = isCustomTimeLimit ? customTimeLimit : timeLimit;
      
      if (finalTimeLimit <= 0) {
        const errorMsg = 'Time limit must be greater than 0';
        setError(errorMsg);
        toast.error('Invalid time limit', errorMsg);
        return;
      }

      await createBatchInvite.mutateAsync({
        cohort_id: id,
        description: description || `Interview invites for ${cohort.name}`,
        expires_in_days: expiresInDays,
        session_type: 'interview',
        time_limit_minutes: finalTimeLimit,
        total_sessions_allowed: numberOfInterviews,
        user_emails: userEmails,
      });

      // Revalidate the specific cohort to refresh its data
      if (id) {
        queryClient.invalidateQueries({ queryKey: ['cohorts', id] });
      }

      const successMsg = `Successfully sent invites to ${selectedMembers.size} member${selectedMembers.size > 1 ? 's' : ''}`;
      setSuccess(successMsg);
      toast.success('Invites sent!', `${selectedMembers.size} invitation${selectedMembers.size > 1 ? 's' : ''} sent successfully`);
      
      // Navigate back after 2 seconds
      setTimeout(() => {
        navigate(`/cohorts/${id}`);
      }, 2000);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error?.detail || err?.message || 'Failed to send invites';
      setError(errorMsg);
      toast.error('Failed to send invites', errorMsg);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${backgrounds.surfaceActive} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading members...</p>
        </div>
      </div>
    );
  }

  if (!cohort || !members || members.length === 0) {
    return (
      <div className={`min-h-screen ${backgrounds.surfaceActive}`}>
        <Header activeTab="cohorts" onTabChange={(tab) => {
          if (tab === 'overview') navigate('/overview');
          if (tab === 'cohorts') navigate('/cohorts');
          if (tab === 'students') navigate('/students');
          if (tab === 'reports') navigate('/reports');
        }} />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <UsersIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Members Found</h2>
            <p className="text-gray-600 mb-6">Add members to this cohort before sending invites</p>
            <Button
              onClick={() => navigate(`/cohorts/${id}/add-students`)}
              variant="primary"
              size="lg"
            >
              Add Members
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${backgrounds.surfaceActive}`}>
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
      <Header activeTab="cohorts" onTabChange={(tab) => {
        if (tab === 'overview') navigate('/overview');
        if (tab === 'cohorts') navigate('/cohorts');
        if (tab === 'students') navigate('/students');
        if (tab === 'reports') navigate('/reports');
      }} />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Button
          onClick={() => navigate(`/cohorts/${id}`)}
          variant="ghost"
          startIcon={<ArrowLeft className="w-5 h-5" />}
          className="text-gray-600 hover:text-gray-900 mb-6 w-fit"
        >
          Back to Cohort
        </Button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Send Interview Invites</h1>
          <p className="text-gray-600 mb-8">
            Configure and send mock interview invitations to members in <strong>{cohort.name}</strong>
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
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
                  value={isCustomTimeLimit ? 'custom' : timeLimit}
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setIsCustomTimeLimit(true);
                    } else {
                      setIsCustomTimeLimit(false);
                      setTimeLimit(Number(e.target.value));
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                  <option value="custom">Custom</option>
                </select>
                {isCustomTimeLimit && (
                  <input
                    type="number"
                    value={customTimeLimit}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : Number(e.target.value);
                      setCustomTimeLimit(value);
                    }}
                    min={1}
                    placeholder="Enter minutes"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mt-2"
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Members will have {isCustomTimeLimit ? customTimeLimit : timeLimit} minutes to complete each interview
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value={1}>1 interview</option>
                  <option value={2}>2 interviews</option>
                  <option value={3}>3 interviews</option>
                  <option value={4}>4 interviews</option>
                  <option value={5}>5 interviews</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Each member will complete {numberOfInterviews} mock interview{numberOfInterviews > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Additional Configuration */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={`Interview invites for ${cohort.name}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional description for this batch of invites
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expires In (Days)
                </label>
                <input
                  type="number"
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(Number(e.target.value))}
                  min={1}
                  max={365}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Invites will expire in {expiresInDays} day{expiresInDays !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Member Selection Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Members ({selectedMembers.size} of {members.length})
                </h3>
                <Button
                  onClick={handleSelectAll}
                  variant="ghost"
                  className="text-sm text-primary hover:text-primary-dark font-medium w-fit"
                >
                  {selectedMembers.size === members.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {members.map((member) => {
                  const isSelected = selectedMembers.has(member.user._id);
                  return (
                    <div
                      key={member._id}
                      onClick={() => handleToggleMember(member.user._id)}
                      className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900">{member.user.name}</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{member.user.email}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-3">Invitation Summary</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• {selectedMembers.size} member{selectedMembers.size !== 1 ? 's' : ''} will receive invitations</li>
                <li>• Each member will complete {numberOfInterviews} interview{numberOfInterviews > 1 ? 's' : ''}</li>
                <li>• Time limit: {isCustomTimeLimit ? customTimeLimit : timeLimit} minutes per interview</li>
                <li>• Invites will expire in {expiresInDays} day{expiresInDays !== 1 ? 's' : ''}</li>
                <li>• Members will receive an email with a unique invitation link</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                onClick={() => navigate(`/cohorts/${id}`)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendInvites}
                loading={createBatchInvite.isPending}
                disabled={selectedMembers.size === 0}
                variant="primary"
                className="flex-1 flex items-center justify-center gap-2"
                startIcon={!createBatchInvite.isPending ? <Send className="w-5 h-5" /> : undefined}
              >
                {createBatchInvite.isPending
                  ? 'Sending Invites...'
                  : `Send ${selectedMembers.size} Invitation${selectedMembers.size !== 1 ? 's' : ''}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
