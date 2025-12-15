# apps/api/Dockerfile
# USE PLAYWRIGHT IMAGE (Has Node + Chrome + Dependencies)
FROM mcr.microsoft.com/playwright:v1.57.0-jammy

WORKDIR /app

# Install PNPM
RUN npm install -g pnpm

# Copy Root Configs
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages

# Copy API Source
COPY apps/api ./apps/api

# Install Dependencies (Root + API)
RUN pnpm install --frozen-lockfile

# Build API
RUN pnpm --filter api build

# Expose Port
EXPOSE 3001

# Start the Monolith (API + Worker inside)
CMD ["node", "apps/api/dist/index.js"]