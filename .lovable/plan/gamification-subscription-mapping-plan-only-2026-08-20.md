# Gamification + Subscription Mapping (Plan only)

Two related tracks: (1) make startups and mentors come back daily, (2) give co-founders, mentors and startups something worth paying for. No implementation yet — this is for review.

## Track 1 — Gamification

### Core loop
Every meaningful action earns points, points build a level, levels unlock perks that matter inside the platform (visibility, credits, intros). Points are never buyable — that keeps the leaderboard credible.

### Startup point events
| Action | Points | Cap |
|---|---|---|
| Complete profile section (logo, deck, traction, team) | 25 each | one-time |
| Weekly traction update posted | 40 | 1/week |
| Apply to a program (Hackathon, Xi Lab, Incubation, MVP Lab) | 30 | 4/month |
| Claim + report outcome on a deal | 20 | per deal |
| Attend a mentor session (mentor confirms) | 50 | 4/month |
| Post a co-founder / hiring request that gets applicants | 35 | 2/month |
| Health score improves 10+ points | 60 | 1/month |

### Mentor point events
| Action | Points | Cap |
|---|---|---|
| Complete mentor profile + specializations | 50 | one-time |
| Accept a mentorship request within 48h | 25 | per request |
| Session completed and logged | 75 | unlimited |
| Mentee rates session 4★+ | 40 | per session |
| Publish a resource / blog post | 60 | 2/month |
| 4-week unbroken activity streak | 100 | 1/month |

### Levels and perks
- **L1 Explorer (0–250)** — baseline access.
- **L2 Builder (251–750)** — profile badge, directory sorted above unranked.
- **L3 Contender (751–1800)** — eligible for Monthly Top 10 shortlist, 1 free intro request/month.
- **L4 Signal (1801–4000)** — featured card on the directory, priority mentor matching, cloud-credit fast lane.
- **L5 Flagship (4000+)** — homepage/cohort spotlight, invite to closed investor rooms, waived service fees on one engagement.

Mentors get the parallel ladder: L3 unlocks "Verified Mentor" badge, L4 unlocks paid-session listing, L5 unlocks advisory-board nomination.

### Supporting mechanics
- **Streaks** — weekly activity streak with a 1-week grace token, shown on the dashboard overview.
- **Badges** — one-off achievements (First Deal Claimed, 10 Sessions, Cohort Graduate, 5★ Mentor) rendered on public profiles.
- **Quests** — rotating 3-item weekly checklist per role, generated from what the account has *not* done.
- **Leaderboards** — monthly, segmented by role and by cohort so newcomers aren't crushed by veterans; ties broken by recency.
- **Progress surfaces** — a compact XP/level strip in `DashboardHeader`, a Quests card in `DashboardOverview`, a Leaderboard pane in the role nav.

### Anti-abuse
Points awarded server-side only (DB triggers + an edge function), each event idempotent per source record, per-period caps enforced in SQL, admin can void points with an audit-log entry.

### Data model sketch
- `point_events` (user_id, role, event_key, points, source_table, source_id, awarded_at) — unique on (user_id, event_key, source_id).
- `user_points` — materialised totals, level, current streak, longest streak.
- `badges` / `user_badges` — catalogue + awards.
- `quests` / `user_quests` — weekly assignments and completion state.
- Leaderboards as a view over `point_events` filtered by month.
- Admin tab: point rules editor, manual grant/void, abuse report.

### Rollout
1. Ledger + totals + level strip (silent scoring, no perks).
2. Badges + streaks + quests on the overview pane.
3. Leaderboards + public profile badges.
4. Perk enforcement (directory ranking, free intros, spotlights).

## Track 2 — Subscription / membership mapping beyond startups

Today `subscription_plans` already has `category` (membership / subscription / service) and `tier`. Extend it with an `audience` column (`startup`, `investor`, `mentor`, `cofounder`, `all`) so the pricing page and each dashboard render only the relevant ladder.

### Startup (existing, restated)
- **Free** — directory listing, apply to programs, browse deals.
- **Growth** — full deal catalogue, cloud-credit fast lane, health score reports, 3 intro requests/month.
- **Scale** — investor room access, featured directory placement, dedicated mentor hours, unlimited intros.

### Mentor
- **Free** — profile, accept requests, log sessions.
- **Mentor Pro** — paid-session listing with payouts, calendar + booking page, mentee CRM (notes, history), analytics on session outcomes.
- **Advisory Partner** — co-branded advisory listing, cohort office-hours slot, revenue share on referred startups, eligibility for the Advisory Board page.

### Co-founder
- **Free** — browse opportunities, 3 applications/month.
- **Co-founder Plus** — unlimited applications, profile boost in founder search, "verified skills" badge, see who viewed the profile, direct message founders.
- **Founder Track** — matchmaking concierge, equity/agreement templates, legal + incorporation partner credits.

### Investor
- **Free** — public directory, receive inbound inquiries.
- **Deal Flow** — curated weekly deal alerts, filters by sector/stage/geo, portfolio tracker.
- **Syndicate** — data room access, cohort demo-day priority, co-invest introductions, analytics exports.

### Cross-cutting rules
- Gamification level can *substitute* for a paid perk temporarily (e.g. L4 startups get one Growth month free) — this is the hook that connects both tracks.
- Entitlements resolved in one place (`useEntitlements`) reading active `subscription_purchases` + role + level, so panes gate consistently.
- Quota-style perks (intro requests, applications) counted per calendar month in a `usage_counters` table.
- Admin needs: assign/extend a plan manually, see MRR by audience, and a per-user entitlement inspector.
- Payments stay mock dialogs until a real provider is requested.

### Suggested build order
1. `audience` on plans + entitlement resolver + gating in the four dashboards.
2. Quota counters and the paywall/upgrade prompts.
3. Mentor Pro booking/payout surface (biggest new surface area).
4. Co-founder Plus signals (profile views, verified badge).
5. Investor Deal Flow alerting.
