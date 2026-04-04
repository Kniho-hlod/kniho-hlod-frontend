# kniho-hlod-frontend

Vue 3 SPA frontend for the **kniho-hlod** book lending application.

## Tech Stack

- **Framework:** Vue 3 (Composition API) + Vite
- **State management:** Pinia
- **UI components:** PrimeVue 4 + TailwindCSS
- **Routing:** Vue Router 4
- **Auth:** JWT (stored in localStorage)
- **i18n:** vue-i18n (Czech + English)
- **Deployment:** GitHub Pages (via GitHub Actions)

## Architecture

Feature-based structure under `src/features/`. Each feature (books, loans, users, account, overview) contains its own store, form/table definitions, and components.

```
src/
├── main.ts                        # App bootstrap — configureServices(), PrimeVue, Pinia
├── features/                      # Domain features
│   ├── books/                     # Book management
│   ├── loans/                     # Loan management
│   ├── users/                     # User management (admin)
│   ├── account/                   # User profile & settings
│   └── overview/                  # Dashboard
├── stores/
│   ├── entity-store.ts            # Generic Pinia store factory for all entities
│   └── authorization-store.ts     # Auth state, login/logout, token management
├── router/                        # Vue Router + auth guards
├── shared/                        # Reusable composables and UI components
└── i18n/                          # Czech and English translations
```

### Key patterns

- **`entity-store.ts`** — generic Pinia store factory; all entity stores (books, loans, users, files) wrap their respective service classes with a shared Map cache
- **`authorization-store`** — manages JWT state, login/logout, token expiration via `use-token-manager`; sets `isAuthInitialized` after login to prevent duplicate entity fetches on route navigation
- **Router guards** — enforce authentication and admin role checks; call `initializeAuth()` only when not yet initialized
- **Form/table definitions** — declarative configs for PrimeVue-based UI
- **`use-pagination.ts`** — generic client-side pagination composable used in BooksTab and LoansTab
- **Notifications** — `/home/notifications` shows overdue loans and upcoming returns (within 7 days); nav badge shows overdue count

## Environment Variables

| Variable           | Required | Description                         |
| ------------------ | -------- | ----------------------------------- |
| `VITE_BACKEND_URL` | Yes      | Backend API base URL                |

Create a `.env.local` for local development:
```
VITE_BACKEND_URL=http://localhost:3000
```

Production URL is set via the hosting platform environment variables.

## Commands

```bash
npm install
npm run dev          # Vite dev server
npm run build        # Type-check + production build
npm run type-check   # vue-tsc --build --force
npm run lint         # ESLint fix
npm run format       # Prettier write
npm run service-update  # Pull latest @eleansphere/kniho-hlod-service
```

## Deployment

Pushes to `main` trigger the GitHub Actions workflow, which builds the app and deploys to GitHub Pages.

Required GitHub repository secrets:

- `NODE_AUTH_TOKEN` — GitHub PAT with `read:packages` for `@eleansphere` and `@kniho-hlod` registries
- `DEPLOY_TOKEN` — GitHub PAT for pushing to the Pages branch
