# Xi Combinator — Marketing Plan

**Version**: 1.0
**Date**: August 2026
**Owner**: Growth / Founder's office

---

## 1. Positioning

**One-liner**: Xi Combinator backs bold founders worldwide with funding, mentorship, and a global startup network.

**Positioning statement**: For early-stage founders in India and emerging markets who need capital, mentors and customers faster than a traditional accelerator can provide, Xi Combinator is a full-stack venture platform that combines incubation programs, AI advisors, an investor centre and a live community — accessible online, not gated by a single annual batch.

**Proof points to lead with** (single source of truth: `src/lib/platformStats.ts`):
- 500+ startups accelerated
- $1.2B+ total funding raised by portfolio
- 250+ active mentors, 180+ investors, 32 countries

> Rule: never publish a stat that is not in `platformStats.ts` or a database-backed page. If a claim cannot be verified, cut it.

---

## 2. Audience segments and jobs-to-be-done

| Segment | Job to be done | Entry page | Primary conversion |
|---|---|---|---|
| Aspiring founder | Find a co-founder, validate an idea | `/meet-cofounder`, `/mvp-lab` | Co-founder post / MVP Lab application |
| Early-stage startup | Get funded and mentored | `/incubation`, `/xi-lab` | Program application |
| Hackathon participant | Compete, win, get fast-tracked | `/hackathon` | Registration |
| Investor | Curated, scored deal flow | `/investor-centre`, `/deals` | Investor inquiry / intro request |
| Mentor / advisor | Structured, paid engagements | `/become-mentor` | Mentor application |
| Ecosystem partner | Distribution to founders | `/partnership`, `/partners` | Partnership inquiry |

---

## 3. Channel strategy

### 3.1 Organic search (primary, compounding)
Priority clusters, mapped to pages that already exist or should be created:

| Cluster | Intent | Page |
|---|---|---|
| "startup accelerator India / apply to accelerator" | Program | `/incubation`, `/xi-lab` |
| "how to find a co-founder" | Informational → product | `/meet-cofounder` + blog |
| "startup grants India 2026", "non-dilutive funding" | Informational → product | `/grants-funding` |
| "AWS / GCP / Azure startup credits" | Transactional | `/cloud-credits`, `/deals` |
| "hackathon 2026 register" | Event | `/hackathon`, `/past-events` |
| "seed funding trends 2026" | Thought leadership | `/news`, `/blogs` |

Technical baseline already shipped: per-route titles/descriptions/canonicals (`RouteSeo`), `robots.txt`, `sitemap.xml`, `llms.txt`, per-blog/news SEO fields. Ongoing SEO work = content depth, internal linking from `/blogs` into program pages, and keeping cohort pages fresh.

### 3.2 Content engine
- **2 posts/week** on `/blogs`: one founder-practical (fundraising, hiring, GTM), one data-led (cohort outcomes, funding analysis).
- **Weekly market brief** on `/news` — feeds the Investor Centre narrative.
- **Monthly cohort announcement** — `/monthly-top-10` and `/quarterly-top-5` are the flagship shareable assets; each release is an email + social + partner co-post.
- Every content piece ends with one CTA to a program application or the subscription ladder.

### 3.3 Community and product-led loops
- **Gamification loop**: XP, badges, streaks and the public `/leaderboard` + `/member/:id` profiles make participation shareable. Founders promote their own profile → free acquisition.
- **Co-founder marketplace**: two-sided; each post attracts applicants who must register.
- **Referral**: award points for referred signups that complete an application.

### 3.4 Partnerships
Categorised partners (accelerator, tech, finance/payments, credits & support) each get a co-marketing motion: credits offer listed on `/deals`, logo on `/partners`, one joint webinar or workshop per quarter.

### 3.5 Email
Templates already exist (welcome, verify, application status, invoice, broadcast). Sequences to run:
1. **Founder onboarding** (5 emails / 14 days): profile → co-founder → program fit → advisor demo → apply.
2. **Application nurture**: submitted → under review → shortlisted → decision, each with a next step.
3. **Investor digest** (monthly): new cohort, top-scored startups, intro CTA.
4. **Re-engagement** (30-day dormant): quest reminder, streak-at-risk, leaderboard standing.

### 3.6 Paid (only after organic baseline)
Small, intent-only budget: search ads on "startup accelerator apply", "startup grants", retargeting to application-page abandoners. Cap at 20% of growth spend; kill any channel above target CAC for two consecutive months.

---

## 4. Funnel and measurement

```text
Awareness   -> page_view, search_performed
Interest    -> cohort_announcement_viewed, cohort_startup_clicked, search_result_clicked
Intent      -> application form opened
Conversion  -> application_submitted
Activation  -> profile complete, first quest, first XP
Retention   -> weekly streak, messages sent, return visits
Revenue     -> subscription / membership purchase
```

Events are defined in `docs/ANALYTICS_EVENTS.md` and fire to GA4/GTM. Mark `application_submitted` and subscription purchase as GA4 conversions.

### North-star and targets (first 2 quarters)

| Metric | Baseline | Q+1 target | Q+2 target |
|---|---|---|---|
| Monthly organic sessions | measure first | +40% | +100% |
| Applications submitted / month | measure first | +50% | +120% |
| Application → shortlist rate | measure first | +5 pts | +8 pts |
| Weekly active members (XP earned) | measure first | 25% of members | 35% |
| Paid subscription conversion | measure first | 2% | 4% |

> All baselines must be read from GA4 + the admin analytics tab before targets are committed. Do not report targets as results.

---

## 5. Quarterly calendar

| Month | Anchor moment | Supporting activity |
|---|---|---|
| M1 | Cohort applications open | SEO cluster launch, founder onboarding sequence live |
| M2 | Monthly Top 10 release | Partner co-post, investor digest #1 |
| M3 | Hackathon | Registration campaign, sponsor activation, past-events recap |
| M4 | Quarterly Top 5 + Demo Day | Investor invites, press-ready cohort report |

---

## 6. Content quality and trust rules

1. Publish only claims backed by platform data, a named source, or a linked report.
2. No invented testimonials, ratings, outcomes or logos.
3. All money in USD base, rendered via `<Money usd={...} />` so currency selection works.
4. Dates and editions stay current — no page should reference a passed year as upcoming.
5. Every new public page: single H1, meta title < 60 chars, description < 160 chars, sitemap entry, and at least one internal link from an existing hub.

---

## 7. Operating cadence

- **Weekly**: publish 2 posts, review GA4 funnel, triage applications within 48h.
- **Monthly**: cohort release, investor digest, channel CAC review, content refresh of top-10 pages.
- **Quarterly**: positioning review, partner QBR, pricing/plan performance review, full SEO audit.
