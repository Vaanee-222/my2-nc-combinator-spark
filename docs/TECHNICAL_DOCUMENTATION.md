
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

## Key Components

### AuthContext (`src/contexts/AuthContext.tsx`)
Provides: `user`, `session`, `userRole`, `signUp`, `signIn`, `signOut`, `resetPassword`

### ProtectedRoute (`src/components/ProtectedRoute.tsx`)
Wraps routes requiring authentication. Supports `allowedRoles` prop.

### Navigation (`src/components/Navigation.tsx`)
Auth-aware navigation. Shows Dashboard/Logout when logged in.

### DB-Connected Form Dialogs
| Component | Saves To |
|-----------|----------|
| `ApplicationDialog` | `applications` |
| `HackathonRegistrationForm` | `hackathon_registrations` |
| `IncApplicationDialog` | `incubation_applications` |
| `CofounderPostDialog` | `cofounder_requests` |

---

## Design System
- Dark theme with orange/saffron accent (`--primary: 25 95% 53%`)
- Custom tokens: `--hero-gradient`, `--card-gradient`, `--orange-glow`
- Semantic Tailwind classes only (`text-primary`, `bg-card`, etc.)
- Animations: fade-in, accordion, bounce
- Hero: clean underline accent on key phrase (no text glow)
