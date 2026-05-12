'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorState } from '@/components/ui/error-state';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary Component
 * 
 * Catch-all error handler for React component trees.
 * Displays a premium ErrorState component when a crash occurs.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] w-full items-center justify-center p-6">
          <ErrorState
            title="Something went wrong"
            description={this.state.error?.message || "An unexpected error occurred in the application."}
            retry={() => window.location.reload()}
            retryLabel="Try Again"
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
