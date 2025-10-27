import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackend } from '../contexts/AuthContext';
import { Plus, Search, Users, TrendingUp, Calendar, MoreVertical } from 'lucide-react';
import { Header } from '../components/Header';

interface CohortSummary {
  id: string;
  name: string;
  description: string | null;
  tags: any;
  stats: {
    invited: number;
    joined: number;
    started: number;
    completed: number;
  };
  lastActivity: Date | null;
}

export function CohortsPage() {
  const navigate = useNavigate();
  const backend = useBackend();
  const [cohorts, setCohorts] = useState<CohortSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCohorts();
  }, []);

  const loadCohorts = async () => {
    try {
      const response = await backend.cohorts.list();
      setCohorts(response.cohorts);
    } catch (err) {
      console.error('Failed to load cohorts:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCohorts = cohorts.filter((cohort) =>
    cohort.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    JSON.stringify(cohort.tags).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateProgress = (stats: CohortSummary['stats']) => {
    if (stats.invited === 0) return 0;
    return (stats.joined / stats.invited) * 100;
  };

  const formatLastActivity = (date: Date | null) => {
    if (!date) return 'No activity';
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--surface-hover)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cohorts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface-hover)]">
      <Header activeTab="cohorts" onTabChange={(tab) => {
        if (tab === 'overview') navigate('/cohorts');
        if (tab === 'students') navigate('/students');
        if (tab === 'reports') navigate('/reports');
      }} />
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cohorts</h1>
            <p className="text-gray-600">Manage and track your student cohorts</p>
          </div>
          <button
            onClick={() => navigate('/cohorts/new')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Cohort
          </button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or tag..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {filteredCohorts.length === 0 && !searchQuery && (
          <div className="text-center py-16">
            <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No cohorts yet</h3>
            <p className="text-gray-600 mb-6">Create your first cohort to get started</p>
            <button
              onClick={() => navigate('/cohorts/new')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Your First Cohort
            </button>
          </div>
        )}

        {filteredCohorts.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <Search className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCohorts.map((cohort) => (
            <div
              key={cohort.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate(`/cohorts/${cohort.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{cohort.name}</h3>
                  {cohort.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{cohort.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {cohort.tags?.term && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        {cohort.tags.term}
                      </span>
                    )}
                    {cohort.tags?.program && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                        {cohort.tags.program}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-400">{cohort.stats.invited}</div>
                  <div className="text-xs text-gray-500">Invited</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{cohort.stats.joined}</div>
                  <div className="text-xs text-gray-500">Joined</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{cohort.stats.started}</div>
                  <div className="text-xs text-gray-500">Started</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{cohort.stats.completed}</div>
                  <div className="text-xs text-gray-500">Done</div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(calculateProgress(cohort.stats))}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                    style={{ width: `${calculateProgress(cohort.stats)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{formatLastActivity(cohort.lastActivity)}</span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
