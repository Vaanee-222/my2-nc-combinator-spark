# Role Dashboards — Next Stage (Phase 3 + 4)

Phases 1 and 2 are done: all four role dashboards (startup, investor, mentor, co-founder) run on the vertical sidebar shell (`DashboardNav`) with a "Today" overview pane (`DashboardOverview`). `EmptyState` / `SkeletonCards` exist but are only used in a few places.

This stage finishes the overhaul: content quality everywhere, then polish.

## Phase 3 — Content quality sweep

- **Kill all plain "Loading…" text.** Every pane that fetches data renders `SkeletonCards` (or a list/table skeleton) while loading. Covers portfolio, pipeline, new deals, analytics, mentees, sessions, requests, applicants, deals & credits, co-founder posts.
- **Every empty list gets an `EmptyState`** with icon, one-line explanation, and a CTA that deep-links to the action that fixes it (e.g. "No portfolio companies yet" → Add company).
- **One list toolbar pattern.** Search + status filter + sort in a single row above each list; adopt it consistently across the panes that already have ad-hoc search boxes.
- **Confirm + toast discipline.** Destructive actions (delete post, remove holding, reject request) always use an AlertDialog; every mutation fires a success/error toast.
- **Responsive audit** at 390 / 768 / 1280 px for each of the four dashboards; fix overflow in tables and Kanban.

## Phase 4 — Polish

- **Alerts pane upgrade:** filter chips (All / Unread / Requests / Messages), grouped by kind, and read state persisted in the database so it follows the user across devices (today it is localStorage only).
- **Keyboard shortcuts:** `g` then a key jumps between panes, `/` focuses search.
- **Motion:** subtle fade/slide on pane switches, respecting `prefers-reduced-motion`.
- **Nav badge accuracy:** verify every sidebar count (applicants, requests, unread) refreshes after the related mutation.

## Technical notes

- Shared toolbar extracted to `src/components/dashboard/ListToolbar.tsx`; list skeleton added alongside `SkeletonCards` in `EmptyState.tsx`.
- Alerts persistence is the only backend change: one `notification_reads` table (user_id, notification_key, read_at) with grants and RLS scoped to `auth.uid()`; `useNotifications` reads/writes it with localStorage as offline fallback.
- Keep `forceMount` + `data-[state=inactive]:hidden` on heavy panes so switching never refetches.
- Design tokens only — dark theme, orange accents, no text glow, no hardcoded colours.

## Sequencing

Phase 3 first as a single sweep across the four dashboards (biggest perceived quality jump), then Phase 4. Can also ship Phase 3 per role if you prefer smaller reviews.
