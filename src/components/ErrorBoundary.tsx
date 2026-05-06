import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, WifiOff } from "lucide-react";
import { toast } from "sonner";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

const MAX_AUTO_RETRIES = 2;
const AUTO_RETRY_DELAY = 1500;

function extractHttpStatus(error: Error): number | null {
  const match = error.message?.match(/\b(4\d{2}|5\d{2})\b/);
  return match ? parseInt(match[0], 10) : null;
}

function getFriendlyMessage(status: number | null): { title: string; description: string; hint: string } {
  if (status === 412) {
    return {
      title: "Preview sync issue",
      description: "The preview environment encountered a temporary sync error (412).",
      hint: "This usually resolves on its own. Click Retry or wait a moment.",
    };
  }
  if (status && status >= 500) {
    return {
      title: "Server error",
      description: `A server error occurred (${status}).`,
      hint: "The service may be temporarily unavailable. Please try again shortly.",
    };
  }
  if (status === 404) {
    return {
      title: "Resource not found",
      description: "The requested resource could not be found (404).",
      hint: "Check the URL or navigate back to the home page.",
    };
  }
  return {
    title: "Something went wrong",
    description: "An unexpected error occurred while loading this page.",
    hint: "Try refreshing. If the problem persists, check your network connection.",
  };
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);

    const status = extractHttpStatus(error);
    const msg = getFriendlyMessage(status);

    toast.error(msg.title, {
      description: msg.hint,
      duration: 6000,
    });

    // Auto-retry for transient infrastructure errors (412, 5xx)
    if (
      (status === 412 || (status !== null && status >= 500)) &&
      this.state.retryCount < MAX_AUTO_RETRIES
    ) {
      setTimeout(() => {
        this.setState((prev) => ({
          hasError: false,
          error: null,
          retryCount: prev.retryCount + 1,
        }));
      }, AUTO_RETRY_DELAY);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, retryCount: 0 });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const status = extractHttpStatus(this.state.error);
      const msg = getFriendlyMessage(status);
      const isNetworkIssue = status === 412 || (status !== null && status >= 500);

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6">
            {isNetworkIssue ? (
              <WifiOff className="h-16 w-16 text-primary mx-auto" />
            ) : (
              <AlertTriangle className="h-16 w-16 text-primary mx-auto" />
            )}
            <h1 className="text-2xl font-bold">{msg.title}</h1>
            <p className="text-muted-foreground">{msg.description}</p>
            <p className="text-sm text-muted-foreground/70">{msg.hint}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleRetry} size="lg" className="gap-2">
                <RefreshCw className="h-4 w-4" /> Retry
              </Button>
              <Button onClick={this.handleReload} size="lg" variant="outline" className="gap-2">
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
