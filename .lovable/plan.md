# Platform content consistency audit and corrections

## Goal
Make platform-wide figures, money labels, dates, and repeated claims agree across public pages, dashboards, forms, and the demo video without changing legitimate entity-specific data.

## Changes
- Establish `platformStats` as the canonical source for shared platform claims such as startups accelerated, funding raised, mentors, investors, countries, cohorts, and success rate.
- Replace contradictory hardcoded shared claims on the startup directory, success stories, investor centre, and other affected screens with canonical values or clearly scoped labels.
- Correct malformed and ambiguous money copy, including broken examples such as `$250Kores`; label financial form inputs as USD while preserving the global display-currency selector for converted display values.
- Keep startup-, investor-, grant-, deal-, and news-specific amounts intact where they describe a distinct record rather than a platform total.
- Align the Remotion demo statistics with the same canonical figures.
- Review database-published programs, cohorts, plans, grants, deals, and partner copy for obvious amount/date/status anomalies; correct only demonstrable inconsistencies.

## Quality safeguards
- Expand consistency tests to detect drift between canonical numeric values and display labels.
- Add source-level regression checks for malformed currency strings and conflicting hardcoded platform totals in key pages.
- Run the focused tests and verify the production build and representative public pages.

## Technical details
- Shared numeric values remain USD-based; user-facing reusable monetary values use the existing currency formatter where conversion is appropriate.
- Historical news/market figures and company-specific metrics remain explicitly scoped and are not forced to match platform totals.
- No schema changes are planned; database edits, if needed, will be limited to clearly inconsistent published content.
