import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roleLoading: boolean;
  userRole: string | null;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const validRoles = ['startup', 'investor', 'mentor', 'cofounder'] as const;
  const sanitizeSignupRole = (role?: string | null) =>
    validRoles.includes(role as any) ? role as typeof validRoles[number] : 'startup';

  const ensureUserRecords = async (currentUser: User) => {
    setRoleLoading(true);
    const metadata = currentUser.user_metadata ?? {};

    await supabase.from("profiles").upsert({
      user_id: currentUser.id,
      email: currentUser.email ?? null,
      full_name: metadata.full_name ?? "",
    }, { onConflict: "user_id" });

    let { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", currentUser.id)
      .maybeSingle();

    if (!data?.role) {
      const desiredRole = sanitizeSignupRole(metadata.selected_role ?? metadata.role);
      await supabase.from("user_roles").insert({
        user_id: currentUser.id,
        role: desiredRole as any,
      });
      const refreshed = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", currentUser.id)
        .maybeSingle();
      data = refreshed.data;
    }

    setUserRole(data?.role ?? null);
    setRoleLoading(false);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setRoleLoading(true);
          setTimeout(() => ensureUserRecords(session.user).finally(() => setRoleLoading(false)), 0);
        } else {
          setUserRole(null);
          setRoleLoading(false);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        ensureUserRecords(session.user).finally(() => setRoleLoading(false));
      } else {
        setRoleLoading(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    const safeRole = sanitizeSignupRole(role);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, selected_role: safeRole },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;

    if (data.user && data.session) {
      await ensureUserRecords(data.user);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
    setRoleLoading(false);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, roleLoading, userRole, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
