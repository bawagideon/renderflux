# RenderFlux

RenderFlux is a high-performance, serverless PDF generation API built with Node.js, Playwright, and BullMQ. It is designed to be faster, cheaper, and more scalable than existing solutions.

## 🚀 Features

-   **Serverless Architecture**: Optimized for AWS Lambda / Google Cloud Run.
-   **"Warm Pool" Browser**: Keeps a Playwright instance ready to eliminate cold start latency.
-   **Queue-Based Processing**: Uses Redis (BullMQ) for robust, non-blocking job handling.
-   **"Compile-Once, Render-Many"**: Handlebars-based templating system.
-   **Live Playground**: Next.js dashboard with Monaco Editor for real-time template preview.
-   **Mock Queue Mode**: File-based queue for local development without Redis.

## 🛠️ Tech Stack

-   **Monorepo**: TurboRepo + PNPM
-   **Runtime**: Node.js (TypeScript)
-   **Browser Engine**: Microsoft Playwright (Chromium)
-   **Queue**: Redis (BullMQ) / Mock (File-based)
-   **Storage**: Cloudflare R2 (S3 Compatible)
-   **Frontend**: Next.js, Tailwind CSS, ShadCN UI

## 📂 Project Structure

-   `apps/api`: Express.js API for queuing jobs and managing templates.
-   `apps/worker`: Background worker that processes PDF generation jobs.
-   `apps/web`: Developer dashboard and playground.
-   `packages/config`: Shared configuration.
-   `packages/types`: Shared TypeScript definitions.

## ⚡ Getting Started

### Prerequisites

-   Node.js 18+
-   PNPM (`npm i -g pnpm`)
-   Redis (Optional, for production/full mode)

### Installation

```bash
pnpm install
```

### Running Locally (Mock Mode)

RenderFlux includes a **Mock Queue** for testing without Redis.

1.  **Configure Environment**:
    Ensure the root `.env` file has:
    ```env
    USE_MOCK_QUEUE=true
    PORT=3001
    ```

2.  **Start the Stack**:
    ```bash
    pnpm dev
    ```

3.  **Access the Dashboard**:
    Open [http://localhost:3000](http://localhost:3000)

### Running with Redis (Production Mode)

1.  Set `USE_MOCK_QUEUE=false` in `.env`.
2.  Set `REDIS_URL` (default: `redis://localhost:6379`).
3.  Start Redis: `redis-server`.
4.  Run `pnpm dev`.

## 🧪 Testing

To verify the setup:
1.  Go to the Dashboard.
2.  Click **"Force Render"**.
3.  The request will be queued, processed by the worker, and the PDF preview will appear.

## 📦 Deployment

### Docker

The `apps/worker` includes an optimized `Dockerfile` for Playwright.

```bash
docker build -f apps/worker/Dockerfile -t renderflux-worker .
```

## 📄 License

MIT
