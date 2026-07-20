"""
End-to-end: register a fresh applicant, submit the Xi Lab (INClab)
application from /xi-lab, then log in as admin and confirm the application
appears in the admin queue (/admin-dashboard -> Xi Lab Apps tab, or via the
InclabApplications table). Cleans up test data on exit.

Env:
    ADMIN_EMAIL, ADMIN_PASSWORD  (required for the admin verification step)

Run:
    ADMIN_EMAIL=... ADMIN_PASSWORD=... python3 tests/e2e/inclab_flow.py
"""
import asyncio, os, sys, json
from pathlib import Path
from playwright.async_api import async_playwright
from _helpers import unique_email, cleanup_test_data

BASE = "http://localhost:8080"
OUT = Path("/tmp/browser/e2e/inclab"); OUT.mkdir(parents=True, exist_ok=True)

ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD")
EMAIL = unique_email("inclab")
PASSWORD = "Passw0rd!Passw0rd!"
FOUNDER = "INC Test Founder"
STARTUP = f"E2E Startup {EMAIL.split('@')[0]}"

async def fill_label(page, label, value):
    await page.get_by_label(label, exact=False).first.fill(value)

async def register(page):
    await page.goto(f"{BASE}/register", wait_until="domcontentloaded")
    await fill_label(page, "Full Name", FOUNDER)
    await fill_label(page, "Email", EMAIL)
    await fill_label(page, "Password", PASSWORD)
    await page.get_by_role("button", name=lambda n: n and ("sign up" in n.lower() or "register" in n.lower())).first.click()
    await page.wait_for_load_state("networkidle")
    await page.screenshot(path=str(OUT / "1_register.png"))

async def submit_inclab(page):
    await page.goto(f"{BASE}/xi-lab", wait_until="domcontentloaded")
    # Trigger the ApplicationDialog (any "Apply" button on the page)
    await page.get_by_role("button", name=lambda n: n and "apply" in n.lower()).first.click()
    await page.wait_for_selector('role=dialog', timeout=5000)
    await fill_label(page, "Founder Name", FOUNDER)
    await fill_label(page, "Email", EMAIL)
    await fill_label(page, "Startup Name", STARTUP)
    await fill_label(page, "Problem", "Founders can't validate ideas fast enough (e2e).")
    await fill_label(page, "Solution", "AI-assisted validation platform (e2e test).")
    await fill_label(page, "Target market", "Early-stage Indian founders (e2e).")
    await fill_label(page, "Why Xi Lab", "We want intense mentorship and capital (e2e).")
    await page.screenshot(path=str(OUT / "2_form_filled.png"))
    await page.get_by_role("button", name=lambda n: n and "submit" in n.lower()).first.click()
    await page.wait_for_timeout(2000)
    await page.screenshot(path=str(OUT / "3_submitted.png"))

async def verify_in_admin(page):
    await page.goto(f"{BASE}/login", wait_until="domcontentloaded")
    await page.evaluate("window.localStorage.clear()")
    await page.goto(f"{BASE}/login", wait_until="domcontentloaded")
    await fill_label(page, "Email", ADMIN_EMAIL)
    await fill_label(page, "Password", ADMIN_PASSWORD)
    await page.get_by_role("button", name=lambda n: n and ("sign in" in n.lower() or "log in" in n.lower())).first.click()
    await page.wait_for_load_state("networkidle")
    await page.goto(f"{BASE}/admin-dashboard", wait_until="domcontentloaded")
    await page.wait_for_timeout(1500)
    # Click Xi Lab Apps / Inclab tab if visible
    for name in ["Xi Lab Apps", "Inclab", "Applications"]:
        try:
            await page.get_by_role("button", name=name).first.click(timeout=1500)
            break
        except Exception:
            continue
    await page.wait_for_timeout(1500)
    await page.screenshot(path=str(OUT / "4_admin_queue.png"))
    body = (await page.locator("body").inner_text()).lower()
    return EMAIL.lower() in body or STARTUP.lower() in body

async def main():
    if not (ADMIN_EMAIL and ADMIN_PASSWORD):
        print("Set ADMIN_EMAIL and ADMIN_PASSWORD to run this test.")
        sys.exit(2)
    summary = {"email": EMAIL, "startup": STARTUP, "found_in_admin": False, "errors": []}
    try:
        async with async_playwright() as pw:
            browser = await pw.chromium.launch(headless=True)
            ctx = await browser.new_context(viewport={"width": 1280, "height": 1800})
            page = await ctx.new_page()
            page.on("pageerror", lambda e: summary["errors"].append(str(e)))
            await register(page)
            await submit_inclab(page)
            summary["found_in_admin"] = await verify_in_admin(page)
            await browser.close()
    finally:
        summary["cleanup"] = cleanup_test_data()
    (OUT / "summary.json").write_text(json.dumps(summary, indent=2))
    print(json.dumps(summary, indent=2))
    sys.exit(0 if summary["found_in_admin"] and not summary["errors"] else 1)

asyncio.run(main())
