import type { NavigateFunction } from 'react-router-dom';

const dashboardTabRoutes: Record<string, string> = {
  overview: '/overview',
  cohorts: '/cohorts',
  students: '/students',
  advisors: '/advisors',
  reports: '/reports',
};

export function navigateFromDashboardTab(navigate: NavigateFunction, tab: string) {
  const route = dashboardTabRoutes[tab];
  if (route) {
    navigate(route);
  }
}
