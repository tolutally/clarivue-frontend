import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Download, Mail, FileText, FileSpreadsheet, X } from 'lucide-react';
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
            <Select
              value={selectedCohortA || 'fall-2025-coop'}
              onValueChange={onCohortAChange}
            >
              <SelectTrigger className="w-[240px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cohorts.map((cohort) => (
                  <SelectItem key={cohort.value} value={cohort.value}>
                    {cohort.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <Select
                value={selectedCohortB || ''}
                onValueChange={onCohortBChange}
              >
                <SelectTrigger className="w-[240px] bg-white">
                  <SelectValue placeholder="Select cohort to compare" />
                </SelectTrigger>
                <SelectContent>
                  {cohorts.filter(c => c.value !== selectedCohortA).map((cohort) => (
                    <SelectItem key={cohort.value} value={cohort.value}>
                      {cohort.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <button
              onClick={() => handleCompareModeToggle(false)}
              className="p-1 hover:bg-white rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 flex flex-wrap items-center gap-3">
          <Select
            value={filters.term || 'all'}
            onValueChange={(value) => onFiltersChange({ ...filters, term: value === 'all' ? undefined : value })}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Term/Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Terms</SelectItem>
              <SelectItem value="fall-2025">Fall 2025</SelectItem>
              <SelectItem value="winter-2025">Winter 2025</SelectItem>
              <SelectItem value="spring-2025">Spring 2025</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.program || 'all'}
            onValueChange={(value) => onFiltersChange({ ...filters, program: value === 'all' ? undefined : value })}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Program/Major" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="arts">Arts</SelectItem>
              <SelectItem value="sciences">Sciences</SelectItem>
              <SelectItem value="nursing">Nursing</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.rolePack || 'all'}
            onValueChange={(value) => onFiltersChange({ ...filters, rolePack: value === 'all' ? undefined : value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Role Pack" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="software-engineer">Software Engineer</SelectItem>
              <SelectItem value="data-analyst">Data Analyst</SelectItem>
              <SelectItem value="bdr">BDR</SelectItem>
              <SelectItem value="project-coordinator">Project Coordinator</SelectItem>
              <SelectItem value="rn">RN</SelectItem>
            </SelectContent>
          </Select>



          <Select
            value={filters.classYear || 'all'}
            onValueChange={(value) => onFiltersChange({ ...filters, classYear: value === 'all' ? undefined : value })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Class Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2027">2027</SelectItem>
              <SelectItem value="2028">2028</SelectItem>
            </SelectContent>
          </Select>

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


        </div>

        <div className="relative">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowExportMenu(!showExportMenu)}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          {showExportMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm">
                <FileText className="w-4 h-4 text-red-600" />
                Export as PDF
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm">
                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                Export as CSV
              </button>
              <div className="border-t border-gray-200 my-2" />
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-blue-600" />
                Schedule Weekly Email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
