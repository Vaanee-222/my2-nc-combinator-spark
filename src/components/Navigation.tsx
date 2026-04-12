import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, LogIn, UserPlus, LogOut, User, MessageSquare } from "lucide-react";
import ApplicationDialog from "./ApplicationDialog";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: "Hackathon", href: "/hackathon" },
    { name: "Incubation", href: "/incubation" },
    { name: "MVP Lab", href: "/mvp-lab" },
    { name: "INC Lab", href: "/inclab" },
    { name: "AI Agents", href: "/ai-agents" },
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">IC</span>
            </div>
            <span className="text-xl font-bold text-primary">Inc Combinator</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.name} to={item.href} className="text-muted-foreground hover:text-primary transition-colors duration-200 relative group">
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            <ApplicationDialog>
              <Button variant="hero" size="lg">Apply Now</Button>
            </ApplicationDialog>
            {user ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/messages"><MessageSquare className="h-4 w-4" /></Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to={getDashboardPath()} className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center space-x-1">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login" className="flex items-center space-x-1">
                    <LogIn className="h-4 w-4" /><span>Login</span>
                  </Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/register" className="flex items-center space-x-1">
                    <UserPlus className="h-4 w-4" /><span>Register</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link key={item.name} to={item.href} className="text-muted-foreground hover:text-primary transition-colors px-2 py-1" onClick={() => setIsOpen(false)}>
                  {item.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to={getDashboardPath()} className="text-muted-foreground hover:text-primary px-2 py-1" onClick={() => setIsOpen(false)}>Dashboard</Link>
                  <Button variant="ghost" size="sm" onClick={() => { handleLogout(); setIsOpen(false); }}>Logout</Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-muted-foreground hover:text-primary px-2 py-1" onClick={() => setIsOpen(false)}>Login</Link>
                  <Link to="/register" className="text-primary px-2 py-1" onClick={() => setIsOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
