# Xi Combinator — Database Schema & Migration Guide

Last updated: 2026-09-04 · Backend: Lovable Cloud (PostgreSQL + RLS + Edge Functions)

A machine-generated dump of the whole `public` schema (types, tables, constraints, indexes,
grants, RLS policies, triggers and functions) is exported to `Xi-Combinator-Schema.sql`.
Regenerate it whenever a migration lands.

## Table inventory (47 tables)

| Domain | Tables |
|---|---|
| Identity & access | `profiles`, `public_profiles`, `user_roles`, `admin_audit_log`, `notification_reads`, `messages` |
| Applications & programs | `applications`, `inclab_applications`, `incubation_applications`, `hackathon_registrations`, `programs`, `cohort_startups` |
| Co-founder matching | `cofounder_requests`, `cofounder_applications` |
| Capital | `investors`, `investor_inquiries`, `investor_deals`, `investor_portfolio`, `investor_preferences`, `introduction_requests` |
| Mentorship | `mentor_profiles`, `mentorships`, `mentorship_requests`, `mentor_sessions`, `advisors` |
| Funding & perks | `grants`, `grant_applications`, `cloud_credit_requests`, `cloud_credit_ledger`, `deal_offers`, `deal_claims` |
| Engagement | `point_events`, `user_points`, `badges`, `user_badges`, `usage_counters` |
| Monetisation | `subscription_plans`, `subscription_purchases` |
| Content & CMS | `blogs`, `news`, `startups`, `partners`, `partner_regions`, `media_assets`, `site_settings`, `site_settings_versions` |
| Front desk | `contact_messages`, `consultation_bookings` |

## Core tables

| Table | Purpose | Key columns |
|---|---|---|
| `profiles` | User profile, auto-created on signup | `user_id`, `email`, `full_name`, `is_active` |
| `public_profiles` | Safe, non-PII projection used by public pages | `user_id`, `full_name`, `avatar_url` |
| `user_roles` | Role assignments (never on profiles) | `user_id`, `role` (`app_role` enum) |
| `applications` | Program applications | `program`, `status`, `review_notes` |
| `inclab_applications` | Xi Lab intake with admin review | `startup_name`, `stage`, `status`, `reviewed_by` |
| `incubation_applications` | Incubation intake | `startup_name`, `stage` |
| `hackathon_registrations` | Hackathon signups | `specialization`, `frameworks` |
| `cofounder_requests` | Co-founder matching posts | `status`, `review_status`, `review_notes`, `reviewed_at`, `reviewed_by` |
| `cofounder_applications` | Applications against a co-founder post | `request_id`, `applicant_id`, `status` |
| `introduction_requests` | Founder → investor intros | `investor_name`, `contact_email`, `status`, `admin_notes`, `reviewed_at` |
| `admin_audit_log` | Every admin create/update/delete/note | `admin_user_id`, `admin_email`, `action_type`, `table_name`, `record_id`, `details` |
| `partners`, `blogs`, `news`, `startups`, `programs` | Content & ecosystem | `slug`, `category`, SEO fields |
| `site_settings` | CMS branding/SEO with draft & version history | `logo_url`, `meta_title`, `draft_settings`, `has_draft` |

## Engagement & monetisation tables

| Table | Purpose | Key columns |
|---|---|---|
| `point_events` | Immutable XP ledger, unique on `(user_id, event_key, source_id)` | `role`, `event_key`, `points`, `source_table`, `source_id`, `awarded_at` |
| `user_points` | Materialised totals and level | `total_points`, `level`, `level_name` |
| `badges` / `user_badges` | Achievement catalogue and awards | `badge_key`, `criteria_event`, `threshold`, `awarded_at` |
| `usage_counters` | Per-user monthly quota counters | `counter_key`, `period_start`, `count` |
| `subscription_plans` | Audience-aware plan ladders | `audience`, `tier`, `category`, `price_usd`, `features` |
| `subscription_purchases` | Member purchases | `plan_name`, `status`, `purchased_at`, `expires_at` |
| `cloud_credit_ledger` | Allocations, redemptions and approvals | `entry_type`, `amount_usd`, `status`, `approved_by` |

Security-definer functions: `has_role`, `award_points`, `recalc_user_points`, `evaluate_badges`,
`level_for_points`, `monthly_leaderboard`, `public_gamification`, `admin_adjust_points`,
`admin_void_point_event`, `admin_points_directory`, `increment_usage_counter`, `handle_new_user`.
Triggers: `update_updated_at_column`, `tg_award_points`, `tg_award_session_points`,
`tg_evaluate_badges`, plus `validate_*` guards on co-founder applications, introduction
requests and investor inquiries.
See [GAMIFICATION_AND_SUBSCRIPTIONS.md](./GAMIFICATION_AND_SUBSCRIPTIONS.md) for the full model.


## Access rules (RLS summary)

- **Roles** live only in `user_roles` and are checked through the security-definer
  `public.has_role(uuid, app_role)` → `private.has_role(...)`. Never read roles client-side for authorization.
- `cofounder_requests`: anonymous visitors see only `review_status='approved' AND status='active'`;
  authenticated users can read all, owners can edit their own, admins can edit/delete anything.
- `introduction_requests`: requesters see their own rows; admins see and moderate all.
- `admin_audit_log`: insert + read restricted to admins.

## Migration workflow

Migrations run through the Lovable Cloud migration tool — you review the SQL before it executes.
Every new `public` table must follow this exact order:

```sql
-- 1. table
CREATE TABLE public.example (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. grants (required — RLS alone is not enough)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.example TO authenticated;
GRANT ALL ON public.example TO service_role;
-- GRANT SELECT ON public.example TO anon;  -- only for fully public data

-- 3. RLS
ALTER TABLE public.example ENABLE ROW LEVEL SECURITY;

-- 4. policies
CREATE POLICY "Owners manage their rows" ON public.example
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage all rows" ON public.example
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. updated_at trigger
CREATE TRIGGER update_example_updated_at
  BEFORE UPDATE ON public.example
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

## Useful commands

```sql
-- inspect a table
\d public.cofounder_requests

-- audit trail for one record
SELECT created_at, admin_email, action_type, details
FROM public.admin_audit_log
WHERE table_name = 'cofounder_requests' AND record_id = '<uuid>'
ORDER BY created_at DESC;

-- pending moderation counts
SELECT review_status, count(*) FROM public.cofounder_requests GROUP BY 1;
SELECT status, count(*) FROM public.introduction_requests GROUP BY 1;

-- email delivery attempts
SELECT created_at, details FROM public.admin_audit_log
WHERE table_name = 'email_notifications' ORDER BY created_at DESC LIMIT 50;
```

```bash
# CSV export of a single table (read-only tooling)
psql -c "\copy (SELECT * FROM public.cofounder_requests) TO 'cofounders.csv' CSV HEADER"
```

## Edge function secrets

| Secret | Used by | Required |
|---|---|---|
| `LOVABLE_API_KEY` | `ai-agent-chat`, `startup-health-score` | yes (auto-provisioned) |
| `RESEND_API_KEY` | `send-notification` | optional — without it emails are logged, not sent |
| `NOTIFY_FROM_EMAIL` | `send-notification` | optional sender override |
