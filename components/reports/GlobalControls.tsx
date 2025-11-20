import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dropdown } from '@/components/ui/Dropdown';
import { Share2, Mail, FileText, FileSpreadsheet, X } from 'lucide-react';
import { semantic, text } from '../../utils/colors';
import type { ReportFilters } from '../../data/reports-data';

interface GlobalControlsProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  selectedCohortA?: string;
  selectedCohortB?: string;
  onCohortAChange: (cohort: string) => void;
  onCohortBChange: (cohort: string) => void;
}

export function GlobalControls({ filters, onFiltersChange, selectedCohortA, selectedCohortB, onCohortAChange, onCohortBChange }: GlobalControlsProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  const cohorts = [
    { value: 'fall-2025-coop', label: 'Fall 2025 Co-op' },
    { value: 'winter-2025-intern', label: 'Winter 2025 Intern' },
    { value: 'spring-2025-fulltime', label: 'Spring 2025 Full-Time' },
    { value: 'summer-2025-coop', label: 'Summer 2025 Co-op' },
    { value: 'fall-2024-coop', label: 'Fall 2024 Co-op' },
  ];

  const handleCompareModeToggle = (checked: boolean) => {
    setCompareMode(checked);
    if (!checked) {
      onCohortBChange('');
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#C8A0FE]/10 to-[#B8CCF4]/10 rounded-lg border border-[#C8A0FE]/30">
          <div className="flex items-center gap-2">
            <Label htmlFor="cohort-a" className={`text-sm font-semibold ${semantic.textPrimary}`}>
              Cohort A:
            </Label>
            <Dropdown
              value={selectedCohortA || 'fall-2025-coop'}
              onChange={onCohortAChange}
              options={cohorts}
              className="w-[240px]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border-2 border-[#102C64]/20">
          <Switch
            id="compare-toggle"
            checked={compareMode}
            onCheckedChange={handleCompareModeToggle}
          />
          <Label htmlFor="compare-toggle" className="text-sm font-medium cursor-pointer text-[#102C64]">
            Compare with Cohort B
          </Label>
        </div>

        {compareMode && (
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#FE686D]/10 to-[#FE686D]/5 rounded-lg border border-[#FE686D]/30">
            <div className="flex items-center gap-2">
              <Label htmlFor="cohort-b" className="text-sm font-semibold text-gray-900">
                Cohort B:
              </Label>
              <Dropdown
                value={selectedCohortB || ''}
                onChange={onCohortBChange}
                options={cohorts.filter(c => c.value !== selectedCohortA)}
                placeholder="Select cohort to compare"
                className="w-[240px]"
              />
            </div>
            <Button
              onClick={() => handleCompareModeToggle(false)}
              variant="ghost"
              size="icon"
              className="p-1 hover:bg-white rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 flex flex-wrap items-center gap-3">
          <Dropdown
            value={filters.term || 'all'}
            onChange={(value) => onFiltersChange({ ...filters, term: value === 'all' ? undefined : value })}
            options={[
              { value: 'all', label: 'All Terms' },
              { value: 'fall-2025', label: 'Fall 2025' },
              { value: 'winter-2025', label: 'Winter 2025' },
              { value: 'spring-2025', label: 'Spring 2025' },
            ]}
            placeholder="Term/Semester"
            className="w-[160px]"
          />

          <Dropdown
            value={filters.program || 'all'}
            onChange={(value) => onFiltersChange({ ...filters, program: value === 'all' ? undefined : value })}
            options={[
              { value: 'all', label: 'All Programs' },
              { value: 'business', label: 'Business' },
              { value: 'engineering', label: 'Engineering' },
              { value: 'arts', label: 'Arts' },
              { value: 'sciences', label: 'Sciences' },
              { value: 'nursing', label: 'Nursing' },
            ]}
            placeholder="Program/Major"
            className="w-[160px]"
          />

          <Dropdown
            value={filters.rolePack || 'all'}
            onChange={(value) => onFiltersChange({ ...filters, rolePack: value === 'all' ? undefined : value })}
            options={[
              { value: 'all', label: 'All Roles' },
              { value: 'software-engineer', label: 'Software Engineer' },
              { value: 'data-analyst', label: 'Data Analyst' },
              { value: 'bdr', label: 'BDR' },
              { value: 'project-coordinator', label: 'Project Coordinator' },
              { value: 'rn', label: 'RN' },
            ]}
            placeholder="Role Pack"
            className="w-[180px]"
          />

          <Dropdown
            value={filters.classYear || 'all'}
            onChange={(value) => onFiltersChange({ ...filters, classYear: value === 'all' ? undefined : value })}
            options={[
              { value: 'all', label: 'All Years' },
              { value: '2025', label: '2025' },
              { value: '2026', label: '2026' },
              { value: '2027', label: '2027' },
              { value: '2028', label: '2028' },
            ]}
            placeholder="Class Year"
            className="w-[140px]"
          />

          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
            <Switch
              id="first-gen"
              checked={filters.firstGen || false}
              onCheckedChange={(checked) => onFiltersChange({ ...filters, firstGen: checked })}
            />
            <Label htmlFor="first-gen" className="text-sm font-medium cursor-pointer">
              First-Gen Only
            </Label>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg border border-red-200">
            <Switch
              id="at-risk"
              checked={filters.atRisk || false}
              onCheckedChange={(checked) => onFiltersChange({ ...filters, atRisk: checked })}
            />
            <Label htmlFor="at-risk" className="text-sm font-medium cursor-pointer text-red-700">
              Students at Risk
            </Label>
          </div>
        </div>

        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowExportMenu(!showExportMenu)}
            startIcon={<Share2 className="w-4 h-4" />}
          >
            Share Results
          </Button>
          {showExportMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm"
                startIcon={<FileText className="w-4 h-4 text-red-600" />}
              >
                Share as PDF
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm"
                startIcon={<FileSpreadsheet className="w-4 h-4 text-green-600" />}
              >
                Share as CSV
              </Button>
              <div className="border-t border-gray-200 my-2" />
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm"
                startIcon={<Mail className="w-4 h-4 text-blue-600" />}
              >
                Schedule Weekly Email
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
