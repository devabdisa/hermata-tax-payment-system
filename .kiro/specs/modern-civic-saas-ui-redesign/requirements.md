# Requirements Document: Modern Civic SaaS UI Redesign

## Introduction

This document specifies the requirements for transforming the Hermata Tax and Property Payment Management System from a basic government portal into a world-class, modern SaaS platform. The redesign focuses on creating a premium, calm, clean, and trustworthy visual experience while maintaining all existing functionality. The design system draws inspiration from Linear's clarity, Vercel's polish, and modern fintech dashboards.

## Glossary

- **Theme_System**: The CSS custom properties and design tokens that define the visual appearance of the application
- **Premium_Sidebar**: The enhanced navigation component with gradient active states and premium spacing
- **Polished_Header**: The glass-effect topbar with elegant controls
- **Page_Shell**: The consistent content wrapper that provides max-width constraints and beautiful backgrounds
- **Metric_Card**: Dynamic KPI display component for dashboard metrics
- **Status_Badge**: Unified status indicator component with localized labels and icons
- **Enhanced_Table**: Premium data table component with improved toolbar and interactions
- **Section_Card**: Premium form section component with clear visual grouping
- **Empty_State**: Premium feedback component for empty data scenarios
- **Error_State**: Premium error feedback component with recovery actions
- **RBAC**: Role-Based Access Control system for authorization
- **StatusType**: Enumeration of all possible entity statuses (DRAFT, SUBMITTED, APPROVED, etc.)
- **UserRole**: Enumeration of user roles in the system
- **Dictionary**: Localization object containing translated strings for a specific locale

## Requirements

### Requirement 1: Theme System

**User Story:** As a user, I want a modern, premium visual design, so that the application feels professional and trustworthy.

#### Acceptance Criteria

