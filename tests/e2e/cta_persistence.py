"""
E2E: verify stateful CTAs transition to acted state and PERSIST after reload.

Covers:
- Connect (Startup Directory) -> "Request Sent"
- Get Introduction / Request Introduction (Investor Centre) -> "Request Sent"
- Apply (via ApplicationDialog): simulate the acted state by seeding the same
  localStorage key the app writes on successful submit, then confirm the
  trigger renders as "Applied" and remains after reload. (Full submit needs
  auth; the persistence contract is what we're validating.)

Run: python tests/e2e/cta_persistence.py
"""
from __future__ import annotations
import asyncio, json
from pathlib import Path
from playwright.async_api import async_playwright, expect

BASE = "http://localhost:8080"
SHOTS = Path(__file__).parent / "screenshots" / "cta"
SHOTS.mkdir(parents=True, exist_ok=True)


async def clear_cta_state(page):
    await page.evaluate("localStorage.removeItem('cta-state:v1')")


async def assert_persists_after_reload(page, url, acted_locator, label_shot):
    # visible now
    await expect(acted_locator).to_be_visible(timeout=5000)
    await page.screenshot(path=str(SHOTS / f"{label_shot}_pre_reload.png"))
    await page.reload(wait_until="domcontentloaded")
    await page.goto(url, wait_until="domcontentloaded")
    await expect(acted_locator).to_be_visible(timeout=5000)
    await page.screenshot(path=str(SHOTS / f"{label_shot}_post_reload.png"))


async def test_connect_startup_directory(page):
    url = f"{BASE}/startup-directory"
    await page.goto(url, wait_until="domcontentloaded")
    await clear_cta_state(page)
    await page.goto(url, wait_until="domcontentloaded")
    # First Connect button
    connect = page.get_by_role("button", name="Connect").first
    await expect(connect).to_be_visible(timeout=10000)
    await connect.click()
    sent = page.get_by_role("button", name="Request Sent").first
    await assert_persists_after_reload(page, url, sent, "startup_connect")
    print("OK: Startup Directory Connect persists")


async def test_investor_centre_intros(page):
    url = f"{BASE}/investor-centre"
    await page.goto(url, wait_until="domcontentloaded")
    await clear_cta_state(page)
    await page.goto(url, wait_until="domcontentloaded")
    intro = page.get_by_role("button", name="Get Introduction").first
    await expect(intro).to_be_visible(timeout=10000)
    await intro.click()
    sent = page.get_by_role("button", name="Request Sent").first
    await assert_persists_after_reload(page, url, sent, "investor_intro")
    print("OK: Investor Centre Get Introduction persists")


async def test_apply_persists(page):
    # Seed the persistence key the ApplicationDialog writes on successful submit
    # (`apply:${program}`), then verify the trigger renders as "Applied".
    url = f"{BASE}/xi-lab"
    await page.goto(url, wait_until="domcontentloaded")
    await clear_cta_state(page)
    seed = {"apply:Xi Lab": {"at": 1}}
    await page.evaluate(
        f"localStorage.setItem('cta-state:v1', {json.dumps(json.dumps(seed))})"
    )
    await page.goto(url, wait_until="domcontentloaded")
    applied = page.get_by_role("button", name="Applied").first
    await assert_persists_after_reload(page, url, applied, "apply_state")
    print("OK: Apply -> Applied badge persists")


async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await ctx.new_page()
        page.on("pageerror", lambda e: print("pageerror:", e))
        try:
            await test_connect_startup_directory(page)
            await test_investor_centre_intros(page)
            await test_apply_persists(page)
            print("\nALL CTA PERSISTENCE TESTS PASSED")
        finally:
            await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
