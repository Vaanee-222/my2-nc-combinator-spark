# Implementation Plan

Four independent features. I'll batch DB changes into a single migration, then build UI and tracking.

## 1. INClab Application Workflow + Admin Review

**Database** (new table `inclab_applications`):
- Fields: founder_name, email, phone, startup_name, stage, problem, solution, market, traction, funding_ask, why_inclab, team_size, industry, pitch_deck_url, status (pending/under_review/accepted/rejected), admin_notes, reviewed_by, reviewed_at
- RLS: user inserts own, user views own, admin views/updates all
- GRANTs for authenticated + service_role

**Frontend**:
- New `InclabApplicationDialog.tsx` — dedicated form (vs generic ApplicationDialog), wired into the existing "Apply" CTAs on `/inclab`
- New admin tab `InclabApplications.tsx` inside `AdminDashboard` — list, filter by status, view full detail in a dialog, change status, add admin notes
- User can see their submission status on their `UserDashboard` / `StartupDashboard` (reuses `ApplicationStatus` pattern)

## 2. Global Portal Search

**Approach**: Client-side static index of pages + keywords (fast, no backend needed; matches "search pages and keywords within the portal").

**Components**:
- `src/lib/searchIndex.ts` — array of `{title, path, keywords, description, category}` covering all 40+ public routes (Hackathon, MVP Lab, INClab, Incubation, Partners, Investors, etc.)
- `src/components/GlobalSearch.tsx` — `cmdk`-based command palette (shadcn `Command` component, already installed) with:
  - Trigger: search icon in `Navigation` + keyboard shortcut `Cmd/Ctrl+K`
  - Fuzzy match on title/keywords/description
  - Grouped results by category (Programs, Community, Resources, Account)
  - Click → navigate; ESC to close

## 3. Public Cohort Pages

**Monthly Top 10** (`/monthly-top-10`):
- Hero + filter bar: month selector (last 12 months), category filter, status filter
- Grid of cards (reuses styling from existing `CohortInfo` component)
- Click card → existing `/startup-profile/:id`

**Quarterly Top 5** (`/quarterly-top-5`):
- Hero + filter: quarter selector (Q1–Q4, year)
- Featured 5 cards with richer detail (industry, funding stage, founders, traction highlight)
- Click card → `/startup-profile/:id`

**Data**: Static seed arrays in each page (extend the mock data already in `CohortInfo.tsx`), structured so it can later be swapped for a Supabase-backed table without UI changes. Both pages added to `App.tsx` routes and linked from Navigation + Footer.

## 4. GA4 / GTM + Event Tracking

**Setup**:
- `src/lib/analytics.ts` — small wrapper:
  - `initAnalytics(gaId, gtmId)` — injects GA4 gtag + GTM container into `<head>` at runtime when IDs are configured
  - `trackEvent(name, params)` — pushes to `window.dataLayer` and calls `gtag('event', ...)` safely (no-ops if not initialized)
  - `trackPageView(path)` — auto-fires on route change via a `useAnalyticsPageViews` hook mounted in `App.tsx`
- IDs sourced from existing `HeaderScripts` admin panel (already supports custom head scripts) **plus** dedicated env-style fields stored in localStorage-backed admin config so non-devs can paste GA4 Measurement ID + GTM Container ID.

**Tracked events**:
- `page_view` — auto on every route change (path, title)
- `application_submitted` — fired in `ApplicationDialog`, `InclabApplicationDialog`, `IncApplicationDialog`, `HackathonRegistrationDialog`, `IncubationApplicationForm` with `{program, startup_name}`
- `application_status_changed` — admin updating status (`{program, new_status}`)
- `cohort_announcement_viewed` — fires on Monthly Top 10 / Quarterly Top 5 page view with `{cohort_type, period}`
- `cohort_startup_clicked` — card click with `{cohort_type, startup_id, startup_name}`
- `search_performed` — global search query with `{query, results_count}`
- `search_result_clicked` — with `{query, result_path}`

## Technical Notes
- All new DB writes guarded by `auth.uid()`; admin reads guarded by `has_role(auth.uid(),'admin')`
- Reuses existing design tokens (orange accent, dark theme, no glow)
- Navigation gets a search icon button (desktop + mobile menu entry)
- Footer "Programs" column gets links to the two new cohort pages
- Admin Dashboard tabs list extended with "INClab Apps"
- Documentation file `docs/ANALYTICS_EVENTS.md` lists every tracked event + payload

## Out of scope (confirm if needed)
- Real database for cohort startups (using structured seed data for now; easy to migrate later)
- Server-side analytics / BigQuery export
- A/B testing framework
