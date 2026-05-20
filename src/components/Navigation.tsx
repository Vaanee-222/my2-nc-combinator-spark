import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, UserPlus, LogOut, User, MessageSquare, ChevronDown } from "lucide-react";
import ApplicationDialog from "./ApplicationDialog";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { name: "Hackathon", href: "/hackathon" },
    { name: "Incubation", href: "/incubation" },
    { name: "MVP Lab", href: "/mvp-lab" },
    { name: "INC Lab", href: "/inclab" },
  ];




  const getDashboardPath = () => {
    const map: Record<string, string> = {
      admin: "/admin-dashboard",
      startup: "/startup-dashboard",
      investor: "/investor-dashboard",
      mentor: "/mentor-dashboard",
      cofounder: "/cofounder-dashboard",
    };
    return map[userRole || ""] || "/user-dashboard";
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/98 backdrop-blur-md shadow-sm border-b border-border/50"
          : "bg-background/80 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-orange-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-primary/25 transition-shadow">
              <span className="text-white font-bold text-sm tracking-tight">IC</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              IC Combinator
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* More dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 flex items-center gap-1">
                  More <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {moreItems.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link to={item.href} className="w-full cursor-pointer">
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right side actions */}
          <div className="hidden lg:flex items-center space-x-2">
            <ApplicationDialog>
              <Button variant="hero" size="sm" className="font-semibold shadow-md hover:shadow-lg transition-shadow">
                Apply Now
              </Button>
            </ApplicationDialog>
            {user ? (
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                  <Link to="/messages"><MessageSquare className="h-4 w-4" /></Link>
                </Button>
                <Button variant="outline" size="sm" className="h-9" asChild>
                  <Link to={getDashboardPath()} className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    <span>Dashboard</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="h-9" onClick={handleLogout}>
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <Button variant="ghost" size="sm" className="h-9" asChild>
                  <Link to="/login" className="flex items-center gap-1.5">
                    <LogIn className="h-3.5 w-3.5" /><span>Login</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="h-9" asChild>
                  <Link to="/register" className="flex items-center gap-1.5">
                    <UserPlus className="h-3.5 w-3.5" /><span>Register</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border/50 animate-fade-in space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-border/50 my-2 pt-2">
              {moreItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-border/50 pt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <Link to={getDashboardPath()} className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => { handleLogout(); setIsOpen(false); }}>Logout</Button>
                </>
              ) : (
                <div className="flex gap-2 px-3">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                  </Button>
                  <Button variant="hero" size="sm" className="flex-1" asChild>
                    <Link to="/register" onClick={() => setIsOpen(false)}>Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
