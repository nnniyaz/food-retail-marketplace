cat > README.md <<'EOF'
# Food Retail Monorepo

A single repository for all applications in the Food Retail project.

## Repository Structure
apps/
ardo-backend/ # Go backend (REST API, MongoDB)
ardo-landing/ # Marketing/landing site (frontend)
ardo-marketplace/ # Customer-facing web app (frontend)
ardo-staff-frontend/ # Internal/admin web app (frontend)

bash
Copy code

## Requirements
- Go ≥ 1.22 (for `apps/ardo-backend`)
- Node.js ≥ 18 (for frontend apps)
- npm / pnpm / yarn (pick one package manager and keep it consistent)
- Docker (optional, for local infra)  
- MongoDB (used by the backend)

## Quick Start

### Backend
```bash
cd apps/ardo-backend
go mod download
# copy and fill envs if you keep an example file
# cp .env.example .env
go run ./cmd/api
Marketplace frontend (example)
bash
Copy code
cd apps/ardo-marketplace
npm install
npm run dev
Apply similar steps for apps/ardo-landing and apps/ardo-staff-frontend.

Development Conventions
Branches: main is stable. Use feat/*, fix/*, chore/* for work branches.

Commits: follow Conventional Commits (feat:, fix:, chore:, etc.).

PRs: small, focused PRs with a clear description; link issues if applicable.

Per-app docs: keep additional setup notes inside each app’s own README.

Notes on History
Project history from multiple repositories was preserved by importing each codebase into its subfolder. You can inspect per-app history with:

bash
Copy code
git log -- apps/<app-name>