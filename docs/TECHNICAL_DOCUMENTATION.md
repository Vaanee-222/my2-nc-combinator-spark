
# Inc Combinator — Technical Documentation

## Version 3.0.0 — Full-Stack Platform with AI Agents, Analytics & Real-Time Messaging

**Preview URL**: https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app  
**Lovable Project ID**: `0cfa7671-4b3f-4f1c-9d5c-fa406e419cde`

---

## Architecture Overview

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript 5, Vite 5 |
| Styling | Tailwind CSS v3 + custom HSL design tokens |
| UI Components | shadcn/ui (Radix primitives) |
| State Management | React Context (Auth), TanStack React Query |
| Routing | React Router v6 with role-based guards |
| Charts | Recharts |
| Backend | Lovable Cloud (PostgreSQL, Auth, RLS, Edge Functions, Realtime) |
| AI Gateway | Lovable AI — google/gemini-2.5-flash (no API key required) |

### Key Libraries

| Package | Purpose |
|---------|---------|
| `react-hook-form` + `zod` | Form validation |
| `@tanstack/react-query` | Server state & caching |
| `recharts` | Analytics charts |
| `lucide-react` | Icon system |
| `sonner` | Toast notifications |
| `date-fns` | Date formatting |
| `@supabase/supabase-js` | Backend SDK |

---

## Authentication System

### Auth Flow

| Step | Description | URL |
|------|-------------|-----|
| Register | Email/password + role selection | [`/register`](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/register) |
| Login | Email/password with demo quick-fill buttons | [`/login`](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/login) |
| Forgot Password | Email reset link | [`/forgot-password`](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/forgot-password) |
| Reset Password | Set new password via token | [`/reset-password`](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/reset-password) |

- **Profile auto-creation**: DB trigger `handle_new_user()` inserts into `profiles` on signup
- **Role assignment**: Inserted into `user_roles` during registration
- **Session**: Persisted in localStorage, auto-refreshed via `onAuthStateChange`
- **Protected routes**: `ProtectedRoute` component validates role against `allowedRoles` prop

### Roles (app_role enum)

| Role | Dashboard URL | Access Level |
|------|--------------|-------------|
| `admin` | [`/admin-dashboard`](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/admin-dashboard) | Full platform management, analytics, docs, health scoring |
| `startup` | [`/startup-dashboard`](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/startup-dashboard) | Application tracking, metrics, profile |
| `investor` | [`/investor-dashboard`](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/investor-dashboard) | Portfolio, blog management, settings |
| `mentor` | [`/mentor-dashboard`](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/mentor-dashboard) | Consultations, mentee tracking |
| `cofounder` | [`/cofounder-dashboard`](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/cofounder-dashboard) | Co-founder matching, events |

