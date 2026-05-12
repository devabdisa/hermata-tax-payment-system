# StatusBadge Component

Unified status badges for all entity states with localized labels and icons.

## Overview

The `StatusBadge` component provides a consistent way to display entity status across the application. It supports 12 different status types, each with its own color scheme and icon. The component is fully localized and includes fallback behavior for missing translations.

## Features

- ✅ Display localized status labels
- ✅ Color-coded styling based on status type
- ✅ Optional icon display
- ✅ Three size variants (sm, md, lg)
- ✅ Support for all 12 status types
- ✅ Fallback to raw status value if translation missing
- ✅ Dark mode support
- ✅ Accessible with proper ARIA attributes

## Requirements Validation

**Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10, 10.11**

## Status Types

The component supports the following status types:

| Status | Color | Icon | Use Case |
|--------|-------|------|----------|
| `DRAFT` | Gray | FileText | Initial state, not yet submitted |
| `SUBMITTED` | Blue | Send | Submitted for review |
| `UNDER_REVIEW` | Purple | Eye | Currently being reviewed |
| `APPROVED` | Emerald | CheckCircle | Approved/accepted |
| `REJECTED` | Red | XCircle | Rejected/declined |
| `ARCHIVED` | Gray | Archive | Archived/inactive |
| `PENDING` | Amber | Clock | Awaiting action |
| `VERIFIED` | Teal | ShieldCheck | Verified/confirmed |
| `CANCELLED` | Orange | Ban | Cancelled |
| `ISSUED` | Indigo | FileCheck | Issued/published |
| `PAID` | Green | CreditCard | Payment completed |
| `OVERDUE` | Rose | AlertCircle | Past due date |

## Usage

### Basic Usage

```tsx
import { StatusBadge } from '@/components/ui/status-badge';

export function PropertyList({ properties, dict }) {
  return (
    <div>
      {properties.map((property) => (
        <div key={property.id}>
          <span>{property.name}</span>
          <StatusBadge status={property.status} dict={dict} />
        </div>
      ))}
    </div>
  );
}
```

### With Icon

```tsx
<StatusBadge 
  status="APPROVED" 
  dict={dict} 
  showIcon 
/>
```

### Different Sizes

```tsx
<StatusBadge status="PENDING" dict={dict} size="sm" />
<StatusBadge status="PENDING" dict={dict} size="md" />
<StatusBadge status="PENDING" dict={dict} size="lg" />
```

### In a Table

```tsx
<table>
  <tbody>
    {items.map((item) => (
      <tr key={item.id}>
        <td>{item.name}</td>
        <td>
          <StatusBadge
            status={item.status}
            dict={dict}
            size="sm"
            showIcon
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

### Without Dictionary (Fallback)

```tsx
// Will display "APPROVED" instead of localized text
<StatusBadge status="APPROVED" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `StatusType` | Required | The status to display |
| `locale` | `string` | `undefined` | Current locale (e.g., 'en', 'am') |
| `dict` | `Record<string, any>` | `undefined` | Dictionary object for localization |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size |
| `showIcon` | `boolean` | `false` | Whether to show icon |
| `className` | `string` | `undefined` | Additional CSS classes |

## Localization

The component expects the dictionary to have the following structure:

```typescript
const dict = {
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
```

If a translation is missing, the component will fall back to displaying the raw status value (e.g., "APPROVED").

## Styling

The component uses Tailwind CSS classes and supports dark mode out of the box. Each status has carefully chosen colors that work well in both light and dark themes:

- **Light mode**: Soft backgrounds with darker text
- **Dark mode**: Darker backgrounds with lighter text

## Accessibility

- Icons have `aria-hidden="true"` to prevent screen readers from announcing them
- Status information is conveyed through both color and icon (not relying on color alone)
- Proper semantic HTML with inline `<span>` elements
- Sufficient color contrast ratios for WCAG AA compliance

## Examples

See `status-badge.example.tsx` for comprehensive usage examples including:
- Basic status badges
- Status badges with icons
- Different sizes
- Usage in tables
- Payment status states
- Assessment status states
- Fallback behavior

## Testing

The component includes comprehensive unit tests covering:
- All 12 status types
- Localization with fallback
- Icon display
- Size variants
- Color mappings
- Accessibility features

Run tests with:
```bash
pnpm test status-badge.test.tsx
```

## Design System Integration

This component is part of the Modern Civic SaaS UI redesign and follows the design system principles:
- Premium card styling with soft shadows
- Consistent spacing and typography
- Smooth transitions
- Dark mode support
- Accessibility-first approach
