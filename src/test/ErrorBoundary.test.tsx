import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBoundary from "@/components/ErrorBoundary";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), {
    error: vi.fn(),
    success: vi.fn(),
  }),
  Toaster: () => null,
}));

const ThrowError = ({ error }: { error: Error }) => {
  throw error;
};

describe("ErrorBoundary", () => {
  // Suppress console.error from React error boundary logs
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <div>Hello World</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("shows retry UI with 412 error message", () => {
    render(
      <ErrorBoundary>
        <ThrowError error={new Error("Failed to fetch: 412 Precondition Failed")} />
      </ErrorBoundary>
    );
    expect(screen.getByText("Preview sync issue")).toBeInTheDocument();
    expect(screen.getByText(/412/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reload/i })).toBeInTheDocument();
  });

  it("shows generic error UI for non-HTTP errors", () => {
    render(
      <ErrorBoundary>
        <ThrowError error={new Error("Something broke")} />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("shows server error UI for 500 status", () => {
    render(
      <ErrorBoundary>
        <ThrowError error={new Error("Request failed with status 500")} />
      </ErrorBoundary>
    );
    expect(screen.getByText("Server error")).toBeInTheDocument();
    expect(screen.getByText(/500/)).toBeInTheDocument();
  });

  it("retry button resets error state", () => {
    let shouldThrow = true;
    const MaybeThrow = () => {
      if (shouldThrow) throw new Error("Test error");
      return <div>Recovered</div>;
    };

    render(
      <ErrorBoundary>
        <MaybeThrow />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    shouldThrow = false;
    fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    expect(screen.getByText("Recovered")).toBeInTheDocument();
  });
});
