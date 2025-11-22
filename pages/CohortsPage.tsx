import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Users, Calendar, MoreVertical } from 'lucide-react';
import { Header } from '../components/Header';
import { Button } from '@/components/ui/button';
import { useCohorts } from '@/hooks/useCohorts';
import { useAuth } from '@/contexts/AuthContext';
import { backgrounds, borders, semantic, semanticTokens } from '@/utils/colors';

export function CohortsPage() {
  const navigate = useNavigate();
  const { admin, loading: adminLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: cohortsData, isLoading: cohortsLoading } = useCohorts({
    search: searchQuery || undefined,
    sort_by: 'updated_at',
    sort_order: 'desc',
    page: 1,
    page_size: 20,
  });

  // Filter cohorts based on user role and company membership
  const cohorts = useMemo(() => {
    const allCohorts = cohortsData?.items || [];
    
    // If admin data is still loading, return empty array (will show loading state)
    if (adminLoading || !admin?.user) {
      return [];
    }

    const user = admin.user;
    const userType = user.role?.user_type;
    const userId = user._id;

    // Platform Super Admin (user_type === "admin") can see all cohorts
    if (userType === 'super_admin') {
      return allCohorts;
    }

    // For Company Administrators and Regular Users, filter cohorts:
    // 1. Cohorts in their primary company (if they have one)
    // 2. Cohorts in companies they're staff/admins of (staff_companies)
    // 3. Cohorts in companies they're members of (cohort_companies)
    // 4. Cohorts they created (created_by matches their user ID)

    const allowedCompanyIds = new Set<string>();
    
    // Add primary company if exists
    if (user.company) {
      allowedCompanyIds.add(user.company);
    }

    // Add companies from staff_companies
    if (user.companies?.staff_companies) {
      user.companies.staff_companies.forEach((company) => {
        allowedCompanyIds.add(company._id);
      });
    }

    // Add companies from cohort_companies
    if (user.companies?.cohort_companies) {
      user.companies.cohort_companies.forEach((company) => {
        allowedCompanyIds.add(company._id);
      });
    }

    // Filter cohorts based on company membership or creation
    return allCohorts.filter((cohort) => {
      // Show if cohort is in an allowed company
      if (cohort.company && allowedCompanyIds.has(cohort.company)) {
        return true;
      }

      // Show if user created the cohort
      if (cohort.created_by === userId) {
        return true;
      }

      return false;
    });
  }, [cohortsData?.items, admin?.user, adminLoading]);

  const calculateProgress = (invited: number, joined: number) => {
    if (invited === 0) return 0;
    return Math.min((joined / invited) * 100, 100);
  };

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

  // Show loading state if cohorts are loading or admin data is loading
  const loading = cohortsLoading || adminLoading;

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
      <Header activeTab="cohorts" onTabChange={(tab) => {
        if (tab === 'overview') navigate('/overview');
        if (tab === 'cohorts') navigate('/cohorts');
        if (tab === 'students') navigate('/students');
        if (tab === 'reports') navigate('/reports');
      }} />
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

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or tag..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
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
            const progress = calculateProgress(invited, joined);
            
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
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-gray-600 p-1"
                    aria-label="Cohort options"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-400">{invited}</div>
                    <div className="text-xs text-gray-500">Invited</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{joined}</div>
                    <div className="text-xs text-gray-500">Members</div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all rounded-full cohort-progress-bar ${progress === 0 ? 'bg-gray-300' : 'bg-primary'}`}
                      data-progress={progress}
                      style={{
                        width: `${progress}%`,
                      }}
                    ></div>
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
    </div>
  );
}
