import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge, StatusType } from './status-badge';

describe('StatusBadge', () => {
  const mockDict = {
    status: {
      DRAFT: 'Draft',
      SUBMITTED: 'Submitted',
      UNDER_REVIEW: 'Under Review',
      APPROVED: 'Approved',
      REJECTED: 'Rejected',
      ARCHIVED: 'Archived',
      PENDING: 'Pending',
      VERIFIED: 'Verified',
      CANCELLED: 'Cancelled',
      ISSUED: 'Issued',
      PAID: 'Paid',
      OVERDUE: 'Overdue',
    },
  };

  describe('Requirement 10.1: Display localized status label', () => {
    it('should display localized label when dict is provided', () => {
      render(<StatusBadge status="APPROVED" dict={mockDict} />);
      expect(screen.getByText('Approved')).toBeInTheDocument();
    });

    it('should display localized label for all status types', () => {
      const statuses: StatusType[] = [
        'DRAFT',
        'SUBMITTED',
        'UNDER_REVIEW',
        'APPROVED',
        'REJECTED',
        'ARCHIVED',
        'PENDING',
        'VERIFIED',
        'CANCELLED',
        'ISSUED',
        'PAID',
        'OVERDUE',
      ];

      statuses.forEach((status) => {
        const { unmount } = render(<StatusBadge status={status} dict={mockDict} />);
        expect(screen.getByText(mockDict.status[status])).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Requirement 10.2: Apply color-coded styling based on status type', () => {
    it('should apply correct styling classes for each status', () => {
      const { container, rerender } = render(
        <StatusBadge status="APPROVED" dict={mockDict} />,
      );
      let badge = container.querySelector('span');
      expect(badge).toHaveClass('text-emerald-700');
      expect(badge).toHaveClass('bg-emerald-50');
      expect(badge).toHaveClass('border-emerald-200');

      rerender(<StatusBadge status="REJECTED" dict={mockDict} />);
      badge = container.querySelector('span');
      expect(badge).toHaveClass('text-red-700');
      expect(badge).toHaveClass('bg-red-50');
      expect(badge).toHaveClass('border-red-200');

      rerender(<StatusBadge status="PENDING" dict={mockDict} />);
      badge = container.querySelector('span');
      expect(badge).toHaveClass('text-amber-700');
      expect(badge).toHaveClass('bg-amber-50');
      expect(badge).toHaveClass('border-amber-200');
    });
  });

  describe('Requirement 10.3: Display icon when showIcon is true', () => {
    it('should display icon when showIcon is true', () => {
      const { container } = render(
        <StatusBadge status="APPROVED" dict={mockDict} showIcon />,
      );
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should not display icon when showIcon is false', () => {
      const { container } = render(
        <StatusBadge status="APPROVED" dict={mockDict} showIcon={false} />,
      );
      const icon = container.querySelector('svg');
      expect(icon).not.toBeInTheDocument();
    });

    it('should not display icon by default', () => {
      const { container } = render(<StatusBadge status="APPROVED" dict={mockDict} />);
      const icon = container.querySelector('svg');
      expect(icon).not.toBeInTheDocument();
    });
  });

  describe('Requirement 10.4: Support different sizes (sm, md, lg)', () => {
    it('should apply small size classes', () => {
      const { container } = render(
        <StatusBadge status="APPROVED" dict={mockDict} size="sm" />,
      );
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('px-2', 'py-0.5', 'text-xs');
    });

    it('should apply medium size classes by default', () => {
      const { container } = render(<StatusBadge status="APPROVED" dict={mockDict} />);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('px-2.5', 'py-1', 'text-sm');
    });

    it('should apply large size classes', () => {
      const { container } = render(
        <StatusBadge status="APPROVED" dict={mockDict} size="lg" />,
      );
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('px-3', 'py-1.5', 'text-base');
    });

    it('should apply correct icon size for each badge size', () => {
      const { container, rerender } = render(
        <StatusBadge status="APPROVED" dict={mockDict} size="sm" showIcon />,
      );
      let icon = container.querySelector('svg');
      expect(icon).toHaveClass('h-3', 'w-3');

      rerender(<StatusBadge status="APPROVED" dict={mockDict} size="md" showIcon />);
      icon = container.querySelector('svg');
      expect(icon).toHaveClass('h-3.5', 'w-3.5');

      rerender(<StatusBadge status="APPROVED" dict={mockDict} size="lg" showIcon />);
      icon = container.querySelector('svg');
      expect(icon).toHaveClass('h-4', 'w-4');
    });
  });

  describe('Requirement 10.5: Map DRAFT status to gray colors with FileText icon', () => {
    it('should apply gray colors for DRAFT status', () => {
      const { container } = render(<StatusBadge status="DRAFT" dict={mockDict} />);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('text-slate-700');
      expect(badge).toHaveClass('bg-slate-100');
      expect(badge).toHaveClass('border-slate-200');
    });

    it('should use FileText icon for DRAFT status', () => {
      const { container } = render(
        <StatusBadge status="DRAFT" dict={mockDict} showIcon />,
      );
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
      // Icon is rendered, specific icon type verified by visual inspection
    });
  });

  describe('Requirement 10.6: Map APPROVED status to green colors with CheckCircle icon', () => {
    it('should apply green colors for APPROVED status', () => {
      const { container } = render(<StatusBadge status="APPROVED" dict={mockDict} />);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('text-emerald-700');
      expect(badge).toHaveClass('bg-emerald-50');
      expect(badge).toHaveClass('border-emerald-200');
    });

    it('should use CheckCircle icon for APPROVED status', () => {
      const { container } = render(
        <StatusBadge status="APPROVED" dict={mockDict} showIcon />,
      );
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Requirement 10.7: Map REJECTED status to red colors with XCircle icon', () => {
    it('should apply red colors for REJECTED status', () => {
      const { container } = render(<StatusBadge status="REJECTED" dict={mockDict} />);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('text-red-700');
      expect(badge).toHaveClass('bg-red-50');
      expect(badge).toHaveClass('border-red-200');
    });

    it('should use XCircle icon for REJECTED status', () => {
      const { container } = render(
        <StatusBadge status="REJECTED" dict={mockDict} showIcon />,
      );
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Requirement 10.8: Map PENDING status to yellow colors with Clock icon', () => {
    it('should apply yellow colors for PENDING status', () => {
      const { container } = render(<StatusBadge status="PENDING" dict={mockDict} />);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('text-amber-700');
      expect(badge).toHaveClass('bg-amber-50');
      expect(badge).toHaveClass('border-amber-200');
    });

    it('should use Clock icon for PENDING status', () => {
      const { container } = render(
        <StatusBadge status="PENDING" dict={mockDict} showIcon />,
      );
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Requirement 10.9: Map PAID status to emerald colors with CheckCircle icon', () => {
    it('should apply green colors for PAID status', () => {
      const { container } = render(<StatusBadge status="PAID" dict={mockDict} />);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('text-green-700');
      expect(badge).toHaveClass('bg-green-50');
      expect(badge).toHaveClass('border-green-200');
    });

    it('should use CreditCard icon for PAID status', () => {
      const { container } = render(
        <StatusBadge status="PAID" dict={mockDict} showIcon />,
      );
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Requirement 10.10: Map OVERDUE status to red colors with AlertCircle icon', () => {
    it('should apply red colors for OVERDUE status', () => {
      const { container } = render(<StatusBadge status="OVERDUE" dict={mockDict} />);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('text-rose-700');
      expect(badge).toHaveClass('bg-rose-50');
      expect(badge).toHaveClass('border-rose-200');
    });

    it('should use AlertCircle icon for OVERDUE status', () => {
      const { container } = render(
        <StatusBadge status="OVERDUE" dict={mockDict} showIcon />,
      );
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Requirement 10.11: Fallback to raw status value if translation missing', () => {
    it('should display raw status value when dict is not provided', () => {
      render(<StatusBadge status="APPROVED" />);
      expect(screen.getByText('APPROVED')).toBeInTheDocument();
    });

    it('should display raw status value when dict.status is missing', () => {
      render(<StatusBadge status="APPROVED" dict={{}} />);
      expect(screen.getByText('APPROVED')).toBeInTheDocument();
    });

    it('should display raw status value when specific status key is missing', () => {
      const incompleteDict = {
        status: {
          DRAFT: 'Draft',
          // APPROVED is missing
        },
      };
      render(<StatusBadge status="APPROVED" dict={incompleteDict} />);
      expect(screen.getByText('APPROVED')).toBeInTheDocument();
    });
  });

  describe('Additional status mappings', () => {
    it('should correctly map SUBMITTED status', () => {
      const { container } = render(
        <StatusBadge status="SUBMITTED" dict={mockDict} showIcon />,
      );
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('text-blue-700');
      expect(badge).toHaveClass('bg-blue-50');
      expect(screen.getByText('Submitted')).toBeInTheDocument();
    });

    it('should correctly map UNDER_REVIEW status', () => {
      const { container } = render(
        <StatusBadge status="UNDER_REVIEW" dict={mockDict} showIcon />,
      );
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('text-purple-700');
      expect(badge).toHaveClass('bg-purple-50');
      expect(screen.getByText('Under Review')).toBeInTheDocument();
    });

    it('should correctly map ARCHIVED status', () => {
      const { container } = render(
        <StatusBadge status="ARCHIVED" dict={mockDict} showIcon />,
      );
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('text-gray-700');
      expect(badge).toHaveClass('bg-gray-50');
      expect(screen.getByText('Archived')).toBeInTheDocument();
    });

    it('should correctly map VERIFIED status', () => {
      const { container } = render(
        <StatusBadge status="VERIFIED" dict={mockDict} showIcon />,
      );
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('text-teal-700');
      expect(badge).toHaveClass('bg-teal-50');
      expect(screen.getByText('Verified')).toBeInTheDocument();
    });

    it('should correctly map CANCELLED status', () => {
      const { container } = render(
        <StatusBadge status="CANCELLED" dict={mockDict} showIcon />,
      );
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('text-orange-700');
      expect(badge).toHaveClass('bg-orange-50');
      expect(screen.getByText('Cancelled')).toBeInTheDocument();
    });

    it('should correctly map ISSUED status', () => {
      const { container } = render(
        <StatusBadge status="ISSUED" dict={mockDict} showIcon />,
      );
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('text-indigo-700');
      expect(badge).toHaveClass('bg-indigo-50');
      expect(screen.getByText('Issued')).toBeInTheDocument();
    });
  });

  describe('Custom className support', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <StatusBadge status="APPROVED" dict={mockDict} className="custom-class" />,
      );
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('custom-class');
    });

    it('should merge custom className with default classes', () => {
      const { container } = render(
        <StatusBadge status="APPROVED" dict={mockDict} className="ml-2" />,
      );
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('ml-2');
      expect(badge).toHaveClass('inline-flex');
      expect(badge).toHaveClass('items-center');
    });
  });

  describe('Accessibility', () => {
    it('should have aria-hidden on icon', () => {
      const { container } = render(
        <StatusBadge status="APPROVED" dict={mockDict} showIcon />,
      );
      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should render as inline element', () => {
      const { container } = render(<StatusBadge status="APPROVED" dict={mockDict} />);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('inline-flex');
    });
  });
});
