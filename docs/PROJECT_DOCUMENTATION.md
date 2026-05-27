# IC Combinator — Project Documentation

**Version**: 4.0.0
**Last Updated**: May 27, 2026
**Live Preview**: https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app

---

## 1. Executive Summary

IC Combinator (Inc Combinator) is a YC-inspired, India-rooted, globally-networked startup ecosystem platform. It connects **founders, investors, mentors, co-founders, and ecosystem partners** through a single full-stack product covering incubation, hackathons, AI advisory, real-time messaging, analytics, partner directories, and tiered monetization — all powered by Lovable Cloud (PostgreSQL, Auth, RLS, Edge Functions, Realtime, Storage).

---

## 2. Business Scope

### 2.1 Vision
Become the default operating system for early-stage founders in India and emerging markets — bridging local execution with a global support network across the Middle East, Europe, Asia, and North America.

### 2.2 Mission
- Lower the cost and time to launch a venture from idea → MVP → funded company.
- Provide on-demand expert advice (legal, GTM, VC, technical) through AI + human mentors.
- Connect founders with capital, talent, customers, and cross-border partners.
- Monetize through transparent memberships, subscriptions, and à-la-carte services.

### 2.3 Target Users

| Segment | Need addressed |
|---|---|
| Aspiring founders | Co-founder match, ideation, MVP Lab, mentorship |
| Early-stage startups | Incubation, investor intros, GTM, legal, fundraising |
| Investors | Curated deal flow, portfolio tracking, health scoring |
| Mentors / Advisors | Structured engagements, consultation booking |
| Ecosystem partners | Cross-region collaboration, co-branded programs |

### 2.4 Revenue Streams
1. **Membership tiers** (Startup) — Founder, Scale-Up, Unicorn (monthly).
2. **Subscriptions** (All users) — Starter, Growth, Enterprise (quarterly).
3. **One-time services** — Pitch decks, market research, legal & technical advisory.
4. **Partner programs** — Regional partners, accelerators, corporate sponsors.
5. **Event monetization** — Hackathons, demo days, mixers.

### 2.5 Differentiators
- AI-powered advisors (Mock VC, Lawyer, GTM, Buddy) at zero per-message cost via Lovable AI Gateway.
- AI startup health scoring across 5 dimensions for objective readiness.
- Cross-region partner network with a dedicated public Partners directory.
- Dynamic admin-managed content (Partners, Email templates, Header scripts, ACL, Configuration) — no code redeploys for everyday changes.

---

## 3. Feature List

### 3.1 Public / Marketing
- Homepage hero, philosophy, weekly showcase, program overview.
- Program pages: MVP Lab, INC Lab, Incubation, Hackathon (+ detail), Past Events.
- Discovery: Startup Directory, Featured Startups, Current Cohort, Success Stories.
- Knowledge: Blogs (+ detail), News (+ detail), Resources, Cloud Credits, Grants & Funding.
- Network: **Partners directory** with click-through **Partner detail modal** (logo, region, focus, full description, website link).
- Engagement: Partnership, Become a Mentor, Consultation Booking, About, Contact.
- Legal: Privacy Policy, Terms & Conditions, Requirements.

### 3.2 Authentication & RBAC
- Email/password signup, role selection at signup (admin, startup, investor, mentor, cofounder).
- Auto profile creation via `handle_new_user` trigger.
- Roles stored in dedicated `user_roles` table + `has_role()` security-definer function — no privilege escalation.
- Protected routes, password reset, session persistence.
- ACL Management UI in Admin Dashboard for role/feature mapping.

### 3.3 Applications & Forms
- Unified `ApplicationDialog` pattern reused across MVP Lab, INC Lab, Incubation, Hackathon, Cofounder, Pitch Submission, Investment, Startup Profile, Consultation.
- Tables: `applications`, `incubation_applications`, `hackathon_registrations`, `cofounder_requests`.
- Status lifecycle: pending → approved / rejected (admin-controlled).

### 3.4 Admin Dashboard
Tabs: Overview, Startups, Applications, Analytics, Health Score, Investors, Programs, Blogs, Portfolio, **Partners**, **Email**, **Configuration**, **ACL**, **Header Scripts**, **Users**, Settings, Docs.

### 3.5 Partners (NEW)
- Public `/partners` page grouped by region with hero, region cards, partner cards.
- **Partner detail modal** with logo, region context, focus note, full description, website CTA.
- Admin `PartnerManagement` to:
  - CRUD regions (name, flag emoji, description, sort order, active toggle).
  - CRUD partners (region, name, note, description, website URL).
  - **Upload partner logos** directly (image file → `partner-logos` public Storage bucket) or paste any URL.
  - Reorder via up/down controls; soft-disable via active toggle.

### 3.6 Email Management
- Templates for: Booking Confirmed, Verify Email, Welcome, Invoice, Application Status, Custom broadcasts.
- Admin trigger panel to send transactional or campaign emails per audience.

### 3.7 Configuration Panel
Categorized settings: General, Auth, AI Models, SMS/Email, Payments, API Keys — managed without code changes.

### 3.8 Header Scripts
Admin-managed `<head>` injection (GA4, GTM, Facebook Pixel quick presets + custom HTML) with strict sanitization whitelist (tags + attributes), `on*` and `javascript:` stripping, and live sanitized preview.

### 3.9 AI Advisory (Startup Advisor)
Route `/startup-advisor` (legacy `/ai-agents`) — 4 agents via `ai-agent-chat` edge function on Lovable AI Gateway (google/gemini-2.5-flash):
- Mock VC / Angel
- AI Startup Lawyer
- GTM Adviser
- Startup Buddy

