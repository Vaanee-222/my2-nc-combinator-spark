# Xi Combinator — Site-wide Refresh Plan

This is a large, multi-area request. I've grouped it into work packages so we can ship incrementally. Each package is independently shippable.

---

## 1. Currency → USD everywhere
- Replace all ₹/INR strings across pages (Subscription, Deals, Grants & Funding, Investor Centre, Cohort, Startup cards, dashboards) with `$` / USD.
- Add a lightweight **global currency context** (`CurrencyProvider`) with a selector in the top nav (USD default; INR, EUR, GBP, SGD as options) — converts displayed amounts using static FX rates stored in `src/lib/currency.ts`.
- Wrap all price displays in a `<Money amount={...} />` component.

## 2. Remove all emoticons / emoji
Sweep across: Hero, ProgramOverview, Incubation, Investor Centre, Hackathon, Grants, News, About, Footer. Replace with `lucide-react` icons matching the brand.

## 3. Branding sweep — "Xi" / "Xi Combinator"
- Audit all remaining "INC", "IC", "INCLab", "Inc Combinator" strings → "Xi" / "Xi Combinator" / "Xi Lab".
- Update route slug `/inclab` → `/xi-lab` (keep `/inclab` as a redirect for back-compat).
- Update `Breadcrumbs` route labels, search index, sitemap entries, OG/meta.

## 4. 404 redirection
- Rewrite `NotFound.tsx` to match dark theme + branded styling, with auto-redirect to `/` after 5s and a manual "Go home" CTA. Log the bad path to analytics (`page_not_found`).

## 5. Partners page expansion
- Add 12+ new global partners (Nvidia, Stripe, AWS, Google for Startups, Microsoft for Startups, HubSpot, Notion, Figma, OpenAI, Vercel, MongoDB, Snowflake, etc.) to the `partners` table via insert migration.
- Convert region grids to a **carousel/slider** (embla) when >6 partners.
- Expand the **View Details** dialog with new fields: `founded_year`, `headquarters`, `partnership_tier` (Strategic/Platform/Ecosystem), `benefits` (text[]), `case_study_url`. Migration adds columns + admin CRUD form fields in `PartnerManagement.tsx`.

## 6. Hackathon page — 2026 refresh
- Update all event seed/static content to **2026 dates and themes** (AI Agents, Climate Tech, FinTech, DeepTech).
- Standardize **Prizes & Rewards** card colors to a single token (`bg-primary/10 border-primary/30`) — no rainbow palette.

## 7. Investor Centre
- Remove emojis; replace with `TrendingUp`, `BarChart3`, `Globe2`, `Briefcase` icons.
- Update market-insight stats to **2025/2026 numbers** (India + global VC data, refreshed copy).

## 8. News + Blogs — content refresh
- Replace stale articles with **2026-dated** thought-leadership pieces: funding analysis ("Why X raised $Y"), founder playbooks, ecosystem insights, market commentary.
- Add categories: *Funding Analysis*, *Founder Playbook*, *Ecosystem Insights*, *Market Commentary*.
- Seed 12 new articles via insert migration (if blogs/news are DB-backed) or static data.

## 9. INC Lab page polish
- **Application Process** arrows → left-to-right horizontal flow with `ArrowRight` icon and connecting line.
- **What You Get** section: replace emojis with branded lucide icons (`Rocket`, `Users`, `Coins`, `Network`, `Shield`, `Sparkles`).

## 10. About — Advisory Board (global, 16+ members)
Add a structured `advisoryBoard` array with **16 members across tiers** (Founding Advisors, Strategic Advisors, Regional Partners, Industry Experts), each with name, role, company, country, photo placeholder, LinkedIn URL. **Sunny Ahlawat (California)** included with provided LinkedIn. Members span US, India, UK, Singapore, UAE, Germany, Canada, Australia, Japan, Brazil.

## 11. Grants & Funding fixes
- Embed YouTube video `https://www.youtube.com/watch?v=RFN47c9HZAc` (responsive iframe).
- Wire **Apply** button → opens `ApplicationDialog` with `program="grants"`.
- Replace section icons with theme-consistent lucide icons (`Coins`, `Landmark`, `HandCoins`, `PiggyBank`, `Award`).

## 12. Footer phone number
Update phone to a new number — **please confirm the number to use** (placeholder: `+1 (415) 555-0142`).

## 13. Startup Directory — global
- Add **country dropdown filter** (All, USA, India, UK, Singapore, UAE, Germany, Canada, etc.).
- Replace "India's biggest challenges" copy with **global** framing.
- Seed 30+ global startups via migration (US, EU, APAC, MENA).
- Make **Load More** functional (paginate 9 at a time from the dataset).
- Admin Dashboard → `StartupManagement.tsx` gains `country`, `region`, `headquarters` fields with country picker.

## 14. Incubation program
Strip all emoticons; swap for lucide icons.

---

## Technical notes
- DB migrations needed: extend `partners` columns; new `startups` table OR extend existing seed; optional `blogs`/`news` tables if not already present.
- New files: `src/lib/currency.ts`, `src/contexts/CurrencyContext.tsx`, `src/components/Money.tsx`, `src/components/CurrencySelector.tsx`, `src/data/advisoryBoard.ts`, `src/data/globalStartups.ts`.
- Analytics: track `currency_changed`, `partner_viewed`, `startup_filter_country`, `page_not_found`.

---

## Suggested shipping order
1. Branding + 404 + footer phone + emoticon sweep (quick wins).
2. Currency system + USD conversion.
3. Partners expansion (DB + carousel + details).
4. About advisory board.
5. Grants page fixes + Hackathon 2026 + Investor Centre refresh.
6. Startup Directory global + admin updates.
7. News/Blogs content refresh.

---

## Questions before I start
1. **Footer phone** — which number should I use?
2. **Currency selector** — OK to default USD with INR/EUR/GBP/SGD options, using static FX rates (no live API)?
3. **Startup Directory data** — happy with curated seed data (30+ real, well-known global startups), or do you want a CSV/list from you?
4. **News/Blogs** — is content currently in the DB or static files? Want me to author new articles, or just placeholders for your team to fill?

Reply with answers + which package you'd like me to ship first (or "all in order").
