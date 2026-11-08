# Spike Monorepo

A full-stack monorepo managed with **[Turborepo](https://turbo.build/)** and **[pnpm workspaces](https://pnpm.io/workspaces)**.

---

## 📁 Repository Structure

```text
Spike/
├── apps/
│   ├── Spike/        # Mobile & Web client (React Native / Expo / Expo Router)
│   ├── admin/        # Admin web portal (Next.js 16, React 19, Tailwind CSS v4)
│   └── server/       # Backend REST API (NestJS 11, Express, Prisma)
│
├── packages/
│   ├── database/     # Prisma schema, migrations, and database client (@spike/database)
│   └── shared/       # Shared TypeScript types, DTOs, and Zod schemas (@spike/shared)
│
├── package.json      # Monorepo root configuration & scripts
├── pnpm-workspace.yaml # Workspace definitions
└── turbo.json        # Turborepo task pipeline configuration
```

---

## 📦 Projects Overview

### Applications (`apps/`)

| App | Package Name | Tech Stack | Description |
| :--- | :--- | :--- | :--- |
| **Spike** (`apps/Spike`) | `spike` | Expo (SDK 58), React Native 0.88, Expo Router, React 19 | Cross-platform mobile (iOS & Android) and web application. |
| **Admin** (`apps/admin`) | `admin` | Next.js 16, React 19, Tailwind CSS v4 | Administrative web dashboard and back-office management. |
| **Server** (`apps/server`) | `server` | NestJS 11, TypeScript, Prisma, Express | Core backend API server providing REST endpoints and business logic. |

### Shared Packages (`packages/`)

| Package | Package Name | Tech Stack | Description |
| :--- | :--- | :--- | :--- |
| **Database** (`packages/database`) | `@spike/database` | Prisma ORM 6, PostgreSQL | Centralized database layer with Prisma schema, generated client, and migrations. |
| **Shared** (`packages/shared`) | `@spike/shared` | TypeScript, Zod | Shared validation schemas, DTOs, and common types used across services. |

---

## 🛠️ Prerequisites

- **Node.js**: `v20.x` or higher (LTS recommended)
- **pnpm**: `v12.x` (specified in `packageManager`: `pnpm@12.4.2`)
  ```bash
  corepack enable
  corepack prepare pnpm@12.4.2 --activate
  ```
- **PostgreSQL**: A running PostgreSQL instance for `@spike/database`
- **Mobile Tooling** *(optional, for running `apps/Spike` on emulators)*:
  - Xcode (for iOS simulator, macOS only)
  - Android Studio & SDK (for Android emulator)
  - [Expo Go](https://expo.dev/go) app on physical device

---

## 🚀 Getting Started

### 1. Install Dependencies

From the repository root:

```bash
pnpm install
```

### 2. Configure Environment Variables & Database

1. Configure database connection inside `packages/database/.env`:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/spike?schema=public"
   ```
2. Generate the Prisma client:
   ```bash
   pnpm --filter @spike/database generate
   ```

---

## ▶️ Starting Projects from the Root

You can start all services in parallel using Turborepo, or start any individual project directly from the root using `--filter`.

### Start All Projects Concurrently

Run development mode across all applications (`Spike`, `admin`, `server`):

```bash
pnpm dev
```
*(Runs `turbo run dev`)*

> [!NOTE]
> By default, both Next.js (`admin`) and NestJS (`server`) may attempt to bind to port `3000`. Set `PORT=3001` (or another port) in `apps/server` environment variables or scripts to avoid port conflicts when running concurrently.

---

### Start Individual Projects from Root

#### 1. Mobile & Web App (`apps/Spike`)

```bash
# Start Expo development server (interactive terminal)
pnpm --filter spike dev

# Open directly in iOS Simulator (macOS only)
pnpm --filter spike ios

# Open directly in Android Emulator
pnpm --filter spike android

# Open in Web browser
pnpm --filter spike web
```

#### 2. Backend Server (`apps/server`)

```bash
# Start NestJS in watch/dev mode
pnpm --filter server dev

# Start NestJS in debug watch mode
pnpm --filter server start:debug

# Run tests
pnpm --filter server test
```

#### 3. Admin Web Portal (`apps/admin`)

```bash
# Start Next.js dev server with Turbopack
pnpm --filter admin dev

# Build and start production bundle
pnpm --filter admin build
pnpm --filter admin start
```

---

### Database Commands from Root

Execute Prisma CLI actions on `packages/database` directly from root:

```bash
# Generate Prisma Client
pnpm --filter @spike/database generate

# Push schema changes directly to the database
pnpm --filter @spike/database exec prisma db push

# Run migrations in development
pnpm --filter @spike/database exec prisma migrate dev

# Open Prisma Studio GUI
pnpm --filter @spike/database exec prisma studio
```

---

## 🏗️ Building for Production

Build all projects with Turborepo caching:

```bash
pnpm build
```

Or build a specific project:

```bash
pnpm --filter admin build
pnpm --filter server build
```

