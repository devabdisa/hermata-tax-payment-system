import { ChevronLeft, ChevronRight } from 'lucide-react';



export const renderPageNumbers = (
  currentPage: number,
  totalPages: number,
  totalItems: number,
  pageSize: number,
  setCurrentPage: (page: number) => void,
) => {
  const pageNumbers = [];
  const maxPageNumbersToShow = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
  let endPage = startPage + maxPageNumbersToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const showFirstPage = startPage > 1;
  const showEllipsesBefore = startPage > 2;
  const showLastPage = endPage < totalPages;
  const showEllipsesAfter = endPage < totalPages - 1;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const t = { common: { pagination: { showing: 'Showing', to: 'to', of: 'of', results: 'results', previous: 'Previous', next: 'Next', totalItems: 'Total Items' } } };
  const paginationTranslations = t?.common?.pagination;

  return (
    <div className='flex flex-wrap justify-between gap-4 rounded-b-2xl border border-border bg-background px-4 py-2'>
      <div className='flex flex-wrap items-center gap-2'>
        <span className='text-sm text-muted-foreground'>
          {paginationTranslations?.showing ?? 'Showing'}
        </span>
        <span className='text-sm font-semibold text-foreground'>
          {startItem}-{endItem}
        </span>
        <span className='text-sm text-muted-foreground'>{paginationTranslations?.of ?? 'of'}</span>
        <span className='text-sm font-semibold text-foreground'>
          {paginationTranslations?.totalItems ?? 'Total Items'}
        </span>
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className='rounded-full border border-border p-3 transition-colors hover:bg-accent/35 disabled:opacity-50'
        >
          <ChevronLeft className='h-5 w-5 text-primary' />
        </button>

        <div className='flex flex-wrap items-center gap-2'>
          {showFirstPage && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className='flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent/35'
              >
                1
              </button>
              {showEllipsesBefore && <span className='text-muted-foreground'>...</span>}
            </>
          )}

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                page === currentPage
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-foreground hover:bg-accent/35'
              }`}
            >
              {page}
            </button>
          ))}

          {showLastPage && (
            <>
              {showEllipsesAfter && <span className='text-muted-foreground'>...</span>}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                  currentPage === totalPages
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-foreground hover:bg-accent/35'
                }`}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='rounded-full border border-border p-3 transition-colors hover:bg-accent/35 disabled:opacity-50'
        >
          <ChevronRight className='h-5 w-5 text-primary' />
        </button>
      </div>
    </div>
  );
};
