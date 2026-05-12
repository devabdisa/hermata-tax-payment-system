# PageHeader Component

A shared component for consistent page titles and actions across the application. Part of the Modern Civic SaaS UI redesign.

## Features

- ✅ Display page title with proper typography hierarchy
- ✅ Support optional eyebrow text (breadcrumb or category)
- ✅ Support optional description
- ✅ Support optional icon with gradient tile background
- ✅ Support primary and secondary action buttons
- ✅ Support localized labels
- ✅ Responsive layout (stacks on mobile, side-by-side on desktop)
- ✅ Accessible with proper heading structure and ARIA labels

## Requirements Validation

**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7**

- **6.1**: Display page title with proper typography hierarchy
- **6.2**: Display optional eyebrow text above title
- **6.3**: Display optional description below title
- **6.4**: Display optional icon with gradient tile background
- **6.5**: Display optional primary action button
- **6.6**: Display optional secondary action button
- **6.7**: Support localized labels

## Props

```typescript
interface PageHeaderProps {
  /** Page title (required) */
  title: string;
  
  /** Optional description text */
  description?: string;
  
  /** Optional eyebrow text (breadcrumb or category) */
  eyebrow?: string;
  
  /** Optional icon component from lucide-react */
  icon?: LucideIcon;
  
  /** Optional primary action button */
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    disabled?: boolean;
  };
  
  /** Optional secondary action button */
  secondaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  
  /** Additional CSS classes */
  className?: string;
}
```

## Usage

### Basic Usage

```tsx
import { PageHeader } from '@/components/ui/page-header';

export default function MyPage() {
  return (
    <div>
      <PageHeader title="Dashboard" />
      {/* Page content */}
    </div>
  );
}
```

### With Description

```tsx
<PageHeader
  title="Properties"
  description="Manage all property registrations and documentation"
/>
```

### With Icon and Eyebrow

```tsx
import { Home } from 'lucide-react';

<PageHeader
  eyebrow="Management"
  icon={Home}
  title="Properties"
  description="Manage all property registrations and documentation"
/>
```

### With Actions

```tsx
import { Home, Plus } from 'lucide-react';

<PageHeader
  icon={Home}
  title="Properties"
  description="Manage all property registrations and documentation"
  primaryAction={{
    label: 'Add Property',
    onClick: () => router.push('/properties/new'),
    icon: Plus,
  }}
  secondaryAction={{
    label: 'Export',
    onClick: handleExport,
  }}
/>
```

### With Localization

```tsx
import { Home, Plus } from 'lucide-react';

export default function PropertiesPage({ dict, locale }) {
  return (
    <PageHeader
      eyebrow={dict.common.navGroups.management}
      icon={Home}
      title={dict.properties.title}
      description={dict.properties.description}
      primaryAction={{
        label: dict.properties.addProperty,
        onClick: handleAddProperty,
        icon: Plus,
      }}
      secondaryAction={{
        label: dict.common.export,
        onClick: handleExport,
      }}
    />
  );
}
```

### With Disabled Actions

```tsx
<PageHeader
  title="Properties"
  primaryAction={{
    label: 'Add Property',
    onClick: handleAddProperty,
    disabled: true, // Button will be disabled
  }}
/>
```

## Styling

The PageHeader component uses the following design tokens:

- **Typography**: `text-3xl font-semibold tracking-tight` for title
- **Icon Background**: Gradient from `primary/10` to transparent with border
- **Spacing**: Consistent gap spacing with responsive layout
- **Colors**: Uses theme colors (primary, muted-foreground, foreground)

### Custom Styling

You can add custom classes using the `className` prop:

```tsx
<PageHeader
  title="Properties"
  className="mb-8"
/>
```

## Layout Behavior

- **Desktop (≥640px)**: Icon, text, and actions are arranged horizontally
- **Mobile (<640px)**: Content stacks vertically for better readability
- **Actions**: Always grouped together on the right (desktop) or bottom (mobile)

## Accessibility

- Uses semantic `<h1>` tag for the title
- Icons are marked with `aria-hidden="true"` as they are decorative
- Buttons have proper accessible labels
- Proper heading hierarchy for screen readers
- Focus indicators on interactive elements

## Best Practices

1. **Use consistent eyebrow text**: Use navigation group names (e.g., "Management", "Administration")
2. **Keep titles concise**: Aim for 1-3 words
3. **Provide descriptions**: Help users understand the page purpose
4. **Use appropriate icons**: Choose icons that represent the page content
5. **Localize all text**: Always use dictionary values for labels
6. **Limit actions**: Use 1-2 actions maximum to avoid clutter
7. **Primary vs Secondary**: Use primary for the main action, secondary for supporting actions

## Examples

See `page-header.example.tsx` for comprehensive usage examples including:

- Basic page header
- With description
- With eyebrow text
- With icon
- With actions
- Localized versions
- Disabled states
- Full page layouts

## Testing

The component includes comprehensive tests covering:

- Basic rendering
- Optional props
- Action button clicks
- Styling and layout
- Accessibility
- Edge cases

Run tests with:

```bash
pnpm test page-header.test.tsx
```

## Related Components

- **PageShell**: Wraps page content with max-width and background
- **Button**: Used for action buttons
- **Icons**: From lucide-react library

## Design System

This component is part of the Modern Civic SaaS UI redesign and follows the design system principles:

- Premium card styling with soft shadows
- Gradient backgrounds for visual interest
- Consistent spacing and typography
- Responsive and accessible by default
- Localization support built-in
