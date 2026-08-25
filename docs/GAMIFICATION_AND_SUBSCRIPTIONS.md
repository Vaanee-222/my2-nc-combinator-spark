# Xi Combinator — Gamification & Subscriptions

**Version**: 1.0.0 · **Last updated**: August 25, 2026
Covers the engagement layer (points, levels, badges, streaks, quests, leaderboards, perks)
and the audience-aware monetisation layer (plans, tiers, entitlements, quotas).

---

## 1. Gamification

### 1.1 Core loop
Every meaningful action writes an immutable row to the points ledger. Totals roll up into a
level; levels unlock platform perks (visibility, free intros, spotlights). Points are never
purchasable — the leaderboard stays credible.

### 1.2 Levels

| Level | Name | XP range | Headline perks |
|---|---|---|---|
| 1 | Explorer | 0 – 250 | Baseline access |
| 2 | Builder | 251 – 750 | Profile badge, directory boost |
| 3 | Contender | 751 – 1800 | Monthly Top 10 shortlist, 1 free intro/month |
| 4 | Signal | 1801 – 4000 | Featured directory card, priority mentor matching, cloud-credit fast lane, 3 free intros/month |
| 5 | Flagship | 4000+ | Homepage & cohort spotlight, closed investor rooms, service-fee waiver, unlimited intros |

### 1.3 Point events (server-awarded)
Awarded by database triggers + the `award_points` security-definer function. Each event is
idempotent per source record and capped per period.

| Audience | Action | Points |
|---|---|---|
| Startup | Complete a profile section | 25 (one-time each) |
| Startup | Apply to a program (Hackathon, Xi Lab, Incubation, MVP Lab) | 30 |
| Startup | Claim a deal / report outcome | 20 |
| Startup | Attend a confirmed mentor session | 50 |
| Startup | Post a co-founder request that receives applicants | 35 |
| Startup | Health score improves 10+ points | 60 |
| Mentor | Complete mentor profile + specialisations | 50 |
| Mentor | Accept a request within 48h | 25 |
| Mentor | Session completed and logged | 75 |
| Mentor | Mentee rates the session 4★+ | 40 |
| Mentor | 4-week unbroken activity streak | 100 |

### 1.4 Badges, streaks, quests
- **Badges** — `badges` catalogue + `user_badges` awards, granted by `evaluate_badges`
  (XP thresholds or event counts). Rendered on dashboards and public profiles.
- **Streaks** — weekly activity streak with a one-week grace token, computed client-side from
  the ledger in `useGamification`.
- **Quests** — rotating 3-item weekly checklist per role, generated from what the account has
  *not* done this week.

### 1.5 Surfaces

| Surface | Component / route |
|---|---|
| XP + level strip | `DashboardHeader` → `XPStrip.tsx` |
| Quests, streak, badge grid | `GamificationCard.tsx` on `DashboardOverview` |
| Perks ladder | `PerksCard.tsx` |
| Public leaderboard (month + role filters, podium, spotlight) | `/leaderboard` |
| Public member profile (level, XP, badges, perks) | `/member/:id` |
| Admin grant / deduct / void with audit log | Admin Dashboard → **Points & Levels** (`PointsAdmin.tsx`) |

### 1.6 Anti-abuse
Points are only written server-side. Ledger rows are unique on
`(user_id, event_key, source_id)`, per-period caps are enforced in SQL, and admin voids
recalculate totals + badges and write to `admin_audit_log`.

---

## 2. Subscriptions & entitlements

### 2.1 Audiences
`subscription_plans.audience` ∈ `startup | investor | mentor | cofounder | all`.
`/subscription` renders the ladder for the signed-in member's role by default with a manual
audience switcher; dashboards render the same data through `PlanLadder.tsx`.

### 2.2 Ladders

