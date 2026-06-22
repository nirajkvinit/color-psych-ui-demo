import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

/**
 * Last-resort guard so an unexpected render error (e.g. a bad persisted value)
 * shows a recoverable message instead of a blank white screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, message: error instanceof Error ? error.message : String(error) };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Aether Lab crashed:', error, info);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      /* ignore */
    }
    location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg)] text-[var(--text)]">
        <div className="card max-w-md text-center space-y-4">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="text-sm text-[var(--text-muted)]">
            The app hit an unexpected error. Resetting local data usually fixes it.
          </p>
          {this.state.message && (
            <p className="text-xs font-mono text-[var(--text-muted)] break-words">{this.state.message}</p>
          )}
          <button onClick={this.handleReset} className="btn btn-primary">
            Reset & reload
          </button>
        </div>
      </div>
    );
  }
}
