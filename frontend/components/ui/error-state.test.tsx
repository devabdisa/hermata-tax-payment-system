import { fireEvent, render, screen } from '@testing-library/react';
import { AlertTriangle } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { ErrorState } from './error-state';

describe('ErrorState', () => {
  it('renders error title', () => {
    render(<ErrorState title="Something went wrong" />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders error description when provided', () => {
    render(
      <ErrorState
        title="Error occurred"
        description="Please try again later"
      />
    );
    
    expect(screen.getByText('Please try again later')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<ErrorState title="Error occurred" />);
    
    expect(screen.queryByText('Please try again later')).not.toBeInTheDocument();
  });

  it('renders default AlertCircle icon', () => {
    const { container } = render(<ErrorState title="Error" />);
    
    const iconContainer = container.querySelector('[data-slot="error-icon"]');
    expect(iconContainer).toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    const { container } = render(
      <ErrorState title="Error" icon={AlertTriangle} />
    );
    
    const iconContainer = container.querySelector('[data-slot="error-icon"]');
    expect(iconContainer).toBeInTheDocument();
  });

  it('renders error details when error object is provided', () => {
    const error = new Error('Network request failed');
    render(<ErrorState title="Error" error={error} />);
    
    expect(screen.getByText('Technical Details')).toBeInTheDocument();
    expect(screen.getByText(/Network request failed/)).toBeInTheDocument();
  });

  it('does not render error details when error object is not provided', () => {
    render(<ErrorState title="Error" />);
    
    expect(screen.queryByText('Technical Details')).not.toBeInTheDocument();
  });

  it('renders retry button when retry function is provided', () => {
    const retry = vi.fn();
    render(<ErrorState title="Error" retry={retry} />);
    
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
  });

  it('does not render retry button when retry function is not provided', () => {
    render(<ErrorState title="Error" />);
    
    expect(screen.queryByRole('button', { name: 'Try Again' })).not.toBeInTheDocument();
  });

  it('calls retry function when retry button is clicked', () => {
    const retry = vi.fn();
    render(<ErrorState title="Error" retry={retry} />);
    
    const retryButton = screen.getByRole('button', { name: 'Try Again' });
    fireEvent.click(retryButton);
    
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it('renders custom retry button label', () => {
    const retry = vi.fn();
    render(
      <ErrorState
        title="Error"
        retry={retry}
        retryLabel="Retry Loading"
      />
    );
    
    expect(screen.getByRole('button', { name: 'Retry Loading' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ErrorState title="Error" className="custom-class" />
    );
    
    const errorState = container.querySelector('[data-slot="error-state"]');
    expect(errorState).toHaveClass('custom-class');
  });

  it('renders all elements together', () => {
    const retry = vi.fn();
    const error = new Error('Test error');
    render(
      <ErrorState
        title="Failed to load"
        description="Something went wrong"
        error={error}
        retry={retry}
        retryLabel="Reload"
      />
    );
    
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Technical Details')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(<ErrorState title="Error" />);
    
    const icon = container.querySelector('[data-slot="error-icon"] svg');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders error stack trace when available', () => {
    const error = new Error('Test error');
    error.stack = 'Error: Test error\n    at test.js:1:1';
    render(<ErrorState title="Error" error={error} />);
    
    expect(screen.getByText(/at test.js:1:1/)).toBeInTheDocument();
  });
});
