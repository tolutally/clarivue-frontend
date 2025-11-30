# Build stage
FROM node:20-alpine AS builder

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build arguments for Vite environment variables
ARG VITE_API_URL
ARG VITE_USE_MOCK_API=false

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_USE_MOCK_API=$VITE_USE_MOCK_API

# Build the app
RUN pnpm run build

# Production stage
FROM node:20-alpine

# Install serve globally
RUN npm install -g serve

# Copy built assets from builder
COPY --from=builder /app/dist /app

EXPOSE 3000

CMD ["serve", "-s", "/app", "-l", "3000"]
