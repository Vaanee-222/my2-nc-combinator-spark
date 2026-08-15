# Role Dashboards — UX Overhaul

The four role dashboards (startup, investor, mentor, co-founder) share the same problems: an 8-tab horizontal strip that wraps on laptops, a stat-card wall that repeats what the header already shows, no "what should I do next" surface, and inconsistent empty/loading states. Below is a phased fix; each phase is shippable on its own.

## What's wrong today

- **Navigation**: 7-9 tabs in a grid strip. Labels are inconsistent across roles ("Profile & Settings" vs "Account" vs "Mentor Profile"). No grouping, no icons, poor mobile behaviour.
- **Header noise**: DashboardHeader already shows stats + profile meter, then investor/startup pages repeat 4 more stat cards below it. Two competing focal points before any content.
- **No action surface**: Alerts live in a buried tab. Nothing tells a user "3 applicants waiting", "profile 40% complete", "1 intro request expiring".
- **Dead states**: Loading shows plain text; empty states have no CTA, so a new user sees blank cards.
- **Density**: everything is a `bg-card-gradient` card at the same weight — no visual hierarchy between primary work and secondary info.

## Phase 1 — Shell and navigation (highest impact)

- Replace the tab strip with a **left sidebar nav** (same pattern as the admin dashboard) collapsible to icons; on mobile it becomes a sheet + bottom-sticky segmented control for the top 4 items.
- Group items per role: **Work** (role-specific tabs) / **Growth** (Advisor, Analytics) / **Account** (Alerts, Settings).
- Standardise labels and icons across all four roles: Alerts, Account (never "Profile & Settings").
- Live count badges on nav items (pending requests, new applicants, unread alerts) so users don't hunt.
- Slim the header: name, role badge, one-line context, quick actions. Move the profile meter into the Next Steps card.

## Phase 2 — "Today" landing view

Each dashboard opens on an **Overview** pane instead of a random tab:

- **Next steps checklist** — derived from real data: incomplete profile fields, unanswered requests, applications needing follow-up, unclaimed deals. Each row deep-links to the exact tab.
- **3 headline KPIs max**, role-specific, with trend delta instead of the current 4-card wall.
- **Recent activity feed** — last 5 items from `useNotifications`, with Open buttons.

## Phase 3 — Content quality pass

- Shared `<EmptyState icon title description action />` and `<SkeletonCard />` used everywhere; kill all "Loading…" text.
- Consistent table/list treatment: search + filter + sort in one toolbar row, pagination over infinite lists.
- Every destructive action gets a confirm dialog; every mutation gets an optimistic toast.
- Responsive audit at 390 / 768 / 1280 px.

## Phase 4 — Polish

- Alerts: group by kind, filter chips (All / Unread / Requests / Messages), persist read state to the database rather than localStorage so it follows the user across devices.
- Keyboard: `g` + key jumps between panes, `/` focuses search.
- Subtle motion on pane switches; respect `prefers-reduced-motion`.

## Technical notes

- New `src/components/dashboard/DashboardShell.tsx` wrapping sidebar + content, driven by a per-role `navItems` config array. All four pages become thin config + panes.
- Keep `useDashboardTab` for persistence; the shell reads/writes the same key so nothing regresses.
- Keep `forceMount` + `data-[state=inactive]:hidden` on heavy panes to avoid the refetch-on-switch regression fixed earlier.
- Next-steps logic in a new `useNextSteps(role)` hook reusing existing queries — no new tables. Persisting alert read state (Phase 4) is the only DB change: one `notification_reads` table with RLS scoped to `auth.uid()`.
- Design tokens only — no hardcoded colours; dark theme with orange accents, no text glow.

## Suggested sequencing

One shot is possible but risky across four pages. Recommended: **Phase 1 + 2 together** (that's where the UX gain is), then Phase 3 as a sweep, Phase 4 last.
