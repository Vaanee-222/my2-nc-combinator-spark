import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { trackEvent } from "@/lib/analytics";

const REDIRECT_SECONDS = 8;

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    console.warn("404:", location.pathname);
    trackEvent("page_not_found", { path: location.pathname });
  }, [location.pathname]);

  useEffect(() => {
    if (seconds <= 0) {
      navigate("/", { replace: true });
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 flex items-center justify-center px-4 pt-20">
        <div className="max-w-xl w-full text-center space-y-6">
          <div className="text-[8rem] md:text-[10rem] font-extrabold leading-none bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
            404
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Page not found</h1>
          <p className="text-muted-foreground">
            The page <code className="px-1.5 py-0.5 rounded bg-muted text-foreground/80">{location.pathname}</code> doesn't exist or has moved.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting to home in <span className="text-primary font-semibold">{seconds}s</span>…
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button asChild variant="hero" size="lg">
              <Link to="/"><Home className="h-4 w-4 mr-2" /> Go home</Link>
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Go back
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link to="/startup-directory"><Search className="h-4 w-4 mr-2" /> Browse startups</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
