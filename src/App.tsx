import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Hackathon from "./pages/Hackathon";
import HackathonDetail from "./pages/HackathonDetail";
import Incubation from "./pages/Incubation";
import MVPLab from "./pages/MVPLab";
import INCLab from "./pages/INCLab";
import Resources from "./pages/Resources";
import Partnership from "./pages/Partnership";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import StartupDashboard from "./pages/StartupDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import InvestorDashboard from "./pages/InvestorDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import StartupDirectory from "./pages/StartupDirectory";
import StartupProfile from "./pages/StartupProfile";
import Deals from "./pages/Deals";
import Blogs from "./pages/Blogs";
import News from "./pages/News";
import MeetCofounder from "./pages/MeetCofounder";
import InvestorCentre from "./pages/InvestorCentre";
import InvestorProfile from "./pages/InvestorProfile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import BlogDetail from "./pages/BlogDetail";
import RequirementsDetail from "./pages/RequirementsDetail";
import CurrentCohort from "./pages/CurrentCohort";
import FeaturedStartups from "./pages/FeaturedStartups";
import Philosophy from "./pages/Philosophy";
import AllApplications from "./pages/AllApplications";
import ProgramDetails from "./pages/ProgramDetails";
import ConsultationBooking from "./pages/ConsultationBooking";
import SuccessStories from "./pages/SuccessStories";
import BecomeMentor from "./pages/BecomeMentor";
import PastEvents from "./pages/PastEvents";
import CloudCredits from "./pages/CloudCredits";
import GrantsFunding from "./pages/GrantsFunding";
import UserDashboard from "./pages/UserDashboard";
import CofounderDashboard from "./pages/CofounderDashboard";
import Subscription from "./pages/Subscription";
import AIAgents from "./pages/AIAgents";
import Messages from "./pages/Messages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
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
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
