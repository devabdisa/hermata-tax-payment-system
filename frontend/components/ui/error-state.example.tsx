/**
 * ErrorState Component Usage Examples
 * 
 * This file demonstrates various ways to use the ErrorState component
 * with different configurations and localization support.
 */

import { AlertTriangle, WifiOff, XCircle } from 'lucide-react';

import { ErrorState } from './error-state';

// Example 1: Basic error state
export function BasicErrorExample() {
  return (
    <ErrorState
      title="Something went wrong"
      description="An unexpected error occurred. Please try again."
    />
  );
}

// Example 2: Error state with retry
export function ErrorWithRetryExample() {
  const handleRetry = () => {
    console.log('Retrying...');
    // Add your retry logic here
  };

  return (
    <ErrorState
      title="Failed to load data"
      description="We couldn't load the requested data. Please try again."
      retry={handleRetry}
      retryLabel="Try Again"
    />
  );
}

// Example 3: Error state with technical details
export function ErrorWithDetailsExample() {
  const error = new Error('Network request failed');
  error.stack = 'Error: Network request failed\n    at fetchData (api.ts:42:15)';

  return (
    <ErrorState
      title="Network Error"
      description="Unable to connect to the server. Please check your internet connection."
      error={error}
      retry={() => window.location.reload()}
    />
  );
}

// Example 4: Custom icon error state
export function CustomIconErrorExample() {
  return (
    <ErrorState
      title="No Internet Connection"
      description="Please check your network settings and try again."
      icon={WifiOff}
      retry={() => window.location.reload()}
      retryLabel="Reload Page"
    />
  );
}

// Example 5: Localized error state (English)
export function LocalizedErrorEnglishExample() {
  const dict = {
    error: {
      title: 'Failed to Load Properties',
      description: 'We encountered an error while loading your properties.',
      retry: 'Try Again',
    },
  };

  return (
    <ErrorState
      title={dict.error.title}
      description={dict.error.description}
      retry={() => console.log('Retry')}
      retryLabel={dict.error.retry}
    />
  );
}

// Example 6: Localized error state (Amharic)
export function LocalizedErrorAmharicExample() {
  const dict = {
    error: {
      title: 'መረጃ መጫን አልተቻለም',
      description: 'ንብረቶችዎን በመጫን ላይ ስህተት አጋጥሟል።',
      retry: 'እንደገና ይሞክሩ',
    },
  };

  return (
    <ErrorState
      title={dict.error.title}
      description={dict.error.description}
      retry={() => console.log('Retry')}
      retryLabel={dict.error.retry}
    />
  );
}

// Example 7: Validation error
export function ValidationErrorExample() {
  return (
    <ErrorState
      title="Validation Failed"
      description="Please check your input and try again."
      icon={XCircle}
    />
  );
}

// Example 8: Permission error
export function PermissionErrorExample() {
  return (
    <ErrorState
      title="Access Denied"
      description="You don't have permission to access this resource."
      icon={AlertTriangle}
    />
  );
}

// Example 9: Error state in a data fetching scenario
export function DataFetchingErrorExample() {
  const fetchData = async () => {
    try {
      const response = await fetch('/api/properties');
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      return null;
    }
  };

  const handleRetry = () => {
    fetchData();
  };

  return (
    <ErrorState
      title="Failed to Load Properties"
      description="We couldn't load your properties. Please try again."
      retry={handleRetry}
      retryLabel="Reload"
    />
  );
}

// Example 10: Minimal error state (title only)
export function MinimalErrorExample() {
  return <ErrorState title="An error occurred" />;
}
