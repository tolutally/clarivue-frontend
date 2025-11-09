/**
 * StudentRoute
 * 
 * Route wrapper for student-facing interview flow.
 * Unlike PublicRoute, this doesn't redirect based on admin authentication status.
 * Students should be able to access interview pages regardless of admin login status.
 */
export function StudentRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}