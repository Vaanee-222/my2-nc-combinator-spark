// Lightweight GA4 + GTM event wrapper.
// HeaderScripts admin panel already injects the GA/GTM script tags themselves
// (keys HEAD_GA4_ID / HEAD_GTM_ID), so here we only:
//   - ensure window.dataLayer + gtag stub exist
//   - expose trackEvent() / trackPageView() that safely no-op when nothing is set

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

const GA_KEY = "HEAD_GA4_ID";
const GTM_KEY = "HEAD_GTM_ID";

export const getAnalyticsIds = () => ({
  ga4: (typeof window !== "undefined" && localStorage.getItem(GA_KEY)) || "",
  gtm: (typeof window !== "undefined" && localStorage.getItem(GTM_KEY)) || "",
});

let initialized = false;

export const initAnalytics = () => {
  if (initialized || typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments as any);
    };
  }
  initialized = true;
};

const isConfigured = () => {
  const { ga4, gtm } = getAnalyticsIds();
  return Boolean(ga4 || gtm);
};

export const trackEvent = (name: string, params: Record<string, any> = {}) => {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...params });
    if (window.gtag && isConfigured()) window.gtag("event", name, params);
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug("[analytics]", name, params);
    }
  } catch {
    /* swallow */
  }
};

export const trackPageView = (path: string, title?: string) => {
  trackEvent("page_view", {
    page_path: path,
    page_title: title || (typeof document !== "undefined" ? document.title : ""),
    page_location: typeof window !== "undefined" ? window.location.href : "",
  });
};
