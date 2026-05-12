import { Skeleton } from '@/components/ui/skeleton';

type PageSkeletonLoaderProps = {
  variant?: 'page' | 'table';
  rows?: number;
  columns?: number;
};

const PageSkeletonLoader = ({
  variant = 'page',
  rows = 5,
  columns = 5,
}: PageSkeletonLoaderProps) => {
  if (variant === 'table') {
    return (
      <div className='space-y-3'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <Skeleton className='h-10 w-full sm:max-w-md rounded-md' />
          <div className='flex items-center gap-2'>
            <Skeleton className='h-9 w-24 rounded-md' />
            <Skeleton className='h-9 w-24 rounded-md' />
          </div>
        </div>

        <div className='space-y-2'>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              className='grid gap-3 rounded-lg border border-border/60 bg-muted/20 p-3'
              style={{ gridTemplateColumns: `repeat(${Math.max(columns, 1)}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: Math.max(columns, 1) }).map((__, colIdx) => (
                <Skeleton key={`${rowIdx}-${colIdx}`} className='h-6 w-full rounded-md' />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-[1600] mx-auto space-y-8'>
      {/* Header Skeleton */}
      <div className='space-y-3'>
        <Skeleton className='h-12 w-72 rounded-md' /> {/* Title */}
        <Skeleton className='h-4 w-96 rounded-md' /> {/* Description */}
      </div>

      {/* Stats Cards Skeleton */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-5'>
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className='p-5 rounded-xl bg-[#1F1B16]/50 flex flex-col space-y-3'>
            <Skeleton className='h-4 w-24 rounded-md' /> {/* Label */}
            <Skeleton className='h-8 w-16 rounded-md' /> {/* Value */}
            <Skeleton className='h-2 w-12 rounded-md' /> {/* Trend */}
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className='space-y-4'>
        {/* Search + Add Button */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <Skeleton className='h-10 w-1/2 rounded-md' /> {/* Search */}
          <Skeleton className='h-10 w-32 rounded-md' /> {/* Add Button */}
        </div>

        {/* Table Rows */}
        <div className='space-y-2'>
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className='flex items-center justify-between bg-[#1F1B16]/50 p-4 rounded-lg space-x-4'
            >
              <Skeleton className='h-6 w-48 rounded-md' /> {/* Name / Website */}
              <div className='flex space-x-2'>
                <Skeleton className='h-8 w-8 rounded-md' /> {/* Actions */}
                <Skeleton className='h-8 w-8 rounded-md' />
                <Skeleton className='h-8 w-8 rounded-md' />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className='flex justify-end space-x-2 mt-4'>
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className='h-8 w-12 rounded-md' />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageSkeletonLoader;
