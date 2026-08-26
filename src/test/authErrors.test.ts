import { describe, it, expect } from "vitest";
import { friendlyAuthError } from "@/lib/authErrors";

describe("friendlyAuthError", () => {
  it("TC-AE-01 handles a missing/empty error object", () => {
    expect(friendlyAuthError(undefined)).toBe("Something went wrong. Please try again.");
    expect(friendlyAuthError({})).toBe("Something went wrong. Please try again.");
  });

  it("TC-AE-02 maps invalid credentials", () => {
    expect(friendlyAuthError({ message: "Invalid login credentials" })).toMatch(/incorrect/i);
    expect(friendlyAuthError({ code: "invalid_credentials" })).toMatch(/incorrect/i);
  });

  it("TC-AE-03 maps unconfirmed email", () => {
    expect(friendlyAuthError({ message: "Email not confirmed" })).toMatch(/verify your email/i);
  });

  it("TC-AE-04 maps duplicate sign-up to a sign-in hint", () => {
    expect(friendlyAuthError({ message: "User already registered" }, "signup")).toMatch(/already exists/i);
  });

  it("TC-AE-05 maps weak password and rate limits", () => {
    expect(friendlyAuthError({ message: "Password should be at least 6 characters" })).toMatch(/too weak/i);
    expect(friendlyAuthError({ code: "over_email_send_rate_limit" })).toMatch(/too many attempts/i);
  });

  it("TC-AE-06 does not leak account existence on password reset", () => {
    const msg = friendlyAuthError({ message: "User not found" }, "reset");
    expect(msg).toMatch(/if an account with this email exists/i);
    expect(friendlyAuthError({ message: "User not found" }, "login")).toMatch(/no account found/i);
  });

  it("TC-AE-07 maps network failures", () => {
    expect(friendlyAuthError({ message: "Failed to fetch" })).toMatch(/network error/i);
  });

  it("TC-AE-08 falls back to the raw message for unknown errors", () => {
    expect(friendlyAuthError({ message: "Teapot malfunction" })).toBe("Teapot malfunction");
  });
});
