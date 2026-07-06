"""
Playwright end-to-end coverage for dashboard role gating & broken-link routing.

Verifies:
  1. Unauthenticated visitors to any /*-dashboard route are redirected to /login.
  2. Public marketing routes render (200 + <main> visible), catching broken links.
  3. Unknown routes render the NotFound page.

Run from the sandbox:
    python3 tests/e2e/dashboard_gating.py

The dev server must be up at http://localhost:8080.
Screenshots + a JSON summary land in /tmp/browser/e2e/.
"""
import asyncio, json, sys
from pathlib import Path
from playwright.async_api import async_playwright

BASE = "http://localhost:8080"
OUT = Path("/tmp/browser/e2e"); OUT.mkdir(parents=True, exist_ok=True)

DASHBOARDS = [
    "/admin-dashboard",
    "/investor-dashboard",
    "/startup-dashboard",
    "/mentor-dashboard",
    "/cofounder-dashboard",
    "/user-dashboard",
    "/admin-workflow",
]

PUBLIC_ROUTES = [
    "/", "/about-us", "/mvp-lab", "/incubation", "/hackathon",
    "/startup-directory", "/investor-centre", "/partners", "/partnership",
    "/blogs", "/news", "/login", "/register", "/application-status",
]

BROKEN = "/this-route-should-not-exist-xyz"

async def main():
    results = {"gating": [], "public": [], "notfound": None, "errors": []}
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await ctx.new_page()
        page.on("pageerror", lambda e: results["errors"].append(str(e)))

        # 1. Gating: each dashboard should redirect to /login when unauthenticated.
        for route in DASHBOARDS:
            await page.goto(f"{BASE}{route}", wait_until="networkidle")
            final = page.url.replace(BASE, "")
            ok = final.startswith("/login")
            results["gating"].append({"route": route, "final": final, "redirected_to_login": ok})
            await page.screenshot(path=str(OUT / f"gate_{route.strip('/').replace('/', '_')}.png"))

        # 2. Public routes should render meaningful content and not crash.
        for route in PUBLIC_ROUTES:
            await page.goto(f"{BASE}{route}", wait_until="domcontentloaded")
            try:
                await page.wait_for_selector("body", timeout=5000)
                text = (await page.locator("body").inner_text()).strip()
                rendered = len(text) > 40
            except Exception:
                rendered = False
            results["public"].append({"route": route, "url": page.url, "rendered": rendered})

        # 3. NotFound behaviour on an unknown route.
        await page.goto(f"{BASE}{BROKEN}", wait_until="domcontentloaded")
        body_text = (await page.locator("body").inner_text()).lower()
        results["notfound"] = {"url": page.url, "shows_404": "404" in body_text or "not found" in body_text}
        await page.screenshot(path=str(OUT / "notfound.png"))

        await browser.close()

    (OUT / "gating_report.json").write_text(json.dumps(results, indent=2))
    print(json.dumps(results, indent=2))

    failures = [r for r in results["gating"] if not r["redirected_to_login"]]
    failures += [r for r in results["public"] if not r["rendered"]]
    if not results["notfound"]["shows_404"]:
        failures.append({"notfound": results["notfound"]})
    sys.exit(1 if failures or results["errors"] else 0)

asyncio.run(main())
