# End-to-End Playwright Tests

Python Playwright scripts that exercise `http://localhost:8080`. Chromium is
preinstalled in the sandbox — no `pip install` needed.

## Shared helpers — `_helpers.py`
- `unique_email(prefix)` — collision-free `<prefix>-<ts>-<uuid>@e2e.test`.
- `cleanup_test_data()` — deletes every row created by any e2e run (emails
  ending in `@e2e.test`) from `inclab_applications`, `applications`,
  `hackathon_registrations`, `incubation_applications`, `user_roles`,
  `profiles`, and `auth.users`. Uses the sandbox's preconfigured `psql` env;
  no-ops with a warning when `PGHOST` is unset.

Run cleanup on demand:
```bash
python3 tests/e2e/_helpers.py
```

Every test script below calls cleanup automatically on exit, so repeated CI
runs never collide with existing users, applications, or sessions.

## Scripts

### `dashboard_gating.py`
Route-gating smoke test. No auth required. Exit `0` on success.

### `full_flow.py`
`register → login → application submission → admin stage update → audit trail`.
Applicant email is per-run unique; test data is purged on exit.
```bash
ADMIN_EMAIL=... ADMIN_PASSWORD=... python3 tests/e2e/full_flow.py
```

### `inclab_flow.py`
Registers a fresh applicant, submits the Xi Lab (INClab) form from `/xi-lab`,
then logs in as admin and verifies the application shows up in the admin
queue.
```bash
ADMIN_EMAIL=... ADMIN_PASSWORD=... python3 tests/e2e/inclab_flow.py
```

### `bulk_actions.py`
Covers admin bulk approve/reject on Applications and activate/deactivate on
Users, including confirmation dialog surfacing. Read-only by default (opens
the confirmation dialog and cancels — rollback-safe). Set
`ADMIN_APPLY_BULK=1` to actually confirm the action.
```bash
ADMIN_EMAIL=... ADMIN_PASSWORD=... python3 tests/e2e/bulk_actions.py
# destructive mode
ADMIN_APPLY_BULK=1 ADMIN_EMAIL=... ADMIN_PASSWORD=... python3 tests/e2e/bulk_actions.py
```

Screenshots + `summary.json` land in `/tmp/browser/e2e/<script>/`.