1. THE Theme_System SHALL define CSS custom properties for background colors (soft blue-gray), surface colors (white/translucent), primary colors (deep royal blue #1e3a8a), secondary colors (emerald/teal), and border colors (soft slate/blue-gray)
2. THE Theme_System SHALL define shadow tokens for soft shadows, elevated shadows, and glow effects
3. THE Theme_System SHALL define spacing tokens for sidebar width (16rem), header height (3.5rem), and content padding (1.5rem)
4. THE Theme_System SHALL support both light and dark color modes
5. WHERE the user selects a theme mode, THE Theme_System SHALL apply the corresponding CSS custom properties to the document root
6. WHEN the theme mode changes, THE Theme_System SHALL persist the user's preference to localStorage
7. THE Theme_System SHALL integrate with Tailwind CSS 4 for consistent styling

### Requirement 2: Theme Application

**User Story:** As a user, I want to switch between light and dark themes, so that I can use the application comfortably in different lighting conditions.

#### Acceptance Criteria

1. WHEN the user selects light mode, THE Theme_System SHALL apply light theme CSS classes to the document root
2. WHEN the user selects dark mode, THE Theme_System SHALL apply dark theme CSS classes to the document root
3. WHEN the user selects system mode, THE Theme_System SHALL detect the operating system's color scheme preference and apply the matching theme
4. WHEN the theme mode changes, THE Theme_System SHALL dispatch a theme change event
5. WHEN the theme mode changes, THE Theme_System SHALL update all components to reflect the new theme without requiring a page reload
6. IF localStorage is not available, THEN THE Theme_System SHALL fall back to light mode without persisting the preference

### Requirement 3: Premium Sidebar Navigation

**User Story:** As a user, I want a world-class navigation sidebar, so that I can easily access different sections of the application.

#### Acceptance Criteria

1. THE Premium_Sidebar SHALL display a brand block with the application name and subtitle
2. THE Premium_Sidebar SHALL organize navigation items into groups (Overview, Management, Revenue, Administration)
3. WHEN a navigation item is active, THE Premium_Sidebar SHALL apply a gradient background or elevated pill style to that item
4. WHEN the user hovers over a navigation item, THE Premium_Sidebar SHALL display a smooth hover state with transitions
5. THE Premium_Sidebar SHALL display icons for each navigation item using lucide-react
6. THE Premium_Sidebar SHALL support collapsed and mobile-open states
7. THE Premium_Sidebar SHALL have a fixed width of 16rem (256px) when expanded
8. THE Premium_Sidebar SHALL localize all navigation labels based on the current locale

### Requirement 4: Navigation Access Control

**User Story:** As a system administrator, I want navigation items to be filtered based on user roles and permissions, so that users only see sections they can access.

#### Acceptance Criteria

1. WHEN rendering navigation items, THE Premium_Sidebar SHALL filter items based on the user's role
2. WHERE a navigation item has role restrictions, THE Premium_Sidebar SHALL only display that item if the user's role is in the allowed roles list
3. WHERE a navigation item has permission restrictions, THE Premium_Sidebar SHALL only display that item if the user has the required permission
4. WHERE a navigation item has no restrictions, THE Premium_Sidebar SHALL always display that item
5. THE Premium_Sidebar SHALL preserve the order of navigation items after filtering
6. THE Premium_Sidebar SHALL not mutate the original navigation configuration when filtering

### Requirement 5: Polished Header/Topbar

**User Story:** As a user, I want a premium topbar with elegant controls, so that I can access key functions and settings easily.

#### Acceptance Criteria

1. THE Polished_Header SHALL display page context or breadcrumb information on the left side
2. THE Polished_Header SHALL display a "Live System" badge on the right side
3. THE Polished_Header SHALL display a language switcher control on the right side
4. THE Polished_Header SHALL display a theme toggle control on the right side
5. THE Polished_Header SHALL display a user avatar with dropdown menu on the right side
6. THE Polished_Header SHALL apply a glass effect with backdrop blur
7. THE Polished_Header SHALL have a fixed height of 3.5rem (56px)
8. THE Polished_Header SHALL render elegant separators between controls
9. THE Polished_Header SHALL remain sticky at the top when scrolling

### Requirement 6: Page Header Component

**User Story:** As a developer, I want a consistent page header component, so that all pages have uniform title and action layouts.

#### Acceptance Criteria

1. THE Page_Header SHALL display a page title with proper typography hierarchy
2. WHERE an eyebrow text is provided, THE Page_Header SHALL display it above the title
3. WHERE a description is provided, THE Page_Header SHALL display it below the title
4. WHERE an icon is provided, THE Page_Header SHALL display it with a gradient tile background
5. WHERE a primary action is provided, THE Page_Header SHALL display a primary action button
6. WHERE a secondary action is provided, THE Page_Header SHALL display a secondary action button
7. THE Page_Header SHALL localize all labels based on the current locale

### Requirement 7: Page Shell Component

**User Story:** As a developer, I want a consistent page wrapper, so that all pages have uniform max-width and background styling.

#### Acceptance Criteria

1. THE Page_Shell SHALL apply max-width constraints to page content
2. THE Page_Shell SHALL support different max-width options (sm, md, lg, xl, 2xl, full)
3. THE Page_Shell SHALL render a beautiful background (subtle gradient or soft radial glow)
4. THE Page_Shell SHALL support different background variations (default, gradient, glow)
5. THE Page_Shell SHALL apply consistent page padding
6. THE Page_Shell SHALL support different padding sizes (sm, md, lg)

### Requirement 8: Metric Card Component

**User Story:** As a user, I want to see key metrics on the dashboard, so that I can quickly understand system performance.

#### Acceptance Criteria

1. THE Metric_Card SHALL display a metric title
2. THE Metric_Card SHALL display a metric value (string or number)
3. WHERE a change indicator is provided, THE Metric_Card SHALL display the percentage change with an up/down arrow
4. WHERE an icon is provided, THE Metric_Card SHALL display it with a colored background
5. WHERE a description is provided, THE Metric_Card SHALL display it below the value
6. THE Metric_Card SHALL apply premium card styling with soft shadows
7. WHEN the trend is "up", THE Metric_Card SHALL display an upward arrow in green
8. WHEN the trend is "down", THE Metric_Card SHALL display a downward arrow in red
9. WHEN the trend is "neutral", THE Metric_Card SHALL display no arrow

### Requirement 9: Metric Change Calculation

**User Story:** As a system, I want to calculate metric changes accurately, so that users see correct trend information.

#### Acceptance Criteria

1. WHEN calculating metric change, THE System SHALL compute the percentage change between current and previous values
2. WHEN the previous value is zero, THE System SHALL return a change value of 0 with neutral trend
3. WHEN the change is positive, THE System SHALL return an "up" trend
4. WHEN the change is negative, THE System SHALL return a "down" trend
5. WHEN the change is zero, THE System SHALL return a "neutral" trend
6. THE System SHALL round the change value to 1 decimal place
7. THE System SHALL not throw division by zero errors

### Requirement 10: Status Badge Component

**User Story:** As a user, I want to see clear status indicators, so that I can quickly understand the state of entities.

#### Acceptance Criteria

1. THE Status_Badge SHALL display a localized status label
2. THE Status_Badge SHALL apply color-coded styling based on the status type
3. WHERE showIcon is true, THE Status_Badge SHALL display an icon appropriate for the status type
4. THE Status_Badge SHALL support different sizes (sm, md, lg)
5. THE Status_Badge SHALL map DRAFT status to gray colors with FileText icon
6. THE Status_Badge SHALL map APPROVED status to green colors with CheckCircle icon
7. THE Status_Badge SHALL map REJECTED status to red colors with XCircle icon
8. THE Status_Badge SHALL map PENDING status to yellow colors with Clock icon
9. THE Status_Badge SHALL map PAID status to emerald colors with CheckCircle icon
10. THE Status_Badge SHALL map OVERDUE status to red colors with AlertCircle icon
11. IF a translation is missing, THEN THE Status_Badge SHALL fall back to the raw status value

### Requirement 11: Enhanced Table Component

**User Story:** As a user, I want premium data tables, so that I can view and interact with data efficiently.

#### Acceptance Criteria

1. THE Enhanced_Table SHALL render data in a premium container card with soft shadows
2. THE Enhanced_Table SHALL display a toolbar with search, filters, customize, and page size controls
3. THE Enhanced_Table SHALL apply better header styling with proper typography
4. WHEN the user hovers over a table row, THE Enhanced_Table SHALL display a hover effect
5. WHEN the table has no data, THE Enhanced_Table SHALL display a premium empty state
6. THE Enhanced_Table SHALL display pagination information in the format "Showing X-Y of Z items"
7. THE Enhanced_Table SHALL support configurable page sizes
8. THE Enhanced_Table SHALL localize all labels based on the current locale
9. THE Enhanced_Table SHALL maintain consistent row density and spacing

### Requirement 12: Section Card Component

**User Story:** As a user, I want form sections to be clearly grouped, so that I can understand the structure of complex forms.

#### Acceptance Criteria

1. THE Section_Card SHALL display a section title
2. WHERE a description is provided, THE Section_Card SHALL display it below the title
3. THE Section_Card SHALL group related form fields within a premium card
4. WHERE collapsible is true, THE Section_Card SHALL support expanding and collapsing the section
5. WHERE defaultOpen is provided, THE Section_Card SHALL use it to set the initial collapsed state
6. THE Section_Card SHALL apply consistent padding and spacing
7. THE Section_Card SHALL render with soft shadows and borders

### Requirement 13: Empty State Component

**User Story:** As a user, I want clear feedback when there is no data, so that I understand the current state and what actions I can take.

#### Acceptance Criteria

1. THE Empty_State SHALL display a title
2. WHERE an icon is provided, THE Empty_State SHALL display it
3. WHERE a description is provided, THE Empty_State SHALL display it below the title
4. WHERE an action is provided, THE Empty_State SHALL display a call-to-action button
5. THE Empty_State SHALL apply premium styling with proper spacing
6. THE Empty_State SHALL localize all labels based on the current locale

### Requirement 14: Error State Component

**User Story:** As a user, I want clear error feedback with recovery options, so that I can understand what went wrong and how to fix it.

#### Acceptance Criteria

1. THE Error_State SHALL display an error icon
2. THE Error_State SHALL display an error title
3. WHERE a description is provided, THE Error_State SHALL display it below the title
4. WHERE error details are provided, THE Error_State SHALL display them
5. WHERE a retry function is provided, THE Error_State SHALL display a retry button
6. WHEN the user clicks the retry button, THE Error_State SHALL invoke the retry function
7. THE Error_State SHALL apply premium styling with proper spacing
8. THE Error_State SHALL localize all labels based on the current locale

### Requirement 15: Language Switching

**User Story:** As a user, I want to switch between languages, so that I can use the application in my preferred language.

#### Acceptance Criteria

1. WHEN the user selects a different language, THE System SHALL update the locale
2. WHEN the locale changes, THE System SHALL re-render all components with the new dictionary
3. THE System SHALL support English and Amharic languages
4. THE System SHALL persist the user's language preference
5. THE System SHALL localize all navigation labels, page titles, form labels, button labels, and status labels

### Requirement 16: Responsive Layout

**User Story:** As a user, I want the application to work on different screen sizes, so that I can use it on desktop, tablet, and mobile devices.

#### Acceptance Criteria

1. WHEN the viewport width is less than 768px, THE Premium_Sidebar SHALL collapse to a mobile menu
2. WHEN the viewport width is less than 768px, THE System SHALL display a hamburger menu button
3. WHEN the user clicks the hamburger menu button, THE Premium_Sidebar SHALL open as an overlay
4. THE System SHALL apply responsive grid layouts for metric cards (1 column on mobile, 2 on tablet, 4 on desktop)
5. THE Enhanced_Table SHALL scroll horizontally on small screens when content exceeds viewport width
6. THE Polished_Header SHALL remain functional on all screen sizes

### Requirement 17: Animation and Transitions

**User Story:** As a user, I want smooth animations and transitions, so that the interface feels polished and responsive.

#### Acceptance Criteria

1. WHEN the theme changes, THE System SHALL animate the transition smoothly
2. WHEN navigation items change state, THE Premium_Sidebar SHALL animate the transition smoothly
3. WHEN hovering over interactive elements, THE System SHALL display smooth hover transitions
4. THE System SHALL use CSS transforms and opacity for animations (GPU-accelerated)
5. THE System SHALL avoid animating layout properties that cause reflows

### Requirement 18: Performance Optimization

**User Story:** As a user, I want the application to load quickly and respond smoothly, so that I can work efficiently.

#### Acceptance Criteria

1. THE System SHALL use CSS custom properties for theming to enable instant theme switching without re-rendering React components
2. THE System SHALL memoize expensive components like tables and charts to prevent unnecessary re-renders
3. THE System SHALL lazy load heavy components (charts, complex forms) to improve initial page load
4. THE System SHALL use Next.js Image component for optimized loading of user avatars and icons
5. THE System SHALL keep component library imports tree-shakeable to minimize bundle size

### Requirement 19: Accessibility

**User Story:** As a user with accessibility needs, I want the application to be usable with assistive technologies, so that I can access all features.

#### Acceptance Criteria

1. THE System SHALL use semantic HTML elements for proper document structure
2. THE System SHALL provide keyboard navigation for all interactive elements
3. THE System SHALL provide sufficient color contrast ratios for text and interactive elements
4. THE System SHALL provide focus indicators for keyboard navigation
5. THE System SHALL provide ARIA labels for icon-only buttons
6. THE Status_Badge SHALL include both color and icon to convey status (not relying on color alone)

### Requirement 20: Security

**User Story:** As a system administrator, I want the UI to enforce security best practices, so that user data is protected.

#### Acceptance Criteria

1. THE System SHALL enforce RBAC filtering on both client and server to prevent unauthorized access
2. THE System SHALL sanitize all user-generated content before rendering to prevent XSS attacks
3. THE System SHALL not store sensitive data in localStorage
4. THE System SHALL use authenticated API routes with proper authorization checks for all data fetching

### Requirement 21: Error Handling

**User Story:** As a user, I want the application to handle errors gracefully, so that I can continue working even when issues occur.

#### Acceptance Criteria

1. IF localStorage is not available, THEN THE Theme_System SHALL fall back to light mode without persisting preference
2. IF a dictionary key does not exist for the current locale, THEN THE System SHALL fall back to English label or raw value
3. IF a navigation item has an invalid icon key or missing href, THEN THE Premium_Sidebar SHALL skip that item and log a warning
4. IF invalid numeric values are passed to metric calculation, THEN THE System SHALL return neutral trend with 0 value
5. THE System SHALL log errors to the console for debugging purposes
6. THE System SHALL display user-friendly error messages rather than technical error details

### Requirement 22: Dashboard Metrics Display

**User Story:** As a user, I want to see key metrics on the dashboard, so that I can monitor system performance at a glance.

#### Acceptance Criteria

1. THE Dashboard SHALL display a metric card for total properties
2. THE Dashboard SHALL display a metric card for total assessments
3. THE Dashboard SHALL display a metric card for total payments
4. THE Dashboard SHALL display a metric card for total revenue
5. WHEN metric data is available, THE Dashboard SHALL display percentage change and trend indicators
6. THE Dashboard SHALL arrange metric cards in a responsive grid (1 column on mobile, 2 on tablet, 4 on desktop)
7. THE Dashboard SHALL use appropriate icons for each metric (Home, Calculator, CreditCard, DollarSign)

### Requirement 23: Data Validation

**User Story:** As a developer, I want data models to be validated, so that the application handles data correctly.

#### Acceptance Criteria

1. WHEN validating theme configuration, THE System SHALL ensure mode is one of 'light', 'dark', or 'system'
2. WHERE a custom primary color is provided, THE System SHALL validate it is a valid hex color
3. WHERE a custom border radius is provided, THE System SHALL validate it is between 0 and 1
4. WHEN validating navigation configuration, THE System SHALL ensure each navigation item has a unique href
5. WHEN validating navigation configuration, THE System SHALL ensure icon keys exist in the icon map
6. WHEN validating navigation configuration, THE System SHALL ensure dict keys exist in the dictionary
7. WHEN validating dashboard metrics, THE System SHALL ensure values are non-negative numbers
8. WHEN validating dashboard metrics, THE System SHALL ensure trend is one of 'up', 'down', or 'neutral'

### Requirement 24: Component Integration

**User Story:** As a developer, I want components to integrate seamlessly, so that the application has a consistent look and feel.

#### Acceptance Criteria

1. THE System SHALL use consistent spacing tokens across all components
2. THE System SHALL use consistent color tokens across all components
3. THE System SHALL use consistent shadow tokens across all components
4. THE System SHALL use consistent typography scale across all components
5. THE System SHALL use consistent border radius across all components
6. THE System SHALL ensure all components respond to theme changes
7. THE System SHALL ensure all components support localization

### Requirement 25: Dependencies Management

**User Story:** As a developer, I want clear dependency requirements, so that I can set up the development environment correctly.

#### Acceptance Criteria

1. THE System SHALL use Next.js 16.2.6 as the core framework
2. THE System SHALL use React 19.2.6 for component rendering
3. THE System SHALL use TypeScript 5 for type safety
4. THE System SHALL use Tailwind CSS 4 for styling
5. THE System SHALL use shadcn/ui (Radix UI primitives) for accessible components
6. THE System SHALL use lucide-react for icons
7. THE System SHALL use Recharts 3.8.1 for data visualization
8. THE System SHALL use react-hook-form 7.54.2 for form handling
9. THE System SHALL use zod 3.24.1 for schema validation
10. THE System SHALL use PNPM as the package manager
