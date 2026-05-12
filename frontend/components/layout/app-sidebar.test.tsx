import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppSidebar } from './app-sidebar';
import { UserRole } from '@/config/roles';
import type { Dictionary } from '@/lib/get-dictionary';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/en/dashboard',
}));

// Mock RBAC
vi.mock('@/lib/rbac', () => ({
  hasPermission: () => true,
}));

describe('AppSidebar', () => {
  const mockDict: Dictionary = {
    common: {
      appName: 'Hermata Tax System',
      dashboard: 'Dashboard',
      users: 'Users',
      properties: 'Properties',
      propertyOwners: 'Property Owners',
      propertyDocuments: 'Supporting Documents',
      locationCategories: 'Location Categories',
      taxRates: 'Tax Rates',
      assessments: 'Tax Assessments',
      payments: 'Payments',
      confirmations: 'Confirmations',
      reports: 'Reports',
      auditLogs: 'Audit Logs',
      settings: 'Settings',
      'navGroups.overview': 'Overview',
      'navGroups.management': 'Management',
      'navGroups.revenue': 'Revenue',
      'navGroups.administration': 'Administration',
    },
  } as Dictionary;

  it('renders the brand block with app name and subtitle', () => {
    render(<AppSidebar locale="en" dict={mockDict} role={UserRole.ADMIN} />);
    
    expect(screen.getByText('Hermata Tax System')).toBeInTheDocument();
    expect(screen.getByText('Property & Tax Management')).toBeInTheDocument();
  });

  it('renders navigation groups', () => {
    render(<AppSidebar locale="en" dict={mockDict} role={UserRole.ADMIN} />);
    
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Management')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Administration')).toBeInTheDocument();
  });

  it('renders navigation items with localized labels', () => {
    render(<AppSidebar locale="en" dict={mockDict} role={UserRole.ADMIN} />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Properties')).toBeInTheDocument();
    expect(screen.getByText('Tax Assessments')).toBeInTheDocument();
    expect(screen.getByText('Payments')).toBeInTheDocument();
  });

  it('applies premium styling classes', () => {
    const { container } = render(<AppSidebar locale="en" dict={mockDict} role={UserRole.ADMIN} />);
    
    const sidebar = container.querySelector('aside');
    expect(sidebar).toHaveClass('sidebar-width');
    expect(sidebar).toHaveClass('shadow-soft');
  });

  it('renders version footer', () => {
    render(<AppSidebar locale="en" dict={mockDict} role={UserRole.ADMIN} />);
    
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
    expect(screen.getByText('Hermata')).toBeInTheDocument();
  });
});
