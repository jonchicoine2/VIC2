import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Simple React error boundary that logs errors to the console
 * (or a remote service) and prevents the entire app from crashing.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // TODO: forward to remote logging service (Sentry, LogRocket, etc.)
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16 }}>
          <h2>Something went wrong.</h2>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error.message}</pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 