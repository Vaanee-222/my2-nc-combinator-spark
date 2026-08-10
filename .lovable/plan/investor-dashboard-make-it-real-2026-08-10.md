# Investor Dashboard — make it real

Today the investor dashboard is almost entirely hardcoded demo data: profile, metrics, portfolio table, deal pipeline, new deals, analytics and settings are all static, and most buttons only fire a toast. This plan wires every tab to the database with working CRUD, matching the pattern already used in the Startup and Co-founder dashboards.

## What changes, tab by tab

### Overview header + metrics
- Investor identity and stats come from the signed-in user's investor profile instead of "Sarah Investment Capital".
- Total invested, portfolio value, avg ROI and success rate are computed from actual portfolio rows, not typed in.

### Portfolio
- Real table of holdings with Add / Edit / Remove, each saved to the database and scoped to the investor.
- Fields: company, sector, stage, invested amount, ownership %, current valuation, investment date, status (active / exited / written off), notes.
- Growth % and portfolio totals calculated automatically from invested vs current valuation.
- "Add startup to portfolio" picks from the live startup directory or accepts a manual entry.
- Search, status filter and CSV export.

### Deal Pipeline
- Kanban-style stage workflow: Sourced → Screening → Due Diligence → Term Sheet → Closed / Passed.
- "Add New Deal" opens a working form; stage changes update progress and are saved.
- Each deal card supports: view details, move stage, add reviewer notes, schedule call (existing consultation dialog), and convert a closed deal into a portfolio holding in one click.

### New Deals
- Replaces the two fake cards with live startups from the directory that are open to investment, plus incoming introduction requests addressed to this investor.
- Filters by sector and stage; "Review Deal" adds the startup into the pipeline at Sourced; "Learn More" opens the startup profile.

### Analytics
- Charts computed from the investor's own data: capital deployed over time, sector distribution, stage distribution, pipeline conversion funnel, portfolio value vs cost.
- Uses Recharts, consistent with the admin analytics tab.

### Settings
- Profile, investment preferences (check size range, sectors, stages, geography) and notification toggles persist to the database instead of resetting on reload.
- Working Change Password, and Download Investment History as CSV.

### Cross-cutting fixes
- Tab selection persists across reload/tab switching (same fix already applied to admin).
- Access restricted to investor and admin roles.
- All money values render through the shared currency component.
- Empty states and loading states everywhere instead of blank tables.

## Technical notes

New tables (all row-level-secured to the owning investor, with admin read):
- `investor_portfolio` — holdings: startup reference or manual name, sector, stage, amount_invested, ownership_pct, current_valuation, invested_on, status, notes.
- `investor_deals` — pipeline: company, sector, stage enum, progress, ask amount, revenue, team size, founded year, source, notes, linked startup id.
- `investor_preferences` — one row per investor: firm name, contact, bio, check size min/max, sectors[], stages[], geographies[], notification flags.

Front end:
- New `src/hooks/useInvestorData.ts` with React Query hooks (5-minute staleTime, matching the rest of the app).
- `PortfolioManagement.tsx` and `InvestorSettings.tsx` rewritten as DB-driven components; new `DealPipeline.tsx`, `NewDeals.tsx` and `InvestorAnalytics.tsx` under `src/components/dashboard/`.
- `InvestorDashboard.tsx` becomes a thin shell around those tabs with derived metrics.

## Out of scope
- No payment or cap-table integrations.
- Blog Management tab stays as-is.
