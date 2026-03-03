import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Users, Calendar, MoreVertical, ChevronDown, Building2, Edit, Trash2 } from 'lucide-react';
import { Header } from '../components/Header';
import { Button } from '@/components/ui/button';
import { useCohorts, useDeleteCohort } from '@/hooks/useCohorts';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/toast';
import { backgrounds, borders, semantic, semanticTokens } from '@/utils/colors';
import { navigateFromDashboardTab } from '@/utils/dashboardTabNavigation';

export function CohortsPage() {
  const navigate = useNavigate();
  const { admin, loading: adminLoading } = useAuth();
  const toast = useToast();
  const deleteCohort = useDeleteCohort();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef<HTMLDivElement>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Get staff companies
  const staffCompanies = admin?.user?.companies?.staff_companies || [];
  
  // Set first company as default when admin data loads
  useEffect(() => {
    if (staffCompanies.length > 0 && !selectedCompanyId) {
      setSelectedCompanyId(staffCompanies[0]._id);
    }
  }, [staffCompanies, selectedCompanyId]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setCompanyDropdownOpen(false);
      }
      
      // Close menu dropdowns
      Object.entries(menuRefs.current).forEach(([id, ref]) => {
        if (ref && !ref.contains(event.target as Node)) {
          setOpenMenuId(null);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteCohort = async (cohortId: string) => {
    try {
      await deleteCohort.mutateAsync(cohortId);
      toast.success('Cohort deleted', 'The cohort has been successfully deleted');
      setDeleteConfirmId(null);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error?.detail || err?.message || 'Failed to delete cohort';
      toast.error('Failed to delete cohort', errorMsg);
    }
  };

  const { data: cohortsData, isLoading: cohortsLoading } = useCohorts({
    search: searchQuery || undefined,
    company_id: selectedCompanyId || undefined,
    sort_by: 'updated_at',
    sort_order: 'desc',
    page: 1,
    page_size: 20,
  });

  const cohorts = cohortsData?.items || [];

  const formatLastActivity = (dateString: string) => {
    if (!dateString) return 'No activity';
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  // Show loading state if cohorts are loading or admin data is loading (for company dropdown)
  const loading = cohortsLoading;

  if (loading) {
    return (
      <div className={`min-h-screen ${semantic.surfaceActive} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`w-12 h-12 border-4 ${borders.primary} border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
          <p className="text-gray-600">Loading cohorts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${semantic.surfaceActive}`}>
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
      <Header activeTab="cohorts" onTabChange={(tab) => navigateFromDashboardTab(navigate, tab)} />
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex gap-5 flex-wrap items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cohorts</h1>
            <p className="text-gray-600">Manage and track your student cohorts</p>
          </div>
          <Button
            onClick={() => navigate('/cohorts/new')}
            variant="primary"
            size="lg"
            startIcon={<Plus className="w-5 h-5" />}
          >
            New Cohort
          </Button>
        </div>

        <div className="mb-6 flex gap-4 items-end">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md bg-white">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or tag..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Company Filter */}
          {staffCompanies.length > 0 && (
            <div className="relative" ref={companyDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Company
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
                  className="w-full min-w-[200px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-left flex items-center justify-between bg-white"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className={selectedCompanyId ? 'text-gray-900' : 'text-gray-500'}>
                      {selectedCompanyId
                        ? staffCompanies.find(c => c._id === selectedCompanyId)?.name || 'Select company...'
                        : 'All Companies'}
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${companyDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {companyDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCompanyId('');
                          setCompanyDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          !selectedCompanyId ? 'bg-primary/10 text-primary' : ''
                        }`}
                      >
                        All Companies
                      </button>
                      {staffCompanies.map((company) => (
                        <button
                          key={company._id}
                          type="button"
                          onClick={() => {
                            setSelectedCompanyId(company._id);
                            setCompanyDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                            selectedCompanyId === company._id ? 'bg-primary/10 text-primary' : ''
                          }`}
                        >
                          {company.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {cohorts.length === 0 && !loading && !searchQuery && (
          <div className="text-center py-16">
            <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No cohorts yet</h3>
            <p className="text-gray-600 mb-6">Create your first cohort to get started</p>
            <Button
              onClick={() => navigate('/cohorts/new')}
              variant="primary"
              size="lg"
              startIcon={<Plus className="w-5 h-5" />}
            >
              Create Your First Cohort
            </Button>
          </div>
        )}

        {cohorts.length === 0 && !loading && searchQuery && (
          <div className="text-center py-16">
            <Search className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cohorts.map((cohort) => {
            const invited = cohort.session_invite_count;
            const joined = cohort.member_count;            
            return (
              <div
                key={cohort._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate(`/cohorts/${cohort._id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{cohort.name}</h3>
                    {cohort.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{cohort.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {cohort.term?.name && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                          {cohort.term.name}
                        </span>
                      )}
                      {cohort.program?.name && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                          {cohort.program.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div 
                    className="relative"
                    ref={(el) => {
                      if (el) menuRefs.current[cohort._id] = el;
                    }}
                  >
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === cohort._id ? null : cohort._id);
                      }}
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-gray-600 p-1"
                      aria-label="Cohort options"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                    
                    {openMenuId === cohort._id && (
                      <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/cohorts/${cohort._id}/edit`);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Update
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(cohort._id);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-7 mb-4">
                  <div>
                    <div className="text-2xl font-bold text-gray-400">{invited}</div>
                    <div className="text-xs text-gray-500">Invited</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{joined}</div>
                    <div className="text-xs text-gray-500">Members</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatLastActivity(cohort.updated_at)}</span>
                  </div>
                  <Button variant="link" className="text-primary hover:text-primary-dark font-medium px-0">
                    View
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 z-[9998] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Cohort</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this cohort? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setDeleteConfirmId(null)}
                variant="outline"
                disabled={deleteCohort.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteCohort(deleteConfirmId)}
                variant="primary"
                loading={deleteCohort.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
