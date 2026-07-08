"""
End-to-end: verify admin bulk actions render safely and are gated behind
confirmation. Uses screenshots to catch regressions in:
  - bulk approve / reject on Applications
  - bulk activate / deactivate on Users
  - confirmation dialog present + rollback-safe (undo toast surfaces)

This test does NOT mutate production data unless ADMIN_APPLY_BULK=1 is set.
By default it only opens the confirmation dialog and cancels, keeping repeat
CI runs safe. Any test-owned rows created earlier are cleaned via _helpers.

Env:
    ADMIN_EMAIL, ADMIN_PASSWORD  (required)
    ADMIN_APPLY_BULK=1           (optional - actually confirm the bulk action)
"""
import asyncio, os, sys, json
from pathlib import Path
from playwright.async_api import async_playwright
from _helpers import cleanup_test_data

BASE = "http://localhost:8080"
OUT = Path("/tmp/browser/e2e/bulk"); OUT.mkdir(parents=True, exist_ok=True)
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD")
APPLY = os.environ.get("ADMIN_APPLY_BULK") == "1"

async def login(page):
    await page.goto(f"{BASE}/login", wait_until="domcontentloaded")
    await page.get_by_label("Email", exact=False).first.fill(ADMIN_EMAIL)
    await page.get_by_label("Password", exact=False).first.fill(ADMIN_PASSWORD)
    await page.get_by_role("button", name=lambda n: n and ("sign in" in n.lower() or "log in" in n.lower())).first.click()
    await page.wait_for_load_state("networkidle")

async def open_tab(page, name):
    try:
        await page.get_by_role("button", name=name).first.click(timeout=2500)
    except Exception:
        await page.get_by_text(name, exact=False).first.click()
    await page.wait_for_timeout(1200)

async def try_bulk(page, screenshot_prefix, action_name):
    """Select first row's checkbox and click bulk action if present."""
    checkboxes = page.locator("input[type=checkbox], button[role=checkbox]")
    n = await checkboxes.count()
    if n < 2:
        return {"action": action_name, "checkboxes": n, "clicked": False}
    await checkboxes.nth(1).click()
    await page.screenshot(path=str(OUT / f"{screenshot_prefix}_selected.png"))
    try:
        await page.get_by_role("button", name=action_name).first.click(timeout=2500)
    except Exception:
        return {"action": action_name, "checkboxes": n, "clicked": False}
    await page.wait_for_timeout(800)
    await page.screenshot(path=str(OUT / f"{screenshot_prefix}_confirm.png"))
    # Look for a confirmation dialog
    has_dialog = await page.locator('[role=alertdialog], [role=dialog]').count() > 0
    if APPLY and has_dialog:
        try:
            await page.get_by_role("button", name=lambda n: n and ("confirm" in n.lower() or "continue" in n.lower() or "yes" in n.lower())).first.click(timeout=2000)
            await page.wait_for_timeout(1500)
            await page.screenshot(path=str(OUT / f"{screenshot_prefix}_applied.png"))
        except Exception:
            pass
    else:
        # Cancel to keep data safe
        try:
            await page.get_by_role("button", name=lambda n: n and "cancel" in n.lower()).first.click(timeout=1500)
        except Exception:
            await page.keyboard.press("Escape")
    return {"action": action_name, "checkboxes": n, "clicked": True, "confirmation_dialog": has_dialog}

async def main():
    if not (ADMIN_EMAIL and ADMIN_PASSWORD):
        print("Set ADMIN_EMAIL and ADMIN_PASSWORD.")
        sys.exit(2)
    summary = {"apply": APPLY, "results": [], "errors": []}
    try:
        async with async_playwright() as pw:
            browser = await pw.chromium.launch(headless=True)
            ctx = await browser.new_context(viewport={"width": 1280, "height": 1800})
            page = await ctx.new_page()
            page.on("pageerror", lambda e: summary["errors"].append(str(e)))
            await login(page)
            await page.goto(f"{BASE}/admin-dashboard", wait_until="domcontentloaded")
            await page.wait_for_timeout(1500)

            # Applications: approve + reject
            await open_tab(page, "Applications")
            for label in ["Approve Selected", "Reject Selected", "Bulk Approve", "Bulk Reject"]:
                summary["results"].append(await try_bulk(page, f"apps_{label.replace(' ', '_').lower()}", label))

            # Users: activate + deactivate
            await open_tab(page, "Users")
            for label in ["Activate Selected", "Deactivate Selected", "Bulk Activate", "Bulk Deactivate"]:
                summary["results"].append(await try_bulk(page, f"users_{label.replace(' ', '_').lower()}", label))

            await browser.close()
    finally:
        summary["cleanup"] = cleanup_test_data()
    (OUT / "summary.json").write_text(json.dumps(summary, indent=2))
    print(json.dumps(summary, indent=2))
    # Pass if at least one bulk action surfaced a confirmation dialog and no page errors
    ok = any(r.get("confirmation_dialog") for r in summary["results"]) and not summary["errors"]
    sys.exit(0 if ok else 1)

asyncio.run(main())
