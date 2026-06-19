/** Maps Supabase auth errors to clear, user-actionable messages. */
export function friendlyAuthError(err: any, context: "login" | "signup" | "reset" = "login"): string {
  const raw = (err?.message || err?.error_description || "").toString();
  const code = (err?.code || err?.error || "").toString().toLowerCase();
  const lower = raw.toLowerCase();

  if (!raw && !code) return "Something went wrong. Please try again.";

  if (lower.includes("invalid login credentials") || code === "invalid_credentials") {
    return "The email or password you entered is incorrect. Please try again or reset your password.";
  }
  if (lower.includes("email not confirmed") || code === "email_not_confirmed") {
    return "Please verify your email first. Check your inbox for the confirmation link.";
  }
  if (lower.includes("user already registered") || lower.includes("already been registered") || code === "user_already_exists") {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (lower.includes("password should be at least") || code === "weak_password") {
    return "Your password is too weak. Use at least 6 characters with a mix of letters and numbers.";
  }
  if (lower.includes("rate limit") || code === "over_request_rate_limit" || code === "over_email_send_rate_limit") {
    return "Too many attempts. Please wait a minute and try again.";
  }
  if (lower.includes("invalid email") || code === "validation_failed") {
    return "Please enter a valid email address.";
  }
  if (lower.includes("user not found") || code === "user_not_found") {
    return context === "reset"
      ? "If an account with this email exists, a reset link has been sent."
      : "No account found with this email.";
  }
  if (lower.includes("network") || lower.includes("failed to fetch")) {
    return "Network error. Check your connection and try again.";
  }
  if (lower.includes("signup is disabled") || code === "signup_disabled") {
    return "New sign-ups are temporarily disabled. Please contact support.";
  }
  if (lower.includes("token") && lower.includes("expired")) {
    return "Your session expired. Please sign in again.";
  }
  return raw || "Something went wrong. Please try again.";
}
