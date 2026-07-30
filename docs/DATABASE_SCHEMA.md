# Xi Combinator — Database Schema & Migration Guide

Last updated: 2026-07-30 · Backend: Lovable Cloud (PostgreSQL + RLS + Edge Functions)

## Core tables

| Table | Purpose | Key columns |
|---|---|---|
| `profiles` | User profile, auto-created on signup | `user_id`, `email`, `full_name` |
| `user_roles` | Role assignments (never on profiles) | `user_id`, `role` (`app_role` enum) |
| `applications` | Program applications | `program_type`, `stage`, `review_notes` |
| `incubation_applications` | Incubation intake | `startup_name`, `stage` |
| `hackathon_registrations` | Hackathon signups | `team_name`, `skills` |
| `cofounder_requests` | Co-founder matching posts | `status`, `review_status`, `review_notes`, `reviewed_at`, `reviewed_by` |
| `introduction_requests` | Founder → investor intros | `investor_name`, `contact_email`, `status`, `admin_notes`, `reviewed_at` |
| `admin_audit_log` | Every admin create/update/delete/note | `admin_user_id`, `admin_email`, `action_type`, `table_name`, `record_id`, `details` |
| `partners`, `blogs`, `news`, `startups`, `programs` | Content & ecosystem | `slug`, `category`, SEO fields |

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
