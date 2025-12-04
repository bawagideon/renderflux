# apps/worker/Dockerfile
# UPDATED: Using v1.57.0 to match your package.json
FROM mcr.microsoft.com/playwright:v1.57.0-jammy

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy root configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy packages and worker source
COPY packages ./packages
COPY apps/worker ./apps/worker

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the worker
RUN pnpm --filter worker build

# Run the worker
CMD ["node", "apps/worker/dist/index.js"]