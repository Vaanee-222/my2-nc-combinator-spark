# End-to-End Playwright Tests

Python Playwright scripts that exercise the running app at `http://localhost:8080`.
The sandbox has Playwright + Chromium preinstalled — no `pip install` needed.

## Scripts

### `dashboard_gating.py`
Verifies every dashboard route (`/admin-dashboard`, `/investor-dashboard`,
`/startup-dashboard`, `/mentor-dashboard`, `/cofounder-dashboard`,
`/user-dashboard`, `/admin-workflow`) redirects unauthenticated users to
`/login`, that key public routes render `<main>`, and that unknown URLs render
the NotFound page. Also collects any uncaught page errors.

```bash
python3 tests/e2e/dashboard_gating.py
```

Exit code `0` on success. JSON report + screenshots land in `/tmp/browser/e2e/`.

### `full_flow.py`
Runs the full **register → login → application submission → admin stage
update → audit trail** journey via the `/admin-workflow` page.

Needs an existing admin account:

```bash
ADMIN_EMAIL=admin@example.com \
ADMIN_PASSWORD=... \
python3 tests/e2e/full_flow.py
```

A throwaway applicant `applicant-<timestamp>@e2e.test` is created each run.
Auth email confirmation must be OFF for the project (default in Lovable Cloud
dev). Screenshots + `summary.json` are written to
`/tmp/browser/e2e/full_flow/`.

## Adding to CI
These scripts exit non-zero on failure, so any CI runner that can launch
Chromium (`playwright install chromium`) can run them directly after `bun run
dev` is up on port 8080. Wire them in as post-build smoke steps alongside the
existing `vitest` suite.
