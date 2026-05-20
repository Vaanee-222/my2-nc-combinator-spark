import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

// Eager-loaded core routes
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Lazy-loaded routes for code-splitting
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Hackathon = lazy(() => import("./pages/Hackathon"));
const HackathonDetail = lazy(() => import("./pages/HackathonDetail"));
const Incubation = lazy(() => import("./pages/Incubation"));
const MVPLab = lazy(() => import("./pages/MVPLab"));
const INCLab = lazy(() => import("./pages/INCLab"));
const Resources = lazy(() => import("./pages/Resources"));
const Partnership = lazy(() => import("./pages/Partnership"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Contact = lazy(() => import("./pages/Contact"));
const StartupDashboard = lazy(() => import("./pages/StartupDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const InvestorDashboard = lazy(() => import("./pages/InvestorDashboard"));
const MentorDashboard = lazy(() => import("./pages/MentorDashboard"));
const StartupDirectory = lazy(() => import("./pages/StartupDirectory"));
const StartupProfile = lazy(() => import("./pages/StartupProfile"));
const Deals = lazy(() => import("./pages/Deals"));
const Blogs = lazy(() => import("./pages/Blogs"));
const News = lazy(() => import("./pages/News"));
const MeetCofounder = lazy(() => import("./pages/MeetCofounder"));
const InvestorCentre = lazy(() => import("./pages/InvestorCentre"));
const InvestorProfile = lazy(() => import("./pages/InvestorProfile"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const RequirementsDetail = lazy(() => import("./pages/RequirementsDetail"));
const CurrentCohort = lazy(() => import("./pages/CurrentCohort"));
const FeaturedStartups = lazy(() => import("./pages/FeaturedStartups"));
const Philosophy = lazy(() => import("./pages/Philosophy"));
const AllApplications = lazy(() => import("./pages/AllApplications"));
const ProgramDetails = lazy(() => import("./pages/ProgramDetails"));
const ConsultationBooking = lazy(() => import("./pages/ConsultationBooking"));
const SuccessStories = lazy(() => import("./pages/SuccessStories"));
const BecomeMentor = lazy(() => import("./pages/BecomeMentor"));
const PastEvents = lazy(() => import("./pages/PastEvents"));
const CloudCredits = lazy(() => import("./pages/CloudCredits"));
const GrantsFunding = lazy(() => import("./pages/GrantsFunding"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const CofounderDashboard = lazy(() => import("./pages/CofounderDashboard"));
const Subscription = lazy(() => import("./pages/Subscription"));
const AIAgents = lazy(() => import("./pages/AIAgents"));
const Messages = lazy(() => import("./pages/Messages"));
const Partners = lazy(() => import("./pages/Partners"));


// Prefetch /startup-advisor chunk on idle
if (typeof window !== "undefined") {
  const prefetchAdvisor = () => import("./pages/AIAgents");
  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(prefetchAdvisor);
  } else {
    setTimeout(prefetchAdvisor, 2000);
  }
}

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground text-sm">Loading…</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/hackathon" element={<Hackathon />} />
              <Route path="/hackathon/:id" element={<HackathonDetail />} />
              <Route path="/hackathon-detail/:id" element={<HackathonDetail />} />
              <Route path="/incubation" element={<Incubation />} />
              <Route path="/mvp-lab" element={<MVPLab />} />
              <Route path="/inclab" element={<INCLab />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/partnership" element={<Partnership />} />
              <Route path="/partners" element={<Partners />} />

              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/requirements" element={<RequirementsDetail />} />
              <Route path="/startup-directory" element={<StartupDirectory />} />
              <Route path="/startup-profile/:id" element={<StartupProfile />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/news" element={<News />} />
              <Route path="/meet-cofounder" element={<MeetCofounder />} />
              <Route path="/investor-centre" element={<InvestorCentre />} />
              <Route path="/investor-profile/:id" element={<InvestorProfile />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/current-cohort" element={<CurrentCohort />} />
              <Route path="/featured-startups" element={<FeaturedStartups />} />
              <Route path="/philosophy" element={<Philosophy />} />
              <Route path="/all-applications" element={<AllApplications />} />
              <Route path="/program-details" element={<ProgramDetails />} />
              <Route path="/consultation-booking" element={<ConsultationBooking />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/become-mentor" element={<BecomeMentor />} />
              <Route path="/past-events" element={<PastEvents />} />
              <Route path="/cloud-credits" element={<CloudCredits />} />
              <Route path="/grants-funding" element={<GrantsFunding />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/startup-advisor" element={<AIAgents />} />
              <Route path="/messages" element={<Messages />} />

              {/* Protected dashboard routes */}
              <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/startup-dashboard" element={<ProtectedRoute allowedRoles={["startup"]}><StartupDashboard /></ProtectedRoute>} />
              <Route path="/investor-dashboard" element={<ProtectedRoute allowedRoles={["investor"]}><InvestorDashboard /></ProtectedRoute>} />
              <Route path="/mentor-dashboard" element={<ProtectedRoute allowedRoles={["mentor"]}><MentorDashboard /></ProtectedRoute>} />
              <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
              <Route path="/cofounder-dashboard" element={<ProtectedRoute allowedRoles={["cofounder"]}><CofounderDashboard /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
