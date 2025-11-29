# Services Architecture

This directory contains all API service layers organized by domain. The services use Axios for HTTP requests and are designed to work seamlessly with React Query.

## Structure

```
services/
├── api/
│   ├── client.ts          # Axios instance with base URL and interceptors
│   └── types.ts           # Common API response types
├── auth/
│   └── auth.service.ts    # Authentication endpoints
├── cohorts/
│   └── cohorts.service.ts # Cohort management endpoints
├── students/
│   └── students.service.ts # Student management endpoints
├── interviews/
│   └── interviews.service.ts # Interview flow endpoints
├── mockinterviews/
│   └── mockinterviews.service.ts # Mock interview endpoints
├── analysis/
│   └── analysis.service.ts # Analysis endpoints
├── skills/
│   └── skills.service.ts  # Skills detection endpoints
└── index.ts               # Central export point
```

## API Client Configuration

The Axios client is configured in `services/api/client.ts` with:
- **Base URL**: `https://api.clarivue.io/`
- **Automatic token injection**: Adds Bearer token from localStorage
- **Error handling**: Intercepts 401 errors and redirects to login
- **Request/Response interceptors**: Handle common patterns

## Usage

### Direct Service Usage

```typescript
import { authService } from '@/services';

// Login
const response = await authService.login({ email, password });
localStorage.setItem('auth_token', response.token);
```

### With React Query Hooks

```typescript
import { useCohorts, useCreateCohort } from '@/hooks';

function MyComponent() {
  const { data: cohorts, isLoading } = useCohorts();
  const createCohort = useCreateCohort();
  
  const handleCreate = async () => {
    await createCohort.mutateAsync({
      name: 'New Cohort',
      description: 'Description here'
    });
  };
  
  // ...
}
```

## Adding New Services

1. Create a new service file in the appropriate domain folder
2. Import and use the `apiClient` from `services/api/client.ts`
3. Export the service instance from `services/index.ts`
4. Create corresponding React Query hooks in `hooks/` directory

### Example

```typescript
// services/reports/reports.service.ts
import apiClient from '../api/client';

class ReportsService {
  async getReport(id: string) {
    const response = await apiClient.get(`/reports/${id}`);
    return response.data;
  }
}

export const reportsService = new ReportsService();
```

## Error Handling

All services use the centralized error handling from the Axios interceptor:
- Network errors are caught and formatted
- 401 errors automatically clear tokens and redirect
- Error messages are extracted from API responses

## Type Safety

All service methods are fully typed. Import types from services:

```typescript
import type { LoginRequest, LoginResponse } from '@/services';
```

