# Xi Combinator — Backend Migration Guide

**Version:** `1.0.0` · 2026-09-09 · Moving off Lovable Cloud (managed Supabase) onto another provider.

The migration bundle lives outside the repo, in the documents folder:

```
migration/
  00_run_all.sql               runner (psql \i of the five files below)
  01_extensions_and_roles.sql  pgcrypto/uuid-ossp, anon/authenticated/service_role, schemas
  02_auth_compat.sql           auth.users + auth.uid()/auth.jwt()/auth.role() shim
  03_schema_tables.sql         1 enum, 47 tables, 83 constraints, 12 indexes
  04_functions.sql             20 functions (19 public + private.has_role)
  05_rls_and_policies.sql      grants, RLS on all 47 tables, 142 policies
  06_triggers.sql              49 data triggers + the signup trigger
  scripts/10_export_from_source.sh
  scripts/20_import_into_target.sh
  scripts/30_copy_storage.ts
```

The bundle has been executed end to end on a clean PostgreSQL 17 instance:
47 tables, 142 policies, 50 triggers, 65 functions, RLS enabled on every table, zero errors.

---

## 1. What the platform depends on

| Capability | Used for | Portable? |
|---|---|---|
| PostgreSQL 15+ with RLS | All 47 tables, policies, triggers, security-definer functions | Yes — any Postgres |
| `pgcrypto` (`gen_random_uuid`) | Primary keys | Yes |
| Auth (email/password, JWT) | Login, `auth.uid()` in every policy | Needs a replacement provider |
| Auto-generated REST/data API | Every client read/write via `@supabase/supabase-js` | PostgREST, or your own API |
| RPC (stored procedures over HTTP) | `monthly_leaderboard`, `public_gamification`, `admin_adjust_points`, `admin_void_point_event`, `admin_points_directory`, `increment_usage_counter` | Yes with PostgREST; otherwise wrap as endpoints |
| Object storage | Bucket `partner-logos`, media library uploads | S3/R2/GCS |
| Realtime (websockets) | `/messages` live inbox (`messages-realtime` channel) | Supabase Realtime, Ably, Pusher, or polling |
| Edge functions (Deno) | `ai-agent-chat`, `startup-health-score`, `send-notification`, `seed-demo-data` | Any serverless runtime |
| AI gateway (`LOVABLE_API_KEY`) | Advisor chat + health scoring | Swap for OpenAI/Anthropic/Gemini key |
| Email (`RESEND_API_KEY`, SMTP config) | Status-change notifications | Already provider-agnostic |

Frontend touchpoints: 72 files import `@/integrations/supabase/client`; all writes funnel through
`src/lib/api/index.ts`. Environment variables consumed by the app are only
`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`.

---

## 2. Choose a target

| Option | Effort | What you keep | What you rebuild |
|---|---|---|---|
| **Self-hosted Supabase** (Docker/Kubernetes, Coolify, Railway) | Lowest | Everything: auth, PostgREST, storage, realtime, edge functions, the JS client | Only DNS, backups, monitoring. Delete `02_auth_compat.sql`. |
| **Nhost / Appwrite / Pocketbase** | Medium | Postgres + auth + storage | Data client API, RLS translated to their permission model |
| **Neon / Supabase-free Postgres + PostgREST + GoTrue** | Medium | SQL, RLS, RPC unchanged | Compose the stack yourself; keep the JS client via a thin gateway |
| **AWS (RDS + Cognito + S3 + Lambda + API Gateway)** | High | SQL schema, functions | Auth model, data API, storage SDK, realtime, all client calls |
| **Firebase / Firestore** | Highest — not recommended | Nothing | Relational model, RLS, RPC and reports must be redesigned |

**Recommendation:** self-hosted Supabase or Postgres + PostgREST + GoTrue. Both preserve
`auth.uid()`, RLS and RPC, so the 142 policies and 20 functions migrate unchanged and the
frontend needs only two environment variables changed.

---

## 3. Migration runbook

### Step 0 — Prerequisites
- `psql` / `pg_dump` 15 or newer, `bun`, and admin access to the target Postgres.
- Source connection string (`SOURCE_DATABASE_URL`) and target (`TARGET_DATABASE_URL`).
- A maintenance window: put the site into read-only mode or accept a short freeze.

### Step 1 — Export
```bash
export SOURCE_DATABASE_URL="postgresql://…"
./migration/scripts/10_export_from_source.sh
```
Produces `dump/schema.sql`, `dump/data_public.sql`, `dump/auth_users.csv`, `dump/storage_objects.csv`.

### Step 2 — Build the target schema
```bash
export TARGET_DATABASE_URL="postgresql://…"
cd migration && psql "$TARGET_DATABASE_URL" -v ON_ERROR_STOP=1 -f 00_run_all.sql
```
On self-hosted Supabase or Nhost, delete `02_auth_compat.sql` from `00_run_all.sql` first —
GoTrue already supplies `auth.users` and `auth.uid()`.