| Audience | Free | Pro tier | Premium tier |
|---|---|---|---|
| Startup | Directory listing, apply to programs, browse deals | **Growth** — full deal catalogue, credit fast lane, health reports, 3 intros/mo | **Scale** — investor room, featured placement, unlimited intros |
| Mentor | Profile, accept requests, log sessions | **Mentor Pro** — paid sessions, booking page, mentee CRM, session analytics | **Advisory Partner** — advisory listing, office-hours slot, revenue share |
| Co-founder | Browse opportunities, 3 applications/month | **Co-founder Plus** — unlimited applications, profile boost, verified skills, profile viewers, direct message | **Founder Track** — matchmaking concierge, templates, partner credits |
| Investor | Public directory, inbound inquiries | **Deal Flow** — curated alerts, filters, portfolio tracker | **Syndicate** — data room, demo-day priority, analytics export |

### 2.3 Entitlement resolution
`useEntitlements()` combines **role → audience**, **active `subscription_purchases` → tier**
and **gamification level**:

- `has(feature)` — checks the feature matrix minimum tier. Level 4+ grants a courtesy Pro unlock
  (the cross-over rule between the two tracks).
- `tier` / `tierRank` — `free | pro | premium`.
- `quotas.applications` / `quotas.intros` — monthly limit, used and remaining. Level-based free
  intros stack on top of the paid allowance.
- `plans` — DB-driven ladder for the resolved audience.

### 2.4 Quotas
Counted per calendar month. Source-table counts are used where one exists
(`applications`, `cofounder_applications`, `introduction_requests`); everything else increments
`usage_counters` through the `increment_usage_counter` RPC. `UpgradePrompt.tsx` wraps any locked
feature and the co-founder apply flow enforces the 3-applications/month free limit.

---

## 3. Data model

| Table / function | Purpose |
|---|---|
| `point_events` | Immutable ledger — `user_id`, `role`, `event_key`, `points`, `source_table`, `source_id`, `awarded_at` |
| `user_points` | Materialised totals, level, current + longest streak |
| `badges` / `user_badges` | Catalogue and awards |
| `usage_counters` | Per-user, per-month counters for quota perks |
| `subscription_plans` | Plans with `audience`, `tier`, `category`, price, features |
| `subscription_purchases` | Active/expired member purchases |
| `award_points(...)` | Security-definer point award, idempotent + capped |
| `recalc_user_points(...)` | Rebuilds totals, level and badges for one member |
| `evaluate_badges(...)` | Grants badges from thresholds and counts |
| `monthly_leaderboard(...)` | PII-safe public ranking by month + role |
| `public_gamification(...)` | PII-safe public profile payload |
| `admin_adjust_points(...)` / `admin_void_point_event(...)` | Audited admin controls |
| `admin_points_directory(...)` | Admin member search for the Points tab |
| `increment_usage_counter(...)` | Server-side monthly quota increment |

All tables enforce RLS: members read their own ledger and counters, public reads go through the
security-definer functions above, and writes are server-side or admin-only.

---

## 4. Client modules

| Module | Responsibility |
|---|---|
| `src/hooks/useGamification.ts` | Totals, level, ledger, badges, streaks, quests |
| `src/hooks/usePerks.ts` | Perk ladder, `introQuotaForLevel`, unlock checks |
| `src/hooks/useLeaderboard.ts` | `monthly_leaderboard` + `public_gamification` |
| `src/hooks/useEntitlements.ts` | Audience, tier, feature matrix, quotas, `bumpUsage` |
| `src/components/BadgeIcons.tsx` | Shared badge iconography |
| `src/components/dashboard/PlanCard.tsx` | Active plan + usage bars |
| `src/components/UpgradePrompt.tsx` | Reusable paywall/upgrade gate |

---

## 5. Roadmap (not yet built)
- Mentor Pro booking + payout surface.
- Co-founder Plus signals (profile viewers, verified-skills verification flow).
- Investor Deal Flow alerting.
- Admin MRR-by-audience reporting and a per-user entitlement inspector.

Payments remain mock dialogs until a live provider is requested.
