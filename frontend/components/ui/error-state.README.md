# ErrorState Component

Premium error feedback component with recovery actions for the Modern Civic SaaS UI redesign.

## Overview

The `ErrorState` component provides a consistent, premium-styled error feedback interface that displays error information with optional recovery actions. It's designed to handle various error scenarios gracefully while maintaining the Modern Civic SaaS aesthetic.

## Features

- ✅ Premium styling with soft shadows and borders
- ✅ Customizable error icon (defaults to AlertCircle)
- ✅ Optional error description
- ✅ Technical error details (collapsible)
- ✅ Retry button with callback support
- ✅ Full localization support
- ✅ Responsive design
- ✅ Accessibility compliant

## Requirements Satisfied

This component satisfies the following requirements from the design specification:

- **14.1**: Display error icon
- **14.2**: Display error title
- **14.3**: Display optional description
- **14.4**: Display optional error details
- **14.5**: Support retry button
- **14.6**: Invoke retry function on button click
- **14.7**: Apply premium styling with proper spacing
- **14.8**: Support localization

## Usage

### Basic Error

```tsx
import { ErrorState } from '@/components/ui/error-state';

<ErrorState
  title="Something went wrong"
  description="An unexpected error occurred. Please try again."
/>
```

### Error with Retry

```tsx
<ErrorState
  title="Failed to load data"
  description="We couldn't load the requested data."
  retry={() => refetch()}
  retryLabel="Try Again"
/>
```

### Error with Technical Details

```tsx
const error = new Error('Network request failed');

<ErrorState
  title="Network Error"
  description="Unable to connect to the server."
  error={error}
  retry={() => window.location.reload()}
/>
```

### Custom Icon

```tsx
import { WifiOff } from 'lucide-react';

<ErrorState
  title="No Internet Connection"
  description="Please check your network settings."
  icon={WifiOff}
  retry={() => window.location.reload()}
  retryLabel="Reload Page"
/>
```

### Localized Error (English)

```tsx
const dict = {
  errors: {
    failedToLoad: "Failed to Load Properties",
    failedToLoadDescription: "We encountered an error while loading your properties.",
    tryAgain: "Try Again"
  }
};

<ErrorState
  title={dict.errors.failedToLoad}
  description={dict.errors.failedToLoadDescription}
  retry={() => refetch()}
  retryLabel={dict.errors.tryAgain}
/>
```

### Localized Error (Amharic)

```tsx
const dict = {
  errors: {
    failedToLoad: "መረጃ መጫን አልተቻለም",
    failedToLoadDescription: "ንብረቶችዎን በመጫን ላይ ስህተት አጋጥሟል።",
    tryAgain: "እንደገና ይሞክሩ"
  }
};

<ErrorState
  title={dict.errors.failedToLoad}
  description={dict.errors.failedToLoadDescription}
  retry={() => refetch()}
  retryLabel={dict.errors.tryAgain}
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | Yes | - | Error title to display |
| `description` | `string` | No | - | Optional error description |
| `error` | `Error` | No | - | Optional error object for technical details |
| `retry` | `() => void` | No | - | Optional retry callback function |
| `retryLabel` | `string` | No | `"Try Again"` | Custom retry button label |
| `icon` | `React.ElementType` | No | `AlertCircle` | Custom icon component |
| `className` | `string` | No | - | Additional CSS classes |

## Styling

The component uses the following design tokens:

- **Border**: `border-destructive/20` - Soft red border
- **Background**: `bg-destructive/5` - Very light red background
- **Icon Background**: `bg-destructive/10` - Light red icon background
- **Text Color**: `text-destructive` - Red text for title
- **Button**: Outline variant with destructive accent

## Accessibility

- Uses semantic HTML elements
- Icon has `aria-hidden="true"` attribute
- Retry button is keyboard accessible
- Technical details use `<details>` element for progressive disclosure
- Proper heading hierarchy with `<h3>` for title

## Common Use Cases

### Data Fetching Error

```tsx
const { data, error, refetch } = useQuery('properties', fetchProperties);

if (error) {
  return (
    <ErrorState
      title="Failed to load properties"
      description="We couldn't load your properties. Please try again."
      error={error}
      retry={refetch}
    />
  );
}
```

### Network Error

```tsx
<ErrorState
  title="Network Error"
  description="Unable to connect to the server. Please check your internet connection."
  icon={WifiOff}
  retry={() => window.location.reload()}
  retryLabel="Reload Page"
/>
```

### Permission Error

```tsx
<ErrorState
  title="Access Denied"
  description="You don't have permission to access this resource."
  icon={AlertTriangle}
/>
```

### Validation Error

```tsx
<ErrorState
  title="Validation Failed"
  description="Please check your input and try again."
  icon={XCircle}
/>
```

## Integration with Dictionary

The component is designed to work seamlessly with the application's localization system. Error messages are available in both English and Amharic:

**English (`en.ts`)**:
```typescript
errors: {
  somethingWentWrong: "Something went wrong",
  unexpectedError: "An unexpected error occurred. Please try again.",
  failedToLoad: "Failed to load data",
  failedToLoadDescription: "We couldn't load the requested data. Please try again.",
  networkError: "Network Error",
  networkErrorDescription: "Unable to connect to the server. Please check your internet connection.",
  tryAgain: "Try Again",
  reload: "Reload",
  technicalDetails: "Technical Details"
}
```

**Amharic (`am.ts`)**:
```typescript
errors: {
  somethingWentWrong: "የሆነ ችግር ተፈጥሯል",
  unexpectedError: "ያልተጠበቀ ስህተት ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።",
  failedToLoad: "መረጃ መጫን አልተቻለም",
  failedToLoadDescription: "የተጠየቀውን መረጃ መጫን አልቻልንም። እባክዎ እንደገና ይሞክሩ።",
  networkError: "የኔትወርክ ስህተት",
  networkErrorDescription: "ከአገልጋዩ ጋር መገናኘት አልተቻለም። እባክዎ የበይነመረብ ግንኙነትዎን ያረጋግጡ።",
  tryAgain: "እንደገና ይሞክሩ",
  reload: "እንደገና ይጫኑ",
  technicalDetails: "ቴክኒካዊ ዝርዝሮች"
}
```

## Testing

The component includes comprehensive unit tests covering:

- ✅ Rendering error title
- ✅ Rendering optional description
- ✅ Rendering default and custom icons
- ✅ Rendering error details
- ✅ Rendering retry button
- ✅ Calling retry function on button click
- ✅ Custom retry button labels
- ✅ Custom className application
- ✅ Accessibility attributes
- ✅ Error stack trace rendering

Run tests with:
```bash
pnpm test error-state.test.tsx --run
```

## Related Components

- **EmptyState**: For empty data scenarios
- **Alert**: For inline alerts and notifications
- **Button**: Used for the retry action

## Design Inspiration

The ErrorState component follows the Modern Civic SaaS design system, drawing inspiration from:
- Linear's clarity and simplicity
- Vercel's polished error states
- Modern fintech dashboards' premium feel

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
