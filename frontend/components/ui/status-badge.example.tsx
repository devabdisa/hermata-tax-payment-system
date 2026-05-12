import { StatusBadge } from './status-badge';

/**
 * StatusBadge Component Examples
 * 
 * This file demonstrates various usage patterns for the StatusBadge component.
 */

// Mock dictionary for examples
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

export function BasicStatusBadgeExample() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Status Badges</h3>
      <div className="flex flex-wrap gap-2">
        <StatusBadge status="DRAFT" dict={mockDict} />
        <StatusBadge status="SUBMITTED" dict={mockDict} />
        <StatusBadge status="UNDER_REVIEW" dict={mockDict} />
        <StatusBadge status="APPROVED" dict={mockDict} />
        <StatusBadge status="REJECTED" dict={mockDict} />
        <StatusBadge status="ARCHIVED" dict={mockDict} />
      </div>
    </div>
  );
}

export function StatusBadgeWithIconsExample() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Status Badges with Icons</h3>
      <div className="flex flex-wrap gap-2">
        <StatusBadge status="PENDING" dict={mockDict} showIcon />
        <StatusBadge status="VERIFIED" dict={mockDict} showIcon />
        <StatusBadge status="CANCELLED" dict={mockDict} showIcon />
        <StatusBadge status="ISSUED" dict={mockDict} showIcon />
        <StatusBadge status="PAID" dict={mockDict} showIcon />
        <StatusBadge status="OVERDUE" dict={mockDict} showIcon />
      </div>
    </div>
  );
}

export function StatusBadgeSizesExample() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Status Badge Sizes</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-20 text-sm text-muted-foreground">Small:</span>
          <StatusBadge status="APPROVED" dict={mockDict} size="sm" showIcon />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-20 text-sm text-muted-foreground">Medium:</span>
          <StatusBadge status="APPROVED" dict={mockDict} size="md" showIcon />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-20 text-sm text-muted-foreground">Large:</span>
          <StatusBadge status="APPROVED" dict={mockDict} size="lg" showIcon />
        </div>
      </div>
    </div>
  );
}

export function StatusBadgeInTableExample() {
  const properties = [
    { id: 1, name: 'Property A', status: 'DRAFT' as const },
    { id: 2, name: 'Property B', status: 'SUBMITTED' as const },
    { id: 3, name: 'Property C', status: 'APPROVED' as const },
    { id: 4, name: 'Property D', status: 'REJECTED' as const },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Status Badges in Table</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id} className="border-b">
              <td className="p-2">{property.id}</td>
              <td className="p-2">{property.name}</td>
              <td className="p-2">
                <StatusBadge
                  status={property.status}
                  dict={mockDict}
                  size="sm"
                  showIcon
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatusBadgePaymentStatesExample() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment Status States</h3>
      <div className="flex flex-wrap gap-2">
        <StatusBadge status="PENDING" dict={mockDict} showIcon />
        <StatusBadge status="VERIFIED" dict={mockDict} showIcon />
        <StatusBadge status="PAID" dict={mockDict} showIcon />
        <StatusBadge status="OVERDUE" dict={mockDict} showIcon />
        <StatusBadge status="CANCELLED" dict={mockDict} showIcon />
      </div>
    </div>
  );
}

export function StatusBadgeAssessmentStatesExample() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Assessment Status States</h3>
      <div className="flex flex-wrap gap-2">
        <StatusBadge status="DRAFT" dict={mockDict} showIcon />
        <StatusBadge status="ISSUED" dict={mockDict} showIcon />
        <StatusBadge status="PAID" dict={mockDict} showIcon />
        <StatusBadge status="OVERDUE" dict={mockDict} showIcon />
        <StatusBadge status="CANCELLED" dict={mockDict} showIcon />
      </div>
    </div>
  );
}

export function StatusBadgeFallbackExample() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Fallback to Raw Status</h3>
      <p className="text-sm text-muted-foreground">
        When dictionary is not provided, the component falls back to displaying the raw
        status value.
      </p>
      <div className="flex flex-wrap gap-2">
        <StatusBadge status="APPROVED" />
        <StatusBadge status="REJECTED" />
        <StatusBadge status="PENDING" showIcon />
      </div>
    </div>
  );
}

export function AllStatusBadgeExamples() {
  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold">StatusBadge Component Examples</h2>
      <BasicStatusBadgeExample />
      <StatusBadgeWithIconsExample />
      <StatusBadgeSizesExample />
      <StatusBadgeInTableExample />
      <StatusBadgePaymentStatesExample />
      <StatusBadgeAssessmentStatesExample />
      <StatusBadgeFallbackExample />
    </div>
  );
}
