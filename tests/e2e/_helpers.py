"""
Shared helpers for Playwright e2e scripts.

- unique_email(prefix): stable-format, collision-free email for a run.
- cleanup_test_data(): removes rows created by any e2e run (emails ending in
  @e2e.test) from public tables + auth.users so repeat CI runs never collide.

Cleanup uses the sandbox's preconfigured psql env (PGHOST/PGUSER/etc). If those
aren't set (e.g. running locally without db access), cleanup is a no-op and
prints a warning instead of failing the test.
"""
from __future__ import annotations
import os, subprocess, time, uuid

TEST_DOMAIN = "e2e.test"

def unique_email(prefix: str) -> str:
    return f"{prefix}-{int(time.time())}-{uuid.uuid4().hex[:6]}@{TEST_DOMAIN}"

def _psql(sql: str) -> tuple[int, str]:
    if not os.environ.get("PGHOST"):
        return (0, "skipped: no PGHOST")
    try:
        r = subprocess.run(
            ["psql", "-v", "ON_ERROR_STOP=1", "-tAc", sql],
            capture_output=True, text=True, timeout=30,
        )
        return (r.returncode, (r.stdout or "") + (r.stderr or ""))
    except FileNotFoundError:
        return (0, "skipped: psql not installed")

def cleanup_test_data(email_like: str = f"%@{TEST_DOMAIN}") -> str:
    """Purge all e2e-created rows. Safe/idempotent."""
    stmts = [
        f"DELETE FROM public.inclab_applications WHERE email ILIKE '{email_like}';",
        f"DELETE FROM public.applications WHERE user_id IN (SELECT id FROM auth.users WHERE email ILIKE '{email_like}');",
        f"DELETE FROM public.hackathon_registrations WHERE email ILIKE '{email_like}';",
        f"DELETE FROM public.incubation_applications WHERE email ILIKE '{email_like}';",
        f"DELETE FROM public.user_roles WHERE user_id IN (SELECT id FROM auth.users WHERE email ILIKE '{email_like}');",
        f"DELETE FROM public.profiles WHERE email ILIKE '{email_like}';",
        f"DELETE FROM auth.users WHERE email ILIKE '{email_like}';",
    ]
    logs = []
    for s in stmts:
        code, out = _psql(s)
        logs.append(f"[{code}] {s.strip()[:80]} -> {out.strip()[:120]}")
    return "\n".join(logs)


if __name__ == "__main__":
    print(cleanup_test_data())