Role checking uses `has_role()` security-definer function to avoid RLS recursion.

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@incombinator.com` | `Demo@1234` |
| Startup | `startup@incombinator.com` | `Demo@1234` |
| Investor | `investor@incombinator.com` | `Demo@1234` |
| Mentor | `mentor@incombinator.com` | `Demo@1234` |
| Co-founder | `cofounder@incombinator.com` | `Demo@1234` |

Quick-fill buttons on the login page auto-populate credentials for each role.

---

## Database Schema

### Tables

| Table | Purpose | Key Columns | RLS |
|-------|---------|-------------|-----|
| `profiles` | User profiles (auto-created via trigger) | user_id, full_name, email, phone, city, bio, avatar_url | Public read; owner insert/update |
| `user_roles` | Role assignments (RBAC) | user_id, role (app_role enum) | Owner read; admin manage all |
| `applications` | Program applications | user_id, program, applicant_name, email, startup_name, description, status | Owner read; admin read/update; auth insert |
| `hackathon_registrations` | Hackathon signups | user_id, full_name, email, college, programming_languages, experience, status | Owner read; admin read/update; auth insert |
| `incubation_applications` | Incubation applications | user_id, founder_name, email, startup_name, industry, stage, team_size, funding_status, pitch_deck_url, status | Owner read; admin read/update; auth insert |
| `cofounder_requests` | Co-founder matching posts | user_id, title, description, skills_needed, equity_offered, commitment, location, contact_email, status | Public read; owner insert/update |
| `messages` | In-app messaging (realtime) | sender_id, receiver_id, content, is_read | Sender/receiver read; sender insert; receiver update |

### Database Functions

| Function | Type | Purpose |
|----------|------|---------|
| `has_role(_user_id, _role)` | SECURITY DEFINER | Check user role without RLS recursion |
| `handle_new_user()` | TRIGGER (on auth.users insert) | Auto-create profile on signup |
| `update_updated_at_column()` | TRIGGER | Auto-update `updated_at` timestamp |

### Realtime

- `messages` table is added to `supabase_realtime` publication for live chat updates

---

## Complete URL Map

### Public Pages

| Route | Component | Description | URL |
|-------|-----------|-------------|-----|
| `/` | Index | Landing page — Hero, Programs, Cohort, Footer | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/) |
| `/hackathon` | Hackathon | Hackathon program details + registration | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/hackathon) |
| `/hackathon/:id` | HackathonDetail | Individual hackathon detail | — |
| `/incubation` | Incubation | Incubation program details + application | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/incubation) |
| `/mvp-lab` | MVPLab | MVP Lab program page | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/mvp-lab) |
| `/inclab` | INCLab | INC Lab program page | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/inclab) |
| `/resources` | Resources | Resource downloads and guides | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/resources) |
| `/partnership` | Partnership | Partnership opportunities | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/partnership) |
| `/about` | AboutUs | About page with advisory board | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/about) |
| `/contact` | Contact | Contact form | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/contact) |
| `/meet-cofounder` | MeetCofounder | Co-founder matching | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/meet-cofounder) |
| `/startup-directory` | StartupDirectory | Browse startups | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/startup-directory) |
| `/startup-profile/:id` | StartupProfile | Individual startup profile | — |
| `/investor-centre` | InvestorCentre | Investor information | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/investor-centre) |
| `/investor-profile/:id` | InvestorProfile | Individual investor profile | — |
| `/deals` | Deals | Deal flow listing | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/deals) |
| `/blogs` | Blogs | Blog listing | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/blogs) |
| `/blog/:id` | BlogDetail | Individual blog post | — |
| `/news` | News | News listing | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/news) |
| `/success-stories` | SuccessStories | Success stories showcase | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/success-stories) |
| `/current-cohort` | CurrentCohort | Current cohort info | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/current-cohort) |
| `/featured-startups` | FeaturedStartups | Featured startups | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/featured-startups) |
| `/philosophy` | Philosophy | Platform philosophy | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/philosophy) |
| `/all-applications` | AllApplications | All applications view | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/all-applications) |
| `/program-details` | ProgramDetails | Program details | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/program-details) |
| `/consultation-booking` | ConsultationBooking | Book consultation | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/consultation-booking) |
| `/become-mentor` | BecomeMentor | Mentor signup | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/become-mentor) |
| `/past-events` | PastEvents | Past events archive | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/past-events) |
| `/cloud-credits` | CloudCredits | Cloud credits info | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/cloud-credits) |
| `/grants-funding` | GrantsFunding | Grants & funding | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/grants-funding) |
| `/subscription` | Subscription | Membership, Subscriptions & Services | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/subscription) |
| `/ai-agents` | AIAgents | AI startup advisors (VC, Lawyer, GTM, Buddy) | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/ai-agents) |
| `/messages` | Messages | In-app real-time messaging | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/messages) |
| `/privacy-policy` | PrivacyPolicy | Privacy policy | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/privacy-policy) |
| `/terms-conditions` | TermsConditions | Terms & conditions | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/terms-conditions) |
| `/requirements` | RequirementsDetail | Program requirements | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/requirements) |

### Auth Pages

| Route | Component | URL |
|-------|-----------|-----|
| `/login` | Login | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/login) |
| `/register` | Register | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/register) |
| `/forgot-password` | ForgotPassword | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/forgot-password) |
| `/reset-password` | ResetPassword | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/reset-password) |

### Protected Dashboards

| Route | Allowed Roles | Features | URL |
|-------|---------------|----------|-----|
| `/admin-dashboard` | admin | Programs, Applications, Users, Analytics, Health Score, Investors, Settings, Docs | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/admin-dashboard) |
| `/startup-dashboard` | startup | Application tracking, metrics, profile | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/startup-dashboard) |
| `/investor-dashboard` | investor | Portfolio, blog management, settings | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/investor-dashboard) |
| `/mentor-dashboard` | mentor | Consultations, mentee tracking | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/mentor-dashboard) |
| `/cofounder-dashboard` | cofounder | Matching, events | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/cofounder-dashboard) |
| `/user-dashboard` | any authenticated | General dashboard | [Open](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/user-dashboard) |

---

## AI Agents

**Route**: [`/ai-agents`](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/ai-agents)

| Agent | Persona | Use Cases |
|-------|---------|-----------|
| Mock VC / Angel | Simulates investor Q&A | Pitch practice, valuation feedback, fundraising strategy |
| AI Startup Lawyer | Legal advisor persona | Term sheets, equity splits, IP protection, compliance |
| GTM Adviser | Go-to-market strategist | Market entry, pricing, distribution, growth channels |
| Startup Buddy | General startup mentor | Ideation, team building, product-market fit, motivation |

**Backend**: Edge function `ai-agent-chat` → Lovable AI Gateway (google/gemini-2.5-flash)  
**Auth**: Requires authenticated user (sends `Authorization: Bearer <session_token>`)

---

## Analytics Dashboard (Admin)

**Location**: Admin Dashboard → "Analytics" tab

| Chart | Data Source | Visualization |
|-------|------------|---------------|
| 30-Day Application Trends | `applications.created_at` | Area chart |
| Status Distribution | `applications.status` | Bar chart |
| Program Conversion Rates | `applications` grouped by program | Bar chart |
| Hackathon Registrations | `hackathon_registrations` | Aggregated stats |
| Incubation Applications | `incubation_applications` | Aggregated stats |

---

## Startup Health Score (Admin)

**Location**: Admin Dashboard → "Health Score" tab

AI-powered assessment across 5 dimensions (each scored 0–100):

| Dimension | Evaluates |
|-----------|-----------|
| Market Opportunity | TAM, competition, timing |
| Team Strength | Founder experience, team composition |
| Product Readiness | MVP status, tech stack, user traction |
| Business Model | Revenue model, unit economics, scalability |
| Fundability | Pitch quality, metrics, investor readiness |

**Backend**: Edge function `startup-health-score` → Lovable AI Gateway

---

## In-App Messaging

**Route**: [`/messages`](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/messages)

- Real-time messaging via Supabase Realtime (postgres_changes)
- User search across all platform profiles
- Read receipts (is_read flag)
- Message icon in navigation bar
- RLS: users can only see messages they sent or received

---

## Subscription & Monetization

**Route**: [`/subscription`](https://id-preview--0cfa7671-4b3f-4f1c-9d5c-fa406e419cde.lovable.app/subscription)

### Tab 1 — Membership (Startup-only, Monthly)

| Tier | Price | Key Benefits |
|------|-------|-------------|
| Founder | $49/mo | Community access, webinars, directory listing |
| Scale-Up | $149/mo | Mentor matching, investor directory, pitch practice |
| Unicorn | $299/mo | Unlimited mentors, direct investor intros, deal room |

### Tab 2 — Subscription (All Users, Quarterly)

| Plan | Price | Key Benefits |
|------|-------|-------------|
| Starter | $999/qtr | 2 investor intros/mo, startup mixer access, MVP tech support (5h) |
| Growth | $1,399/qtr | 5 investor intros/mo, media coverage, legal due diligence, GTM consulting |
| Enterprise | $1,499/qtr | Unlimited intros, dedicated CTO advisor (20h), fundraising strategy, account manager |

### Tab 3 — Services (One-time)

| Service | Starting Price |
|---------|---------------|
| Pitch Deck Design | $500 |
| Market Research | $1,200 |
| Legal Advisory | $800 |
| Technical Consulting | $1,500 |

### Payment: Demo Test Gateway
- Pre-filled test card: `4242 4242 4242 4242`
- Simulated 2-second processing delay
- Success toast notification — no real charges

---

## Edge Functions

| Function | Endpoint | Purpose | Auth |
|----------|----------|---------|------|
| `ai-agent-chat` | `POST /functions/v1/ai-agent-chat` | AI agent conversations | Bearer token |
| `startup-health-score` | `POST /functions/v1/startup-health-score` | AI startup assessment | Bearer token |
| `seed-demo-data` | `POST /functions/v1/seed-demo-data` | Seed demo accounts & data | Bearer token |

---

## Security

### Row-Level Security (RLS)

All tables have RLS enabled. Summary:

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| profiles | Public | Owner | Owner | ✗ |
| user_roles | Owner | Admin | Admin | Admin |
| applications | Owner + Admin | Auth users | Admin | ✗ |
| hackathon_registrations | Owner + Admin | Auth users | Admin | ✗ |
| incubation_applications | Owner + Admin | Auth users | Admin | ✗ |
| cofounder_requests | Public | Owner | Owner | ✗ |
| messages | Sender + Receiver | Sender | Receiver | ✗ |

### Security Functions
- `has_role()` — SECURITY DEFINER to avoid infinite RLS recursion
- `handle_new_user()` — SECURITY DEFINER to write to profiles from auth trigger

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `25 95% 53%` (Orange/Saffron) | Buttons, accents, CTAs |
| `--background` | Dark theme base | Page backgrounds |
| `--card` | Elevated surface | Cards, panels |
| `--hero-gradient` | Custom gradient | Hero sections |
| `--card-gradient` | Custom gradient | Card backgrounds |
| `--orange-glow` | Box shadow | Hover effects |

- Semantic Tailwind classes only (`text-primary`, `bg-card`, etc.)
- Animations: fade-in, accordion, bounce
- Responsive: mobile-first with breakpoints at sm/md/lg/xl
- Unified footer across all pages with navigation links

---

## Component Architecture

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Navigation | `src/components/Navigation.tsx` | Global nav with auth state, role-based links, message icon |
| Footer | `src/components/Footer.tsx` | Unified footer with Programs, Services, Company, Legal links |
| ProtectedRoute | `src/components/ProtectedRoute.tsx` | Role-based route guard |
| AuthContext | `src/contexts/AuthContext.tsx` | Auth state provider with role management |
| AnalyticsDashboard | `src/components/dashboard/AnalyticsDashboard.tsx` | Recharts-based analytics |
| StartupHealthScore | `src/components/dashboard/StartupHealthScore.tsx` | AI health scoring UI |
| ApplicationManagement | `src/components/dashboard/ApplicationManagement.tsx` | Admin application CRUD |

### Admin Dashboard Tabs

| Tab | Component | Features |
|-----|-----------|----------|
| Overview | AdminOverview | Summary stats, recent activity |
| Startups | StartupManagement | Startup listing & management |
| Applications | ApplicationManagement | Filter, review, approve/reject applications |
| Analytics | AnalyticsDashboard | Charts: trends, status, conversions |
| Health Score | StartupHealthScore | AI-powered startup assessment |
| Investors | InvestorManagement | Investor relationship management |
| Programs | ProgramManagement | Program CRUD |
| Blogs | BlogManagement | Blog content management |
| Portfolio | PortfolioManagement | Portfolio company tracking |
| Settings | AdminSettings | Platform settings |
| Docs | DocumentationView | In-app technical documentation |

---

## File Structure (Key Directories)

```
src/
├── components/
│   ├── dashboard/          # Dashboard-specific components
│   ├── hackathon/          # Hackathon form sections
│   ├── incubation/         # Incubation form sections
│   ├── ui/                 # shadcn/ui components
│   ├── Navigation.tsx      # Global navigation
│   ├── Footer.tsx          # Global footer
│   └── ProtectedRoute.tsx  # Auth guard
├── contexts/
│   └── AuthContext.tsx      # Authentication provider
├── hooks/                   # Custom hooks
├── integrations/
│   └── supabase/           # Auto-generated client & types
├── pages/                   # All route pages (50+ pages)
└── lib/
    └── utils.ts            # Utility functions

supabase/
├── config.toml             # Project configuration
├── functions/
│   ├── ai-agent-chat/      # AI agent edge function
│   ├── startup-health-score/ # Health scoring edge function
│   └── seed-demo-data/     # Demo data seeder

docs/
├── TECHNICAL_DOCUMENTATION.md  # This file
└── PROJECT_DOCUMENTATION.md    # Project overview
```

---

## Environment Variables (Auto-managed)

| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Backend API URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public anon key |
| `VITE_SUPABASE_PROJECT_ID` | Project identifier |

Edge function secrets (server-side only):
- `LOVABLE_API_KEY` — AI Gateway access
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — Backend access

---

*Last updated: April 12, 2026*
