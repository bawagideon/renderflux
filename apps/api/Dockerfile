# apps/api/Dockerfile
# Use Node 20 Alpine (Lighter and faster for API)
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy root configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy shared packages
COPY packages ./packages

# Copy the API source code
COPY apps/api ./apps/api

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the API
RUN pnpm --filter api build

# Expose the API port
EXPOSE 3001

# Start the API server
CMD ["node", "apps/api/dist/index.js"]