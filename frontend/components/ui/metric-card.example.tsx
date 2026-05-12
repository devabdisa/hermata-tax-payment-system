import { Calculator, CreditCard, DollarSign, Home } from 'lucide-react';

import { MetricCard } from './metric-card';

/**
 * MetricCard Component Examples
 * 
 * Demonstrates various usage patterns for the MetricCard component.
 */

export function MetricCardExamples() {
  return (
    <div className="space-y-8 p-8">
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Basic Usage</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Properties"
            value={1234}
            icon={Home}
            iconColor="text-blue-600"
          />
          
          <MetricCard
            title="Total Assessments"
            value={856}
            icon={Calculator}
            iconColor="text-emerald-600"
          />
          
          <MetricCard
            title="Total Payments"
            value={642}
            icon={CreditCard}
            iconColor="text-purple-600"
          />
          
          <MetricCard
            title="Total Revenue"
            value="$125,000"
            icon={DollarSign}
            iconColor="text-amber-600"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">With Trend Indicators</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Monthly Revenue"
            value={50000}
            change={{ value: 12.5, trend: 'up' }}
            icon={DollarSign}
            iconColor="text-emerald-600"
            description="Compared to last month"
          />
          
          <MetricCard
            title="Pending Payments"
            value={23}
            change={{ value: -8.3, trend: 'down' }}
            icon={CreditCard}
            iconColor="text-blue-600"
            description="Decrease from last week"
          />
          
          <MetricCard
            title="Active Properties"
            value={1150}
            change={{ value: 0, trend: 'neutral' }}
            icon={Home}
            iconColor="text-slate-600"
            description="No change this month"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">With Descriptions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <MetricCard
            title="New Registrations"
            value={45}
            change={{ value: 25.0, trend: 'up' }}
            icon={Home}
            iconColor="text-blue-600"
            description="Properties registered this month"
          />
          
          <MetricCard
            title="Overdue Payments"
            value={12}
            change={{ value: -15.5, trend: 'down' }}
            icon={CreditCard}
            iconColor="text-red-600"
            description="Reduced from last month"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">String Values</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="System Status"
            value="Operational"
            icon={Home}
            iconColor="text-emerald-600"
          />
          
          <MetricCard
            title="Last Sync"
            value="2 minutes ago"
            icon={Calculator}
            iconColor="text-blue-600"
          />
          
          <MetricCard
            title="Active Users"
            value="1.2K"
            change={{ value: 5.2, trend: 'up' }}
            icon={Home}
            iconColor="text-purple-600"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Large Numbers</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <MetricCard
            title="Total Revenue (YTD)"
            value={1234567}
            change={{ value: 18.7, trend: 'up' }}
            icon={DollarSign}
            iconColor="text-emerald-600"
            description="Year-to-date revenue"
          />
          
          <MetricCard
            title="Total Transactions"
            value={9876543}
            change={{ value: 22.3, trend: 'up' }}
            icon={CreditCard}
            iconColor="text-blue-600"
            description="All-time transaction count"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Without Icons</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Completion Rate"
            value="94.5%"
            change={{ value: 2.1, trend: 'up' }}
          />
          
          <MetricCard
            title="Average Processing Time"
            value="2.3 days"
            change={{ value: -12.0, trend: 'down' }}
            description="Faster than last month"
          />
          
          <MetricCard
            title="Customer Satisfaction"
            value="4.8/5.0"
            change={{ value: 0, trend: 'neutral' }}
          />
        </div>
      </section>
    </div>
  );
}
