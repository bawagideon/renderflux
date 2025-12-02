# Base image with Playwright pre-installed
FROM mcr.microsoft.com/playwright:v1.41.0-jammy

# Set working directory
WORKDIR /app

# Install pnpm
npm install -g pnpm

# Copy root package.json and lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy source code
COPY apps/worker ./apps/worker
COPY packages ./packages

# Install dependencies (frozen lockfile for speed)
RUN pnpm install --frozen-lockfile

# Build the worker
RUN pnpm --filter worker build

# Expose port (if needed, though worker is usually background)
EXPOSE 3000

# Command to run the worker
CMD ["node", "apps/worker/dist/index.js"]
