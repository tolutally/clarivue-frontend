export interface BaseMetric {
  label: string;
  value: number | string;
}

export interface TrendMetric extends BaseMetric {
  type: 'trend';
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

export interface SimpleMetric extends BaseMetric {
  type: 'simple';
}

export interface ProgressMetric extends BaseMetric {
  type: 'progress';
  max: number;
  percentage: number;
}

export type ReportMetric = TrendMetric | SimpleMetric | ProgressMetric;

export interface ChartDataPoint {
  label: string;
  value: number;
  category?: string;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  label?: string;
}

export interface SkillGapData {
  skill: string;
  current: number;
  required: number;
  gap: number;
  priority: 'high' | 'medium' | 'low';
}

export interface CohortOutcome {
  cohortName: string;
  totalStudents: number;
  avgReadiness: number;
  placementRate: number;
  avgTimeToPlacement: number;
}

export interface ReadinessTrendData {
  timeline: TimeSeriesPoint[];
  byProgram: ChartDataPoint[];
  distribution: ChartDataPoint[];
}
