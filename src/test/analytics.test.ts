import { describe, it, expect, beforeEach } from "vitest";
import { initAnalytics, trackEvent, trackPageView, getAnalyticsIds } from "@/lib/analytics";

beforeEach(() => {
  localStorage.clear();
  (window as any).dataLayer = [];
});

describe("analytics wrapper", () => {
  it("TC-AN-01 initialises dataLayer and a gtag stub", () => {
    initAnalytics();
    expect(Array.isArray(window.dataLayer)).toBe(true);
    expect(typeof window.gtag).toBe("function");
  });

  it("TC-AN-02 reads GA4/GTM ids from storage and defaults to empty", () => {
    expect(getAnalyticsIds()).toEqual({ ga4: "", gtm: "" });
    localStorage.setItem("HEAD_GA4_ID", "G-TEST");
    expect(getAnalyticsIds().ga4).toBe("G-TEST");
  });

  it("TC-AN-03 pushes events to the dataLayer even when unconfigured (no crash)", () => {
    trackEvent("application_submitted", { program: "xi-lab" });
    expect(window.dataLayer.at(-1)).toMatchObject({ event: "application_submitted", program: "xi-lab" });
  });

  it("TC-AN-04 page views carry path and title", () => {
    document.title = "Xi Combinator";
    trackPageView("/xi-lab");
    expect(window.dataLayer.at(-1)).toMatchObject({ event: "page_view", page_path: "/xi-lab", page_title: "Xi Combinator" });
  });

  it("TC-AN-05 swallows errors from a broken dataLayer", () => {
    Object.defineProperty(window, "dataLayer", {
      configurable: true,
      get() { throw new Error("blocked"); },
    });
    expect(() => trackEvent("x")).not.toThrow();
    Object.defineProperty(window, "dataLayer", { configurable: true, writable: true, value: [] });
  });
});
