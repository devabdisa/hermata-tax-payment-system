/**
 * PageShell Component - Usage Examples
 * 
 * This file demonstrates various ways to use the PageShell component
 * in the Modern Civic SaaS UI redesign.
 */

import { PageShell } from './page-shell';

// Example 1: Basic usage with default settings
export function BasicExample() {
  return (
    <PageShell>
      <h1>Welcome to the Dashboard</h1>
      <p>This is a basic page with default settings.</p>
    </PageShell>
  );
}

// Example 2: Constrained width with gradient background
export function ConstrainedWidthExample() {
  return (
    <PageShell maxWidth="2xl" background="gradient">
      <h1>Properties Management</h1>
      <p>This page has a maximum width of 2xl with a gradient background.</p>
    </PageShell>
  );
}

// Example 3: Glow background with custom padding
export function GlowBackgroundExample() {
  return (
    <PageShell maxWidth="xl" background="glow" padding="lg">
      <h1>Premium Dashboard</h1>
      <p>This page features a radial glow effect with large padding.</p>
    </PageShell>
  );
}

// Example 4: Small width for focused content
export function FocusedContentExample() {
  return (
    <PageShell maxWidth="md" padding="sm">
      <h1>Login</h1>
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Sign In</button>
      </form>
    </PageShell>
  );
}

// Example 5: Full width for data tables
export function FullWidthExample() {
  return (
    <PageShell maxWidth="full" background="default" padding="md">
      <h1>All Properties</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Owner</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Property A</td>
            <td>John Doe</td>
            <td>Active</td>
          </tr>
        </tbody>
      </table>
    </PageShell>
  );
}

// Example 6: Combining with other UI components
export function CompletePageExample() {
  return (
    <PageShell maxWidth="2xl" background="gradient" padding="lg">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="premium-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Properties</h3>
          <p className="text-2xl font-bold text-foreground">1,234</p>
        </div>
        <div className="premium-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
          <p className="text-2xl font-bold text-foreground">$45,678</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="premium-card p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-muted-foreground">Your recent activity will appear here.</p>
      </div>
    </PageShell>
  );
}
