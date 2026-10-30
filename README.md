# SJify — Open Web Scraping & Containerized Automation Platform

> **SJify** is an enterprise-grade web-scraping and cloud automation platform where users develop, run, schedule, publish, and monetize containerized automation programs ("Actors"). Built with public documentation, public UI patterns, and open-source libraries.

---

## 🌟 Core Architecture & Capabilities

- **Monorepo**: Turborepo + pnpm workspaces with TypeScript everywhere.
- **Web Console & Store**: Next.js 14 App Router, Tailwind CSS dark-first theme (deep slate, glowing cyan/teal accents), glassmorphic panels, Lucide icons.
- **API & Execution Gateway**: Node.js + Fastify, Zod validation, auto-generated OpenAPI Swagger documentation at `/docs`, WebSocket streaming for real-time logs.
- **Persistence & Storage**: PostgreSQL (Prisma ORM with 28 tables), Redis 7 (BullMQ distributed job queues), MinIO S3-compatible object storage.
- **Actor Engine**: Docker Engine API (`dockerode`) runner on Windows named pipe `//./pipe/docker_engine` with CPU/RAM cgroups limits, timeout watchdog, and full state machine (`metamorph`, `reboot`, `resurrect`).
- **AI Agent Integration**: Streamable-HTTP Model Context Protocol (`/mcp`) server endpoint for direct tool calling by LLMs and AI agents.

---

## 🚀 Quickstart for Windows

### Prerequisites
- **Node.js**: v20+ or v24+
- **pnpm**: v9+ / v12+ (`corepack enable` or `npm i -g pnpm`)
- **Docker Desktop for Windows** (WSL2 backend recommended)

### 1. Clone & Install Dependencies
```powershell
git clone <repo-url> sjify
cd sjify
pnpm install
```

### 2. Start Infrastructure Containers (Postgres, Redis, MinIO)
Run the automated PowerShell helper:
```powershell
.\scripts\dev-up.ps1
```
Or start via Docker Compose directly:
```powershell
docker compose -f docker/docker-compose.yml up -d
```
*(Note: Local development can also run directly with SQLite fallback using `file:./dev.db`)*

### 3. Initialize Database & Seed Demo Data
```powershell
cd apps/api
pnpm db:push
pnpm db:seed
cd ../..
```

### 4. Start Development Servers (Web + API)
```powershell
pnpm dev
```
- **Web Console & Store**: [http://localhost:3000](http://localhost:3000)
- **Fastify API Server**: [http://localhost:4000](http://localhost:4000)
- **Interactive OpenAPI Documentation**: [http://localhost:4000/docs](http://localhost:4000/docs)
- **Streamable MCP Server Endpoint**: [http://localhost:4000/mcp](http://localhost:4000/mcp)
- **MinIO Console**: [http://localhost:9001](http://localhost:9001) (`sjify_minio_admin` / `sjify_minio_password`)

---

## 📂 Repository Structure

```
sjify/
├── apps/
│   ├── web/                     # Next.js 14 App Router Web Console & Store
│   ├── api/                     # Fastify REST API, WebSockets, Prisma, OpenAPI
│   └── desktop/                 # Electron Desktop wrapper (Phase 8)
├── packages/
│   ├── shared/                  # Common TypeScript interfaces, Zod schemas, constants
│   ├── sdk-js/                  # @sjify/actor-sdk for Node.js / Crawlee Actors
│   ├── sdk-python/              # sjify Python SDK
│   ├── cli/                     # @sjify/cli executable
│   └── anti-blocking/           # Fingerprint evasion & stealth toolkit
├── docker/
│   └── docker-compose.yml       # Postgres, Redis, MinIO, MailHog
├── scripts/
│   └── dev-up.ps1               # Windows PowerShell startup script
└── PLAN.md                      # Master architecture blueprint & roadmap
```

---

## 🔐 Demo Credentials
- **Admin**: `admin@sjify.io` / `sjifyAdmin2026!`
- **Developer**: `developer@sjify.io` / `sjifyAdmin2026!`
- **Sample API Token**: `sjify_api_dev_token_secret_1234567890abcdef`
