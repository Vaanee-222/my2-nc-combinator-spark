// Lightweight GA4 + GTM wrapper. No-ops safely when not configured.
// IDs are read from localStorage so admin can paste them via the dashboard
// without redeploying.

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

const GA_KEY = "ic_ga4_measurement_id";
const GTM_KEY = "ic_gtm_container_id";

let initialized = false;

export const getAnalyticsIds = () => ({
  ga4: (typeof window !== "undefined" && localStorage.getItem(GA_KEY)) || "",
  gtm: (typeof window !== "undefined" && localStorage.getItem(GTM_KEY)) || "",
});

export const setAnalyticsIds = (ga4: string, gtm: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(GA_KEY, ga4.trim());
  localStorage.setItem(GTM_KEY, gtm.trim());
  // Re-init on next page load to keep things simple.
};

export const initAnalytics = () => {
  if (initialized || typeof window === "undefined") return;
  const { ga4, gtm } = getAnalyticsIds();
  if (!ga4 && !gtm) return;

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  (window as any).gtag = gtag;

  if (ga4) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${ga4}`;
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", ga4, { send_page_view: false }); // we send manually on route change
  }

  if (gtm) {
    const s = document.createElement("script");
    s.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`;
    document.head.appendChild(s);
  }

  initialized = true;
};

export const trackEvent = (name: string, params: Record<string, any> = {}) => {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...params });
    if (window.gtag) window.gtag("event", name, params);
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug("[analytics]", name, params);
    }
  } catch (e) {
    // swallow
  }
};

export const trackPageView = (path: string, title?: string) => {
  trackEvent("page_view", {
    page_path: path,
    page_title: title || (typeof document !== "undefined" ? document.title : ""),
    page_location: typeof window !== "undefined" ? window.location.href : "",
  });
};
