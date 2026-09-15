# End-to-end QA and production-readiness audit

## Goal
Validate the complete Xi Combinator experience across public pages, authentication, role dashboards, admin operations, database-backed forms, and responsive layouts. Record every reproducible issue with severity and evidence, and fix only confirmed regressions that block core workflows or compromise access control/data integrity.

## Test coverage

### Public experience
- Smoke-test every registered public route, dynamic detail page, global search result, navigation link, footer link, SEO title/canonical, 404 state, and currency selector.
- Exercise public forms with valid, invalid, duplicate, and boundary-length inputs; verify useful feedback and persistence where test-safe.
- Check desktop, tablet, and mobile layouts for overflow, overlap, clipped controls, and unusable dialogs.

### Authentication and access
- Test registration, sign-in, sign-out, reset-password entry points, unauthenticated redirects, and post-login navigation behavior.
- Verify each role can reach only its allowed dashboard and that public navigation is hidden after sign-in.
- Confirm sensitive records remain scoped to the owning user and admin-only screens reject non-admin roles.

### Role dashboards
- Cover startup, investor, mentor, co-founder, and user dashboards: overview, profile/settings, notifications, applications, deals, messaging, advisor/mentor workflows, and role-specific CRUD.
- Verify loading, empty, success, error, confirmation, and persistence states across tab switches and reloads.

### Admin workflows
- Test admin navigation, role-based tab visibility, search/filter/export, CRUD dialogs, application stage changes, inbox review, bulk actions, audit history, CMS publishing, points adjustments, and cloud-credit approvals.
- Use rollback-safe confirmation checks by default. Mutating tests will create uniquely identified test records and remove only those records afterward.

### Platform services
- Inspect browser console and failed network requests during each flow.
- Run the unit suite, existing Playwright scripts, access-policy checks, and production build diagnostics.
- Verify analytics calls for page views, application events, and cohort announcements without asserting against private analytics data.

## Deliverables
- A QA report in `docs/END_TO_END_QA_REPORT.md` listing each test case, result, severity, evidence, affected route, and recommended fix.
- Updated safe Playwright coverage for repeatable gaps discovered during the audit.
- Targeted fixes for confirmed critical/high regressions within the current scope, followed by focused retesting.
- A final release-readiness summary with passed, failed, blocked, and deferred counts.

## Safety and execution details
- No destructive testing against existing user or business records.
- Test-created accounts and rows use unique identifiers and are cleaned up when backend access permits.
- Authenticated tests use an approved managed test session; if a required role has no test identity, that case is marked blocked rather than bypassed.
- Findings outside core workflow regressions are documented rather than expanded into unrelated feature work.