### Step 3 — Load data
```bash
./migration/scripts/20_import_into_target.sh
```
Identities load first (public tables have FKs to `auth.users`), then public rows with
`session_replication_role = replica` so the points triggers do not re-award XP.

### Step 4 — Users and passwords
- Supabase → Supabase (self-hosted or another project): bcrypt hashes in `encrypted_password`
  copy across as-is; users keep their passwords.
- Supabase → Cognito/Auth0/Clerk: hashes are not transferable in general. Either use the
  provider's bcrypt import (Auth0 and Cognito support bulk import with bcrypt) or trigger a
  password reset email for every user on first login.
- Keep the **same UUIDs**. Every table keys off `auth.users.id`; new IDs would orphan all data.

### Step 5 — Storage
```bash
SOURCE_URL=… SOURCE_SERVICE_KEY=… S3_ENDPOINT=… S3_BUCKET=… S3_KEY=… S3_SECRET=… \
  bun run migration/scripts/30_copy_storage.ts
```
Then rewrite stored public URLs in `media_assets.url`, `partners.logo_url`,
`site_settings.logo_url` / `favicon_url` (SQL snippets are in the script header).
Bucket `partner-logos` must be public-read on the target.

### Step 6 — Edge functions
The four Deno functions in `supabase/functions/` are standard `Deno.serve` handlers and run
unchanged on Supabase self-hosted or Deno Deploy. For Lambda/Cloud Run/Vercel, port the handler
signature and keep the body. Required env vars:

| Function | Env |
|---|---|
| `ai-agent-chat`, `startup-health-score` | `LOVABLE_API_KEY` → replace with `OPENAI_API_KEY` (or equivalent) and update the gateway base URL |
| `send-notification` | `RESEND_API_KEY`, `NOTIFY_FROM_EMAIL` (optional; without them emails are logged only) |
| all | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` equivalents for the new backend |

### Step 7 — Repoint the frontend
Only three values change:

```
VITE_SUPABASE_URL="https://api.your-domain.com"
VITE_SUPABASE_PUBLISHABLE_KEY="<new anon key>"
VITE_SUPABASE_PROJECT_ID="<new ref>"
```

Staying on a Supabase-compatible stack: nothing else changes.
Moving to a non-compatible stack: rewrite only `src/integrations/supabase/client.ts` and
`src/lib/api/index.ts` to speak the new API; the rest of the app consumes `api.*`.

### Step 8 — Verify
```sql
SELECT count(*) FROM pg_tables   WHERE schemaname='public';                 -- 47
SELECT count(*) FROM pg_policies WHERE schemaname='public';                 -- 142
SELECT count(*) FROM pg_tables   WHERE schemaname='public' AND NOT rowsecurity; -- 0
SELECT count(*) FROM auth.users;                                            -- matches source
```
Then run the app checks: sign in as each role, submit one application, claim a deal, open the
admin audit log, open `/leaderboard`, upload a partner logo, send a message.
`bun run test` and the Playwright flows in `tests/e2e/` cover most of this.

---

## 4. Configuration checklist

| Item | Where | Note |
|---|---|---|
| Database URL + pooled URL | Target provider | Use the pooled port for the API, direct for migrations |
| JWT secret / JWKS | Auth provider | Claims must include `sub` (user UUID) and `role` |
| `request.jwt.claims` | API layer | Custom API servers must `set_config` per request or every policy sees `anon` |
| CORS origins | API gateway | Preview and production domains |
| Email redirect URLs | Auth provider | `/`, `/reset-password` |
| SMTP / Resend | Admin → Configuration → Email | Values already stored in `site_settings` |
| Storage bucket `partner-logos` | Storage provider | Public read, authenticated write |
| Backups | Target provider | Daily snapshot + PITR recommended |
| Monitoring | Target provider | Slow queries, connection count, RLS denials |

## 5. Rollback

Keep the Lovable Cloud project live and read-only for at least 7 days. Rollback is reverting the
three `VITE_*` values and redeploying — the source database is untouched by this procedure.
Any rows written to the new backend during that window must be re-exported before switching back.

## 6. Known gaps to handle manually

1. **Realtime** — `/messages` uses a Supabase websocket channel. On a non-Supabase stack, swap
   for Ably/Pusher or a 10-second poll in `src/pages/Messages.tsx`.
2. **Password hashes** — non-bcrypt targets require a reset flow.
3. **Storage URLs** — hard-coded absolute URLs in the database must be rewritten (Step 5).
4. **`service_role`** — the bundle creates it with `BYPASSRLS`; never expose that key client-side.
5. **Seeded demo data** — `scripts/seed-demo-data.ts` re-seeds content if you prefer a clean start
   over copying rows.
