import { render, screen, fireEvent } from '@testing-library/react';
import { Home, Plus } from 'lucide-react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

import { PageHeader } from './page-header';

describe('PageHeader', () => {
  describe('Basic Rendering', () => {
    it('should render title', () => {
      render(<PageHeader title="Test Title" />);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render description when provided', () => {
      render(
        <PageHeader
          title="Test Title"
          description="Test description"
        />
      );
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('should render breadcrumbs when provided', () => {
      render(
        <PageHeader
          title="Test Title"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Dashboard', href: '/dashboard' }
          ]}
        />
      );
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('should render icon when provided', () => {
      const { container } = render(
        <PageHeader
          title="Test Title"
          icon={Home}
        />
      );
      const iconContainer = container.querySelector('.bg-gradient-to-br');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('should render action buttons', () => {
      const handleClick = vi.fn();
      render(
        <PageHeader
          title="Test Title"
          actions={[
            {
              label: 'Add New',
              onClick: handleClick,
              icon: Plus
            }
          ]}
        />
      );
      expect(screen.getByText('Add New')).toBeInTheDocument();
    });

    it('should call action onClick when clicked', () => {
      const handleClick = vi.fn();
      render(
        <PageHeader
          title="Test Title"
          actions={[
            {
              label: 'Add New',
              onClick: handleClick
            }
          ]}
        />
      );
      
      const button = screen.getByText('Add New');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should disable action button when disabled prop is true', () => {
      const handleClick = vi.fn();
      render(
        <PageHeader
          title="Test Title"
          actions={[
            {
              label: 'Add New',
              onClick: handleClick,
              disabled: true
            }
          ]}
        />
      );
      
      const button = screen.getByText('Add New').closest('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<PageHeader title="Test Title" />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Test Title');
    });

    it('should mark icon as decorative with aria-hidden', () => {
      const { container } = render(
        <PageHeader
          title="Test Title"
          icon={Home}
        />
      );
      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
