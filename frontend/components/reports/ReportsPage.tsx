import { useState } from 'react';
import { semantic } from '../../utils/colors';
import { GlobalControls } from './GlobalControls';
import { CohortOutcomes } from './CohortOutcomes';
import { CapacityCoverage } from './CapacityCoverage';
import { SkillGapsMap } from './SkillGapsMap';
import { RolePackReadiness } from './RolePackReadiness';
import { InterventionImpact } from './InterventionImpact';
import { AutoInsightsPanel } from './AutoInsightsPanel';
import {
  getCohortData,
  mockCapacity,
  mockSkillGaps,
  mockRolePack,
  mockIntervention,
  autoInsights,
  type ReportFilters,
} from '../../data/reports-data';

const tabs = [
  { id: 'cohort', label: 'Cohort Outcomes' },
  { id: 'capacity', label: 'Capacity & Coverage' },
  { id: 'skills', label: 'Skill Gaps Map' },
  { id: 'roles', label: 'Role-Pack Readiness' },
  { id: 'intervention', label: 'Intervention Impact' },
];

export function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>({});
  const [activeTab, setActiveTab] = useState('cohort');
  const [selectedCohortA, setSelectedCohortA] = useState('fall-2025-coop');
  const [selectedCohortB, setSelectedCohortB] = useState('');

  const cohortAData = getCohortData(selectedCohortA);
  const cohortBData = selectedCohortB ? getCohortData(selectedCohortB) : undefined;

  const cohortNames: Record<string, string> = {
    'fall-2025-coop': 'Fall 2025 Co-op',
    'winter-2025-intern': 'Winter 2025 Intern',
    'spring-2025-fulltime': 'Spring 2025 Full-Time',
    'summer-2025-coop': 'Summer 2025 Co-op',
    'fall-2024-coop': 'Fall 2024 Co-op',
  };

  return (
    <div className={`min-h-screen ${semantic.bgSubtle}`}>
      <div className={`${semantic.surface} border-b ${semantic.borderMedium}`}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className={`text-3xl font-bold ${semantic.textPrimary}`}>Reports</h1>
            <div className={`text-sm ${semantic.textTertiary}`}>
              Student outcomes, capacity & program insights
            </div>
          </div>
          <p className={`text-sm ${semantic.textSecondary} max-w-3xl`}>
            Track student readiness, measure intervention effectiveness, and identify skill gaps to improve programs and placements.
          </p>
        </div>

        <GlobalControls 
          filters={filters} 
          onFiltersChange={setFilters}
          selectedCohortA={selectedCohortA}
          selectedCohortB={selectedCohortB}
          onCohortAChange={setSelectedCohortA}
          onCohortBChange={setSelectedCohortB}
        />

        <div className="px-6">
          <div className={`flex gap-1 border-b ${semantic.borderMedium}`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {activeTab === 'cohort' && (
                <CohortOutcomes 
                  data={cohortAData} 
                  compareData={cohortBData}
                  cohortAName={cohortNames[selectedCohortA]}
                  cohortBName={selectedCohortB ? cohortNames[selectedCohortB] : undefined}
                />
              )}
              {activeTab === 'capacity' && <CapacityCoverage data={mockCapacity} />}
              {activeTab === 'skills' && <SkillGapsMap data={mockSkillGaps} />}
              {activeTab === 'roles' && <RolePackReadiness data={mockRolePack} />}
              {activeTab === 'intervention' && <InterventionImpact data={mockIntervention} />}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <AutoInsightsPanel insights={autoInsights} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
