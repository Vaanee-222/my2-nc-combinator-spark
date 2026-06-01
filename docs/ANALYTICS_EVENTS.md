# Analytics Events — GA4 / GTM

All events fire to `window.dataLayer` and (when GA4 is configured) `gtag('event', ...)`.
Configure your **GA4 Measurement ID** and **GTM Container ID** in **Admin Dashboard → Header Scripts → Analytics IDs**.

## Setup
- Stored in `localStorage` keys: `ic_ga4_measurement_id`, `ic_gtm_container_id`
- Loaded on every page via `useAnalyticsPageViews()` in `App.tsx`
- No-op in development if IDs are not set

## Event reference

| Event name | When it fires | Payload |
|---|---|---|
| `page_view` | Every route change | `page_path`, `page_title`, `page_location` |
| `application_submitted` | Any application form succeeds | `program`, `startup_name` |
| `application_status_changed` | Admin updates a submission's status | `program`, `new_status` |
| `cohort_announcement_viewed` | Monthly Top 10 / Quarterly Top 5 page loads or filter changes | `cohort_type` (`monthly_top_10` / `quarterly_top_5`), `period` |
| `cohort_startup_clicked` | A startup card on a cohort page is clicked | `cohort_type`, `startup_id`, `startup_name` |
| `search_performed` | User types in global search (debounced 600ms) | `query`, `results_count` |
| `search_result_clicked` | User picks a search result | `query`, `result_path`, `result_title` |

## GTM recommended triggers
- Conversion: `application_submitted` → mark as conversion in GA4
- Engagement: `cohort_startup_clicked`, `search_result_clicked`
- Content reach: `cohort_announcement_viewed` → use `period` as custom dimension
