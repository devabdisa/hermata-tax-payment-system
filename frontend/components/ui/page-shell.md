# PageShell Component

## Overview

The `PageShell` component is a consistent content wrapper that provides max-width constraints and beautiful backgrounds for pages in the Modern Civic SaaS UI redesign. It ensures all pages have a uniform layout and visual treatment.

## Features

- **Max-width constraints**: Control content width with responsive breakpoints (sm, md, lg, xl, 2xl, full)
- **Background variations**: Choose from default, gradient, or glow backgrounds
- **Flexible padding**: Adjust spacing with sm, md, or lg padding options
- **Beautiful effects**: Subtle gradients and radial glow effects for premium feel
- **Responsive**: Works seamlessly across all screen sizes

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | Required | Content to render inside the page shell |
| `maxWidth` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'` | `'full'` | Maximum width constraint for content |
| `background` | `'default' \| 'gradient' \| 'glow'` | `'default'` | Background variation style |
| `padding` | `'sm' \| 'md' \| 'lg'` | `'md'` | Padding size around content |
| `className` | `string` | `undefined` | Additional CSS classes |

## Max-Width Options

- **sm**: `max-w-screen-sm` (640px) - For focused content like login forms
- **md**: `max-w-screen-md` (768px) - For medium-width content
- **lg**: `max-w-screen-lg` (1024px) - For standard pages
- **xl**: `max-w-screen-xl` (1280px) - For wide content
- **2xl**: `max-w-screen-2xl` (1536px) - For very wide content (recommended for dashboards)
- **full**: `max-w-full` - No width constraint (recommended for data tables)

## Background Variations

### Default
Simple solid background using the theme's background color.

```tsx
<PageShell background="default">
  {/* Content */}
</PageShell>
```

### Gradient
Subtle gradient from background to background-secondary, creating depth.

```tsx
<PageShell background="gradient">
  {/* Content */}
</PageShell>
```

### Glow
Radial glow effects positioned at top-center and right-side, creating a premium feel.

```tsx
<PageShell background="glow">
  {/* Content */}
</PageShell>
```

## Padding Sizes

- **sm**: `p-4` (16px) - Compact spacing
- **md**: `p-6` (24px) - Standard spacing (default)
- **lg**: `p-8` (32px) - Generous spacing

## Usage Examples

### Basic Dashboard Page

```tsx
import { PageShell } from '@/components/ui/page-shell';

export default function DashboardPage() {
  return (
    <PageShell maxWidth="2xl" background="gradient" padding="lg">
      <h1>Dashboard</h1>
      {/* Dashboard content */}
    </PageShell>
  );
}
```

### Data Table Page

```tsx
import { PageShell } from '@/components/ui/page-shell';

export default function PropertiesPage() {
  return (
    <PageShell maxWidth="full" background="default" padding="md">
      <h1>All Properties</h1>
      {/* Table component */}
    </PageShell>
  );
}
```

### Login Page

```tsx
import { PageShell } from '@/components/ui/page-shell';

export default function LoginPage() {
  return (
    <PageShell maxWidth="md" background="glow" padding="lg">
      <h1>Sign In</h1>
      {/* Login form */}
    </PageShell>
  );
}
```

### Form Page

```tsx
import { PageShell } from '@/components/ui/page-shell';

export default function CreatePropertyPage() {
  return (
    <PageShell maxWidth="xl" background="default" padding="lg">
      <h1>Create New Property</h1>
      {/* Form sections */}
    </PageShell>
  );
}
```

## Design Tokens

The PageShell component uses the following design tokens from the theme system:

- `--background`: Main background color
- `--background-secondary`: Secondary background for gradients
- `--primary`: Primary color for glow effects
- `--success`: Success color for glow effects

## Accessibility

- Uses semantic HTML structure
- Maintains proper heading hierarchy
- Ensures sufficient color contrast
- Works with keyboard navigation
- Compatible with screen readers

## Requirements Satisfied

This component satisfies the following requirements from the Modern Civic SaaS UI Redesign:

- **7.1**: Apply max-width constraints to page content
- **7.2**: Support different max-width options (sm, md, lg, xl, 2xl, full)
- **7.3**: Render beautiful background (subtle gradient or soft radial glow)
- **7.4**: Support different background variations (default, gradient, glow)
- **7.5**: Apply consistent page padding
- **7.6**: Support different padding sizes (sm, md, lg)

## Related Components

- `PageHeader`: Use inside PageShell for consistent page titles and actions
- `MetricCard`: Use inside PageShell for dashboard metrics
- `EnhancedTable`: Use inside PageShell for data tables
- `SectionCard`: Use inside PageShell for form sections

## Notes

- Always wrap page content with PageShell for consistency
- Choose max-width based on content type (full for tables, 2xl for dashboards, md for forms)
- Use gradient or glow backgrounds sparingly for premium pages
- The component automatically handles responsive behavior
- Glow effects are optimized for performance with `pointer-events-none`
