# API Integration Guide

## Overview

This application has been designed with a **flexible API architecture** that supports both:

- **Mock API** (default): For development without a backend
- **Real API**: For production with your actual backend

The app automatically switches between mock and real APIs based on environment variables, requiring **zero code changes** to deploy.

## Architecture

```
lib/
├── api-client.ts       # Main entry point (auto-switches between mock/real)
├── backend-types.ts    # TypeScript interfaces for type safety
├── mock-backend.ts     # Mock API implementation
└── real-backend.ts     # Real API implementation (ready to customize)
```

All application code imports from `@/lib/api-client`, which automatically provides the correct backend based on configuration.

## Current Status

✅ **Build Status**: Production build successful  
✅ **Dev Server**: Running on <http://localhost:5173>  
✅ **Mock API**: Fully functional with realistic data  
✅ **Real API**: Template ready, needs customization  
✅ **Type Safety**: Full TypeScript support  
✅ **Zero Config**: Works out of the box  

## Development Mode (Mock API)

By default, the app uses mock data. No backend server required!

```bash
# Start development server with mock API
bun run dev
```

The console will show:

```
🔌 API Client: Using MOCK backend
```

### What's Mocked?

- **Authentication**: Login, magic links, user sessions
- **Student Onboarding**: Complete interview preparation flow
- **Job Descriptions**: Sample JDs, parsing, metrics
- **Analysis**: Interview analysis, skill detection

## Production Mode (Real API)

### Step 1: Configure Environment

Create `.env.production.local`:

```env
VITE_USE_MOCK_API=false
VITE_API_URL=https://api.your-domain.com
```

### Step 2: Customize Real Backend

Edit `lib/real-backend.ts` to match your API endpoints:

```typescript
// Example: Update endpoint paths
export const realBackend: BackendClient = {
  auth: {
    login: async ({ email, password }) => {
      // Change '/auth/login' to match your API
      return apiFetch('/api/v1/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
    // ... update other methods
  },
  // ... update other services
};
```

### Step 3: Build and Deploy

```bash
# Build with real API
bun run build

# The build will use .env.production.local settings
```

The console will show:

```
🔌 API Client: Using REAL backend
📡 API URL: https://api.your-domain.com
```

## API Client Usage

### In Your Components

```typescript
import backend from '@/lib/api-client';

// Use it like any API client
const response = await backend.auth.login({ email, password });
```

### With Authentication

The API client automatically handles auth tokens:

```typescript
// In AuthContext, the token is stored
const { token } = useAuth();

// Use the authenticated backend
const authedBackend = backend.with({ 
  auth: { authorization: `Bearer ${token}` } 
});

// Make authenticated requests
const user = await authedBackend.auth.me();
```

## Environment Variables

### Available Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_USE_MOCK_API` | `true` | Set to `false` to use real API |
| `VITE_API_URL` | `http://localhost:4000` | Your backend API URL |

### Environment Files

- `.env.local` - Development (git-ignored)
- `.env.production.local` - Production (git-ignored)
- `.env.production.example` - Template for production

## Type Safety

All API responses are typed via `lib/backend-types.ts`:

```typescript
export interface BackendClient {
  auth: {
    login: (params: { email: string; password: string }) => Promise<{
      token: string;
      admin: AdminInfo;
    }>;
    // ... other methods
  };
  // ... other services
}
```

**Benefits:**

- ✅ Autocomplete in your IDE
- ✅ Compile-time error checking
- ✅ Consistent API contract
- ✅ Easy to update when API changes

## Testing Different Modes

### Test Mock API

```bash
# Uses mock by default
bun run dev
```

### Test Real API Locally

```bash
# Create .env.local
echo "VITE_USE_MOCK_API=false" > .env.local
echo "VITE_API_URL=http://localhost:4000" >> .env.local

# Start dev server
bun run dev
```

### Test Production Build

```bash
# Build for production
bun run build

# Preview the build
bun run preview
```

## Deployment

### Vercel / Netlify

Set environment variables in your hosting dashboard:

- `VITE_USE_MOCK_API=false`
- `VITE_API_URL=https://api.your-domain.com`

### Docker

```dockerfile
FROM oven/bun:1 as builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
ARG VITE_USE_MOCK_API=false
ARG VITE_API_URL
ENV VITE_USE_MOCK_API=$VITE_USE_MOCK_API
ENV VITE_API_URL=$VITE_API_URL
RUN bun run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### Static Hosting

For purely static hosting (GitHub Pages, S3, etc.), the app will continue using mock API unless you build with production env vars.

## Customization Guide

### Adding New API Endpoints

1. **Update Type Definitions** (`lib/backend-types.ts`):

```typescript
export interface BackendClient {
  // Add new service
  students: {
    list: () => Promise<Student[]>;
    get: (id: number) => Promise<Student>;
  };
}
```

2. **Implement Mock** (`lib/mock-backend.ts`):

```typescript
export const mockBackend: BackendClient = {
  // ...existing code
  students: {
    list: async () => {
      return [{ id: 1, name: 'Demo Student' }];
    },
    get: async (id) => {
      return { id, name: 'Demo Student' };
    },
  },
};
```

3. **Implement Real API** (`lib/real-backend.ts`):

```typescript
export const realBackend: BackendClient = {
  // ...existing code
  students: {
    list: async () => {
      return apiFetch('/students');
    },
    get: async (id) => {
      return apiFetch(`/students/${id}`);
    },
  },
};
```

4. **Use in Components**:

```typescript
import backend from '@/lib/api-client';

const students = await backend.students.list();
```

### Customizing Mock Data

Edit `lib/mock-backend.ts` to return more realistic data:

```typescript
getSampleJDs: async () => {
  return {
    samples: [
      {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        category: 'Engineering',
        // ... more fields
      },
      // Add more samples
    ],
  };
},
```

### Error Handling

The real backend automatically handles errors:

```typescript
// In your components
try {
  const response = await backend.auth.login({ email, password });
} catch (error) {
  console.error('Login failed:', error.message);
  // Show error to user
}
```

## Troubleshooting

### "Using MOCK backend" in Production

Check that:

1. `.env.production.local` has `VITE_USE_MOCK_API=false`
2. You're building with production env: `bun run build`
3. Environment variables are set in your hosting platform

### CORS Errors

Add CORS headers to your backend:

```javascript
// Express example
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
```

### TypeScript Errors

Run type checking:

```bash
bun run tsc --noEmit
```

### API Response Doesn't Match

Update the types in `lib/backend-types.ts` to match your actual API responses.

## Best Practices

1. **Always use `@/lib/api-client`** - Never import mock or real backend directly
2. **Keep types in sync** - Update `backend-types.ts` when API changes
3. **Test both modes** - Verify mock and real API work correctly
4. **Use environment variables** - Never hardcode API URLs
5. **Handle errors** - Always wrap API calls in try/catch

## Summary

✅ **Development**: Mock API works out of the box  
✅ **Production**: Set 2 env vars, customize `real-backend.ts`  
✅ **Type Safe**: Full TypeScript support  
✅ **Flexible**: Easy to switch between mock and real  
✅ **Maintainable**: Single import point for all API calls  

You can now:

- ✨ Develop without a backend
- 🚀 Deploy to production with real API
- 🔄 Switch between modes with env vars only
- 💪 Have full type safety throughout
