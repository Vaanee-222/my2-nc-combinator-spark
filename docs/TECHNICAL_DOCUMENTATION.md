
# Inc Combinator - Technical Documentation

## Version 2.0.0 - Lovable Cloud Integration & Real Authentication

### Architecture Overview

#### Tech Stack
- **Frontend**: React 18, TypeScript 5, Vite 5
- **Styling**: Tailwind CSS v3 with custom design tokens
- **UI Components**: shadcn/ui (Radix primitives)
- **State Management**: React Context (Auth), TanStack React Query
- **Routing**: React Router v6
- **Backend**: Lovable Cloud (Supabase) — PostgreSQL, Auth, RLS

---

## Authentication System

### Flow
- **Sign Up**: Email/password with role selection → profile auto-created via DB trigger → role inserted in `user_roles`
- **Sign In**: Email/password via Supabase Auth
- **Password Reset**: Email link → `/reset-password` page → `updateUser({ password })`
- **Session**: Persisted in localStorage, auto-refreshed via `onAuthStateChange`

### Roles (app_role enum)
- `admin` — Full platform management
- `startup` — Startup founder dashboard
- `investor` — Investment portfolio and blog management
- `mentor` — Mentorship and consultation management
- `cofounder` — Co-founder matching and event participation

Role checking uses `has_role()` security-definer function to avoid RLS recursion.

### Protected Routes
`ProtectedRoute` component wraps dashboard routes:
- Checks authentication status
- Validates user role against `allowedRoles` prop
- Redirects to correct dashboard if role mismatch
- Shows loading spinner during auth check

---

## Database Schema

### Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `profiles` | User profiles (auto-created) | full_name, email, phone, city, bio |
| `user_roles` | Role assignments | user_id, role |
| `applications` | Program applications | program, applicant_name, email, startup_name, description, status |
| `hackathon_registrations` | Hackathon signups | full_name, email, college, programming_languages, experience, status |
| `incubation_applications` | Incubation apps | founder_name, startup_name, industry, stage, team_size, funding_status |
| `cofounder_requests` | Co-founder posts | title, description, skills_needed, equity_offered, commitment, location |

### RLS Policies
- All tables have RLS enabled
- Users can view/edit their own data
- Admins can view/manage all submissions via `has_role()` function
- Insert requires authentication (`auth.uid() IS NOT NULL`)
- Profiles are publicly readable
- Cofounder requests are publicly readable

---

## Page Structure

### Public Pages
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Index | Landing page with Hero, Programs, Cohort |
| `/hackathon` | Hackathon | Hackathon program details |
| `/incubation` | Incubation | Incubation program details |
| `/mvp-lab` | MVPLab | MVP Lab program page |
| `/inclab` | INCLab | INC Lab program page |
| `/resources` | Resources | Resource downloads and guides |
| `/partnership` | Partnership | Partnership opportunities |
| `/about` | AboutUs | About page with advisory board |
| `/contact` | Contact | Contact form |
| `/meet-cofounder` | MeetCofounder | Co-founder matching |
| `/startup-directory` | StartupDirectory | Browse startups |
| `/investor-centre` | InvestorCentre | Investor information |
| `/blogs` | Blogs | Blog listing |
| `/news` | News | News listing |
| `/success-stories` | SuccessStories | Success stories |
| `/login` | Login | Authentication |
| `/register` | Register | User registration with role |
| `/forgot-password` | ForgotPassword | Password reset request |
| `/reset-password` | ResetPassword | Set new password |

### Protected Dashboards
| Route | Allowed Roles | Features |
|-------|---------------|----------|
| `/admin-dashboard` | admin | Program CRUD, user management, settings |
| `/startup-dashboard` | startup | Application tracking, metrics |
| `/investor-dashboard` | investor | Portfolio, blog management, settings |
| `/mentor-dashboard` | mentor | Consultations, mentee tracking |
| `/cofounder-dashboard` | cofounder | Matching, events |
| `/user-dashboard` | any authenticated | General dashboard |

---

## Subscription & Monetization

### Route: `/subscription`

Three-tab interface for platform monetization:

#### Tab 1 — Membership (Startup-only, Monthly)
| Tier | Price | Key Benefits |
|------|-------|-------------|
| Founder | $49/mo | Community access, webinars, directory listing |
| Scale-Up | $149/mo | Mentor matching, investor directory, pitch practice |
| Unicorn | $299/mo | Unlimited mentors, direct investor intros, deal room |

#### Tab 2 — Subscription (All Users, Quarterly)
| Plan | Price | Key Benefits |
|------|-------|-------------|
| Starter | $999/qtr | 2 investor intros/mo, mixer access, MVP tech support (5h) |
| Growth | $1,399/qtr | 5 investor intros/mo, media coverage, legal due diligence, GTM consulting |
| Enterprise | $1,499/qtr | Unlimited intros, dedicated CTO advisor (20h), fundraising strategy, account manager |

#### Tab 3 — Services (One-time)
| Service | Starting Price |
|---------|---------------|
| Pitch Deck Design | $500 |
| Market Research | $1,200 |
| Legal Advisory | $800 |
| Technical Consulting | $1,500 |

#### Payment: Demo Test Gateway
- Pre-filled test card (4242 4242 4242 4242)
- Simulated 2-second processing delay
- Success toast notification — no real charges

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@incombinator.com | Demo@1234 |
| Startup | startup@incombinator.com | Demo@1234 |
| Investor | investor@incombinator.com | Demo@1234 |
| Mentor | mentor@incombinator.com | Demo@1234 |
| Co-founder | cofounder@incombinator.com | Demo@1234 |

---

## Design System
- Dark theme with orange/saffron accent (`--primary: 25 95% 53%`)
- Custom tokens: `--hero-gradient`, `--card-gradient`, `--orange-glow`
- Semantic Tailwind classes only (`text-primary`, `bg-card`, etc.)
- Animations: fade-in, accordion, bounce
- Hero: clean underline accent on key phrase (no text glow)
