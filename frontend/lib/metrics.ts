/**
 * Metrics Utilities
 * 
 * Helper functions for calculating metric changes and trend indicators.
 */

export interface MetricTrend {
  value: number;
  isPositive: boolean;
  percentage: string;
}

/**
 * Calculates the percentage change between a current value and a previous value.
 * 
 * @param current - The current value
 * @param previous - The previous value
 * @returns MetricTrend object
 */
export function calculateMetricChange(current: number, previous: number): MetricTrend {
  if (previous === 0) {
    return {
      value: current > 0 ? 100 : 0,
      isPositive: current > 0,
      percentage: current > 0 ? '+100%' : '0%',
    };
  }

  const change = ((current - previous) / previous) * 100;
  const isPositive = change >= 0;
  const percentage = `${isPositive ? '+' : ''}${change.toFixed(1)}%`;

  return {
    value: Math.abs(change),
    isPositive,
    percentage,
  };
}

/**
 * Formats currency values in ETB
 * 
 * @param amount - The amount to format
 * @returns Formatted string
 */
export function formatETB(amount: number): string {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats large numbers with suffixes (k, M)
 * 
 * @param value - The value to format
 * @returns Formatted string
 */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value);
}
