import { render, screen } from '@testing-library/react';
import { Home, TrendingUp } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { MetricCard } from './metric-card';

describe('MetricCard', () => {
  it('renders title and value', () => {
    render(<MetricCard title="Total Properties" value={1234} />);
    
    expect(screen.getByText('Total Properties')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('renders string value without formatting', () => {
    render(<MetricCard title="Status" value="Active" />);
    
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders change indicator with up trend', () => {
    render(
      <MetricCard
        title="Revenue"
        value={50000}
        change={{ value: 12.5, trend: 'up' }}
      />
    );
    
    expect(screen.getByText('12.5%')).toBeInTheDocument();
    // Check for up arrow by looking for the svg element
    const changeIndicator = screen.getByText('12.5%').parentElement;
    expect(changeIndicator).toHaveClass('text-success');
  });

  it('renders change indicator with down trend', () => {
    render(
      <MetricCard
        title="Revenue"
        value={50000}
        change={{ value: -8.3, trend: 'down' }}
      />
    );
    
    expect(screen.getByText('8.3%')).toBeInTheDocument();
    // Check for down arrow by looking for the svg element
    const changeIndicator = screen.getByText('8.3%').parentElement;
    expect(changeIndicator).toHaveClass('text-destructive');
  });

  it('does not render change indicator for neutral trend', () => {
    render(
      <MetricCard
        title="Revenue"
        value={50000}
        change={{ value: 0, trend: 'neutral' }}
      />
    );
    
    expect(screen.queryByText('0%')).not.toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const { container } = render(
      <MetricCard
        title="Total Properties"
        value={1234}
        icon={Home}
        iconColor="text-blue-600"
      />
    );
    
    // Check that icon container exists with proper styling
    const iconContainer = container.querySelector('.text-blue-600');
    expect(iconContainer).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <MetricCard
        title="Total Properties"
        value={1234}
        description="Registered this month"
      />
    );
    
    expect(screen.getByText('Registered this month')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <MetricCard
        title="Total Properties"
        value={1234}
        className="custom-class"
      />
    );
    
    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });

  it('applies premium card styling', () => {
    const { container } = render(
      <MetricCard title="Total Properties" value={1234} />
    );
    
    const card = container.firstChild;
    expect(card).toHaveClass('premium-card');
    expect(card).toHaveClass('transition-smooth');
    expect(card).toHaveClass('hover-lift');
  });

  it('formats large numbers with locale formatting', () => {
    render(<MetricCard title="Revenue" value={1234567} />);
    
    expect(screen.getByText('1,234,567')).toBeInTheDocument();
  });

  it('handles zero value correctly', () => {
    render(<MetricCard title="Pending" value={0} />);
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders all elements together', () => {
    render(
      <MetricCard
        title="Total Revenue"
        value={125000}
        change={{ value: 15.2, trend: 'up' }}
        icon={TrendingUp}
        iconColor="text-emerald-600"
        description="Compared to last month"
      />
    );
    
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('125,000')).toBeInTheDocument();
    expect(screen.getByText('15.2%')).toBeInTheDocument();
    expect(screen.getByText('Compared to last month')).toBeInTheDocument();
  });
});
