# Repository Instructions

## Project Overview

This is a Nuxt 4 front-end for an event management application. It uses Vue 3, TypeScript, Nuxt layers, Pinia, TanStack Vue Query, vee-validate/zod, shadcn-vue, Tailwind CSS v4, and Playwright/Vitest for testing.

All application code lives under `layers/`. There is no root-level `app/` directory.

## Commands

- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
- Build: `pnpm build`
- Lint: `pnpm lint`
- Fix lint: `pnpm lint:fix`
- Run Vitest once: `pnpm test:run`
- Run Vitest watch mode: `pnpm test`
- Run Playwright: `pnpm test:e2e`

Use `pnpm`, not npm or yarn.

## Layer Structure

The root `nuxt.config.ts` currently extends:

- `layers/publics`
- `layers/shared`
- `layers/auth`
- `layers/users`
- `layers/events`
- `layers/orders`

Other layer folders can exist but are only active when added to the root `extends` array.

Layer responsibilities:

- `shared`: foundation layer with app shell, global CSS, UI components, fragments, table primitives, providers, utility functions, shared constants, shared composables, and root `app.vue`.
- `auth`: login/register, auth store, refresh/logout/login composables, auth middleware, permission guard, and permission directive.
- `users`: user table, user CRUD composables, role badge, and user page.
- `events`: event table, event CRUD/publish composables, event page, upload UI, and event table state.
- `orders`: order list, order details, payment return/status pages, and order query composables.
- `publics`: public event listing/detail and ticket purchase flow.
- `dashboard`: dashboard page and query composables. Add this layer to root `extends` before depending on its pages.
- `qr-code`: QR scanner/check-in flow. Add this layer to root `extends` before depending on its pages.
- `unauthorized`: unauthorized page. Add this layer to root `extends` before depending on it.

Every layer should keep feature-specific code inside that layer. Put only reusable UI, constants, types, and helpers in `layers/shared`.

## Imports And Aliases

- Nuxt auto-imports components and composables from active layers.
- Prefer existing auto-imported composables and components when used consistently nearby.
- Shared utilities are commonly imported with paths like `~/layers/shared/app/lib/utils`.
- API endpoints live in `layers/shared/app/common/const/endpoint.ts`.
- Page constants and public/auth route allowlists live in `layers/shared/app/common/const/pages.ts`.
- Permission constants live in `layers/shared/app/common/const/permission.ts`.

## API Pattern

Use `useHttp()` from `layers/shared/app/composable/useHttp.ts` for backend calls. It creates an `$fetch` client with:

- `baseURL` from `runtimeConfig.public.API_URL`
- `credentials: 'include'`
- one retry after a 401 response with message `Token Expired`, except for auth/public endpoints

Query/mutation composables generally return TanStack Vue Query objects and use shared endpoint constants.

## Auth And Permissions

- Global auth middleware redirects non-public pages to `/login` when there is no authenticated user.
- Route-level permission checks use the `authorization` middleware and route meta fields:
  - `requiresAuth`
  - `requiresPermissions`
  - `requireAll`
- UI-level permission checks use `PermissionGuard` or the `v-permission` directive.

When adding a protected page, define `definePageMeta` with `middleware: 'authorization'`, `requiresAuth: true`, and the required permissions from `PERMISSIONS`.

## UI Guidelines

- Use components from `layers/shared/app/components/ui` before introducing new primitives.
- shadcn-vue is configured with the `new-york` style, neutral base color, CSS variables, and lucide icons.
- Global styles and design tokens live in `layers/shared/app/assets/css/tailwind.css`.
- Use `cn()` from `layers/shared/app/lib/utils.ts` to combine conditional Tailwind classes.
- Use the existing app shell: `Page`, `Header`, `Main`, `Flex`, sidebar fragments, providers, `ToggleTheme`, and `ConfigDrawer`.
- Keep feature-specific table behavior close to the feature layer, but reuse shared table primitives and composables under `layers/shared/app/composable/table`.

## Testing

Tests live under `test/`:

- `test/unit`: pure TypeScript logic
- `test/nuxt`: composables, stores, and components needing Nuxt/Vue runtime
- `test/e2e`: Playwright browser tests

For focused changes, run the nearest relevant test first. For broad shared changes, run `pnpm test:run` and lint when feasible.

## Documentation

Project docs live in `docs/`.

- `docs/README.md`: documentation entry point
- `docs/layers.md`: Nuxt layer architecture reference
- `docs/inline-crud-table-mechanism.md`: inline CRUD table design
- `docs/ui-styles.md`: UI style and token guide

Some older markdown files may contain mojibake from box-drawing/checkmark characters. Keep new documentation ASCII unless there is a clear reason to use Unicode.
\_Last Update at 2026-05-15 19:55:20\_
