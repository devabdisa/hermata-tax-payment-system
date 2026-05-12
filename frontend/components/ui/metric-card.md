# MetricCard Component

Dynamic KPI cards for dashboard with premium styling.

## Overview

The `MetricCard` component displays key performance indicators (KPIs) with a premium, modern design. It supports trend indicators, icons, and descriptions, making it perfect for dashboard metrics and statistics displays.

## Requirements Validation

**Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9**

- ✅ 8.1: Display metric title
- ✅ 8.2: Display metric value (string or number)
- ✅ 8.3: Display change indicator with percentage and trend arrows
- ✅ 8.4: Display optional icon with colored background
- ✅ 8.5: Display optional description
- ✅ 8.6: Apply premium card styling with soft shadows
- ✅ 8.7: Display upward arrow in green for "up" trend
- ✅ 8.8: Display downward arrow in red for "down" trend
- ✅ 8.9: Display no arrow for "neutral" trend

## Features

- **Premium Styling**: Soft shadows, smooth transitions, and hover lift effects
- **Trend Indicators**: Up/down/neutral trends with color-coded arrows
- **Flexible Values**: Supports both numeric and string values
- **Icon Support**: Optional icon with customizable colors
- **Number Formatting**: Automatic locale-based number formatting
- **Responsive Design**: Works seamlessly across all screen sizes
- **Accessibility**: Proper ARIA labels and semantic HTML

## Props

```typescript
interface MetricCardProps {
  /** Metric title */
  title: string;
  
  /** Metric value (string or number) */
  value: string | number;
  
  /** Optional change indicator with trend */
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  
  /** Optional icon component from lucide-react */
  icon?: LucideIcon;
  
  /** Optional icon color class (e.g., "text-blue-600") */
  iconColor?: string;
  
  /** Optional description text */
  description?: string;
  
  /** Additional CSS classes */
  className?: string;
}
```

## Usage Examples

### Basic Usage

```tsx
import { Home } from 'lucide-react';
import { MetricCard } from '@/components/ui/metric-card';

<MetricCard
  title="Total Properties"
  value={1234}
  icon={Home}
  iconColor="text-blue-600"
/>
```

### With Trend Indicator

```tsx
import { DollarSign } from 'lucide-react';
import { MetricCard } from '@/components/ui/metric-card';

<MetricCard
  title="Monthly Revenue"
  value={50000}
  change={{ value: 12.5, trend: 'up' }}
  icon={DollarSign}
  iconColor="text-emerald-600"
  description="Compared to last month"
/>
```

### String Values

```tsx
<MetricCard
  title="System Status"
  value="Operational"
  icon={CheckCircle}
  iconColor="text-emerald-600"
/>
```

### Without Icon

```tsx
<MetricCard
  title="Completion Rate"
  value="94.5%"
  change={{ value: 2.1, trend: 'up' }}
/>
```

### Dashboard Grid Layout

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <MetricCard
    title="Total Properties"
    value={1234}
    change={{ value: 5.2, trend: 'up' }}
    icon={Home}
    iconColor="text-blue-600"
  />
  
  <MetricCard
    title="Total Assessments"
    value={856}
    change={{ value: -2.3, trend: 'down' }}
    icon={Calculator}
    iconColor="text-emerald-600"
  />
  
  <MetricCard
    title="Total Payments"
    value={642}
    change={{ value: 0, trend: 'neutral' }}
    icon={CreditCard}
    iconColor="text-purple-600"
  />
  
  <MetricCard
    title="Total Revenue"
    value={125000}
    change={{ value: 15.7, trend: 'up' }}
    icon={DollarSign}
    iconColor="text-amber-600"
  />
</div>
```

## Styling

The component uses the following CSS classes from the Modern Civic SaaS theme:

- `premium-card`: Premium card styling with soft shadows and borders
- `transition-smooth`: Smooth transitions for all state changes
- `hover-lift`: Lift effect on hover with enhanced shadow
- `text-success`: Green color for positive trends
- `text-destructive`: Red color for negative trends

## Number Formatting

Numeric values are automatically formatted using `toLocaleString()`:
- `1234` → `"1,234"`
- `1234567` → `"1,234,567"`
- `0` → `"0"`

String values are displayed as-is without formatting.

## Trend Indicators

The component supports three trend types:

1. **Up Trend** (`trend: 'up'`):
   - Green color (`text-success`)
   - Upward arrow icon
   - Indicates positive change

2. **Down Trend** (`trend: 'down'`):
   - Red color (`text-destructive`)
   - Downward arrow icon
   - Indicates negative change

3. **Neutral Trend** (`trend: 'neutral'`):
   - No arrow displayed
   - No color indicator
   - Indicates no change

## Accessibility

- Icons use `aria-hidden="true"` to prevent screen reader announcement
- Semantic HTML structure with proper heading hierarchy
- Color is not the only indicator (icons accompany trend colors)
- Proper contrast ratios for all text elements

## Testing

The component includes comprehensive unit tests covering:
- Basic rendering of title and value
- String and numeric value handling
- Trend indicators (up/down/neutral)
- Icon rendering
- Description rendering
- Custom className support
- Premium styling application
- Number formatting
- Edge cases (zero values, large numbers)

Run tests with:
```bash
pnpm test metric-card.test.tsx --run
```

## Design System Integration

The MetricCard component is part of the Modern Civic SaaS design system and integrates with:
- **Theme System**: Responds to light/dark mode changes
- **Color Tokens**: Uses CSS custom properties for consistent colors
- **Shadow Tokens**: Uses predefined shadow utilities
- **Typography Scale**: Follows the design system's typography hierarchy
- **Spacing System**: Uses consistent spacing tokens

## Related Components

- `PageHeader`: For page titles and actions
- `PageShell`: For consistent page layouts
- `StatusBadge`: For status indicators
- `EmptyState`: For empty data states

## Browser Support

The component works in all modern browsers that support:
- CSS custom properties
- CSS Grid
- Flexbox
- Backdrop filters (for glass effects)

## Performance

- Lightweight component with minimal re-renders
- No external dependencies beyond lucide-react
- Optimized for fast rendering in dashboard grids
- Supports React.memo for performance optimization

## Migration Guide

If you're migrating from a previous metric card implementation:

1. Update import path to `@/components/ui/metric-card`
2. Rename `changeValue` prop to `change.value`
3. Add `trend` property to `change` object
4. Update icon imports to use lucide-react
5. Replace custom color classes with `iconColor` prop

## Future Enhancements

Potential future improvements:
- Loading state support
- Skeleton loader integration
- Click handlers for interactive metrics
- Tooltip support for additional context
- Animation on value changes
- Sparkline chart integration