### 3.10 Real-Time Messaging
- `/messages` page, Supabase Realtime channel on `messages` table.
- Inbox, user search, read receipts, unread badge in nav.

### 3.11 AI Startup Health Score
Admin tab. Edge function `startup-health-score` scores 5 dimensions 0–100: Market Opportunity, Team Strength, Product Readiness, Business Model, Fundability.

### 3.12 Analytics
Recharts: 30-day application trends, status distribution, program conversion rates, hackathon & incubation aggregates.

### 3.13 Monetization
`/subscription` page with Membership, Subscription, Services tiers. Mock payment dialog (test card `4242 4242 4242 4242`).

### 3.14 Reliability
- `ErrorBoundary` with retry UI, toast on trigger, HTTP-status-aware friendly messaging, automatic re-fetch (no full page reload) for transient 412 / preview infrastructure errors.
- Route-level code splitting (`React.lazy`) + prefetch for `/startup-advisor`.
- Vitest suite covering ErrorBoundary + route fallback.

---

## 4. URL List

### 4.1 Public
| Page | Path |
|---|---|
| Homepage | `/` |
| Hackathon | `/hackathon` |
| Hackathon Detail | `/hackathon/:id` |
| Incubation | `/incubation` |
| MVP Lab | `/mvp-lab` |
| INC Lab | `/inclab` |
| Resources | `/resources` |
| Partnership | `/partnership` |
| **Partners** | `/partners` |
| About Us | `/about` |
| Contact | `/contact` |
| Startup Directory | `/startup-directory` |
| Startup Profile | `/startup/:id` |
| Meet Co-founder | `/meet-cofounder` |
| Investor Centre | `/investor-centre` |
| Investor Profile | `/investor/:id` |
| Deals | `/deals` |
| Blogs / Detail | `/blogs`, `/blogs/:id` |
| News / Detail | `/news`, `/news/:id` |
| Success Stories | `/success-stories` |
| Current Cohort | `/current-cohort` |
| Featured Startups | `/featured-startups` |
| Philosophy | `/philosophy` |
| Cloud Credits | `/cloud-credits` |
| Grants & Funding | `/grants-funding` |
| Become a Mentor | `/become-mentor` |
| Past Events | `/past-events` |
| Consultation Booking | `/consultation-booking` |
| Program Details | `/program-details` |
| All Applications | `/all-applications` |
| Requirements | `/requirements` |
| Privacy Policy | `/privacy-policy` |
| Terms & Conditions | `/terms-conditions` |

### 4.2 Services & Tools
| Page | Path |
|---|---|
| Subscription & Pricing | `/subscription` |
| Startup Advisor (AI Agents) | `/startup-advisor` |
| Messages | `/messages` |

### 4.3 Authentication
| Page | Path |
|---|---|
| Login | `/login` |
| Register | `/register` |
| Forgot Password | `/forgot-password` |
| Reset Password | `/reset-password` |

### 4.4 Protected Dashboards
| Dashboard | Role | Path |
|---|---|---|
| Admin | admin | `/admin-dashboard` |
| Startup | startup | `/startup-dashboard` |
| Investor | investor | `/investor-dashboard` |
| Mentor | mentor | `/mentor-dashboard` |
| Co-founder | cofounder | `/cofounder-dashboard` |
| General User | any | `/user-dashboard` |

---

## 5. Demo Credentials
Password for all demo accounts: **`Demo@1234`**

| Role | Email |
|---|---|
| Admin | admin@incombinator.com |
| Startup | startup@incombinator.com |
| Investor | investor@incombinator.com |
| Mentor | mentor@incombinator.com |
| Co-founder | cofounder@incombinator.com |

---

## 6. Database Schema

| Table | Purpose |
|---|---|
| `profiles` | User profile (trigger-created) |
| `user_roles` | RBAC role assignments |
| `applications` | Generic program applications |
| `incubation_applications` | Incubation-specific applications |
| `hackathon_registrations` | Hackathon signups |
| `cofounder_requests` | Co-founder matching posts |
| `messages` | Realtime in-app messaging |
| `partner_regions` | Partner regions (name, flag, description, sort_order, active) |
| `partners` | Partner entries (region_id, name, note, description, website_url, logo_url, sort_order, active) |

**Storage buckets**: `partner-logos` (public — admin write via RLS).

All tables enforce RLS. Admin-only writes via `has_role(auth.uid(), 'admin')`. Messages restricted to sender/receiver.

---

## 7. Edge Functions
| Function | Purpose |
|---|---|
| `ai-agent-chat` | Multi-agent AI advisor chat (Lovable AI Gateway) |
| `startup-health-score` | 5-dimension AI scoring |
| `seed-demo-data` | Seed demo accounts and sample content |

---

## 8. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript 5 + Vite 5 |
| Styling | Tailwind CSS v3 + shadcn/ui (semantic tokens, dark mode + orange accents) |
| State | React Context + TanStack React Query |
| Routing | React Router v6 with `React.lazy` code-splitting |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Backend | Lovable Cloud (PostgreSQL, Auth, RLS, Edge Functions, Realtime, Storage) |
| AI | Lovable AI Gateway (google/gemini-2.5-flash) |
| Testing | Vitest + Testing Library |
| Notifications | Sonner |

---

## 9. Contact
- Development: dev@incombinator.com
- Business: business@incombinator.com
- Support: support@incombinator.com

*Mirrored in-app via Admin Dashboard → Docs tab.*
