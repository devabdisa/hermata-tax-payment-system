import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  Filter,
  PlusCircle,
  Search,
  Settings,
  SquarePen,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { type ChangeEvent, Fragment, useEffect, useMemo, useRef, useState } from 'react';

import { AppEmptyState } from '@/components/feedback';
import PageSkeletonLoader from '@/components/loader/PageSkeletonLoader';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { DataGridProps } from '@/types/table';

import { RefreshButton } from '../button/RefreshButton';
import { renderPageNumbers } from './Pagination';

type RowWithAvatar = {
  avatar?: string;
  avatarUrl?: string;
};

const getAvatarSource = (row: unknown): string | null => {
  if (!row || typeof row !== 'object') {
    return null;
  }
  const avatarRow = row as RowWithAvatar;
  return avatarRow.avatarUrl ?? avatarRow.avatar ?? null;
};

export function BasicDataGrid<T>({
  data,
  columns,
  title,
  searchPlaceholder = 'Search...',
  showSearch = true,
  showColumnSelector = true,
  showPagination = true,
  showRowSelection = false,
  isFetching = false,
  refetch,
  currentPage = 1,
  totalPages = 1,
  totalItems: totalItemsProp,
  itemsPerPage = 10,
  onItemPerPageChange,
  onPageChange,
  onSearch,
  rowClickPath,
  onRowSelectionChange,
  onFilterClick,
  showFilter = false,
  onAddClick,
  showAddButton = false,
  buttonTitle = 'Add',
  showActions = true,
  onView,
  onEdit,
  onDelete,
  onSuspend,
  customButtons,
  onSortChange,
  initialSort,
  initialSearchValue,
  showItemsPerPage = false,
  isLoading = false,
}: DataGridProps<T>) {
  const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage);
  const randomNum = useRef(Math.floor(Math.random() * 1000) + 1);
  const [sorting, setSorting] = useState<SortingState>(
    initialSort ? [{ id: initialSort.id, desc: initialSort.desc }] : [],
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState(initialSearchValue ?? '');
  // const [t] = useTranslation();
  // const tableTranslations = t?.common?.table;
  const tableTranslations = { actions: 'Actions', customize: 'Customize', perPage: 'per page', noResults: 'No results found' };
  useEffect(() => {
    setItemsPerPageState(itemsPerPage);
  }, [itemsPerPage]);

  useEffect(() => {
    setSearchQuery(initialSearchValue ?? '');
  }, [initialSearchValue]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
      return;
    }
    setGlobalFilter(value);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPageState(value);
    if (onItemPerPageChange) {
      onItemPerPageChange(value);
    }
    if (onPageChange) {
      onPageChange(1);
    }
  };

  const tanstackColumns = useMemo<ColumnDef<T>[]>(() => {
    const result: ColumnDef<T>[] = [];

    if (showRowSelection) {
      result.push({
        id: 'select',
        sortingFn: 'textCaseSensitive',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label='Select all'
            className='border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary'
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Select row'
            className='border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary'
          />
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }

    columns.forEach((column: any) => {
      result.push({
        id: column.id,
        sortingFn: 'textCaseSensitive',
        accessorKey: column.accessorKey as string,
        header: ({ column: col }) => {
          if (!column.sortable) {
            return <span className=''>{column.header}</span>;
          }
          return (
            <Button
              variant='ghost'
              onClick={() => {
                const isSorted = col.getIsSorted();
                let newSort: { id: string; desc: boolean } | null = null;

                if (isSorted === 'asc') {
                  newSort = { id: column.id, desc: true };
                } else if (isSorted === 'desc') {
                  newSort = null;
                } else {
                  newSort = { id: column.id, desc: false };
                }

                setSorting(newSort ? [{ id: newSort.id, desc: newSort.desc }] : []);

                if (onSortChange) {
                  onSortChange(newSort);
                }
              }}
              className={`px-2 hover:bg-accent h-7 ${
                col.getIsSorted() ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <span className='font-medium tracking-wide text-xs uppercase'>{column.header}</span>
              {col.getIsSorted() === 'asc' ? (
                <ArrowUp className='ml-1.5 h-3 w-3 text-primary' />
              ) : col.getIsSorted() === 'desc' ? (
                <ArrowDown className='ml-1.5 h-3 w-3 text-primary' />
              ) : (
                <ArrowUpDown className='ml-1.5 h-3 w-3 text-muted-foreground' />
              )}
            </Button>
          );
        },
        cell: ({ row }) => {
          if (column.cell) {
            return column.cell(row.original);
          }
          const avatarSrc = column.id === 'name' ? getAvatarSource(row.original) : null;
          if (avatarSrc) {
            return (
              <div className='flex items-center gap-2'>
                <Image
                  width={36}
                  height={36}
                  src={avatarSrc}
                  alt={String(row.getValue(column.id))}
                  className='w-9 h-9 rounded-full object-cover border border-border'
                />
                <span className='text-sm text-foreground'>{String(row.getValue(column.id))}</span>
              </div>
            );
          }
          if (rowClickPath && column.id === 'name') {
            return (
              <Link
                href={rowClickPath(row.original)}
                className='text-link-text hover:text-link-hover-text hover:underline transition-colors duration-200 text-sm'
              >
                {String(row.getValue(column.id))}
              </Link>
            );
          }
          return <div className='text-sm text-foreground'>{String(row.getValue(column.id))}</div>;
        },
        enableSorting: column.sortable,
        enableHiding: column.filterable,
      });
    });

    if (showActions) {
      result.push({
        id: `actions-sample-${randomNum.current}`,

        header: () => (
          <span className='text-primary/80 font-medium tracking-wide text-xs uppercase'>
            {tableTranslations?.actions ?? 'Actions'}
          </span>
        ),
        enableHiding: false,
        enableSorting: true,
        cell: ({ row }) => (
          <div className='flex gap-1.5'>
            {onEdit && (
              <Button
                size='icon'
                variant='ghost'
                className='h-7 w-7 hover:bg-accent text-muted-foreground hover:text-primary transition-all duration-200'
                onClick={() => onEdit(row.original)}
              >
                <SquarePen className='h-3.5 w-3.5' />
                <span className='sr-only'>Edit</span>
              </Button>
            )}
            {onDelete && (
              <Button
                size='icon'
                variant='ghost'
                className='h-7 w-7 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-200'
                onClick={() => onDelete(row.original)}
              >
                <Trash2 className='h-3.5 w-3.5' />
                <span className='sr-only'>Delete</span>
              </Button>
            )}
            {onView && (
              <Button
                size='icon'
                variant='ghost'
                className='h-7 w-7 hover:bg-accent text-muted-foreground hover:text-primary transition-all duration-200'
                onClick={() => onView(row.original)}
              >
                <Eye className='h-3.5 w-3.5' />
                <span className='sr-only'>Detail</span>
              </Button>
            )}
            {onSuspend && (
              <Button
                size='icon'
                variant='ghost'
                className='h-7 w-7 text-muted-foreground transition-all duration-200 hover:bg-secondary/15 hover:text-secondary'
                onClick={() => onSuspend(row.original)}
              >
                <span className='sr-only'>Suspend</span>S
              </Button>
            )}
          </div>
        ),
      });
    }

    return result;
  }, [
    columns,
    showRowSelection,
    rowClickPath,
    showActions,
    onView,
    onEdit,
    onDelete,
    onSortChange,
  ]);

  const table = useReactTable({
    data,
    columns: tanstackColumns,
    initialState: {
      pagination: {
        pageSize: itemsPerPage,
      },
      sorting: initialSort ? [{ id: initialSort.id, desc: initialSort.desc }] : [],
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    ...(onSearch ? {} : { onGlobalFilterChange: setGlobalFilter }),
    getCoreRowModel: getCoreRowModel(),
    ...(onPageChange ? {} : { getPaginationRowModel: getPaginationRowModel() }),
    ...(onSearch ? {} : { getFilteredRowModel: getFilteredRowModel() }),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      ...(onSearch ? {} : { globalFilter }),
    },
    manualSorting: true,
    manualPagination: Boolean(onPageChange),
    ...(onPageChange ? { pageCount: totalPages } : {}),
  });

  useEffect(() => {
    if (onRowSelectionChange) {
      const selectedRows = table.getSelectedRowModel().flatRows.map((row) => row.original);
      onRowSelectionChange(selectedRows);
    }
  }, []);

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      table.setPageIndex(page - 1);
    }
  };

  return (
    <div className='mx-auto w-full space-y-6 rounded-2xl bg-background p-2 lg:p-4'>
      {title && (
        <div className='flex items-center justify-between'>
          <div className='relative'>
            <h2 className='text-2xl font-serif font-bold text-foreground tracking-tight'>
              {title}
            </h2>
            <div className='luxury-line w-12 mt-1'></div>
          </div>
        </div>
      )}

      <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
        <div className='w-full lg:max-w-xl lg:flex-1'>
          {showSearch && (
            <div className='relative w-full'>
              <Search
                className='pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground'
                aria-hidden
              />
              <input
                type='search'
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearch}
                className='h-12 w-full rounded-xl border border-border bg-background py-0 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-1 focus-visible:ring-offset-background'
              />
            </div>
          )}
        </div>

        <div className='flex flex-wrap items-center gap-2 lg:justify-end'>
          {refetch && <RefreshButton onClick={() => refetch()} isLoading={isFetching} />}
          {showColumnSelector && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  className='h-9 gap-2 border-border bg-secondary/20 text-foreground hover:border-primary/40 hover:bg-accent/45'
                >
                  <Settings className='h-3.5 w-3.5' />
                  <span className='text-sm'>{tableTranslations?.customize ?? 'Customize'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='bg-popover border-border'>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className='capitalize text-popover-foreground focus:bg-accent focus:text-accent-foreground'
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id.replace(/_/g, ' ')}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {showFilter && (
            <div
              className='flex cursor-pointer flex-row items-center justify-center gap-2 rounded-3xl border border-border bg-background px-4 py-3 transition-all duration-200 hover:bg-accent/50'
              onClick={onFilterClick}
            >
              <Filter className='h-4 w-4 text-primary/70' />
              <span className='text-[16px] font-medium text-foreground'>Filter</span>
            </div>
          )}

          {showItemsPerPage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  className='h-9 rounded-full gap-2 border-border bg-card px-4 text-foreground hover:border-primary/35 hover:bg-accent/35'
                >
                  <span className='text-sm'>
                    {itemsPerPageState} {tableTranslations?.perPage ?? 'per page'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='bg-popover border-border'>
                {[10, 20, 30, 40, 50].map((num) => (
                  <DropdownMenuCheckboxItem
                    key={num}
                    checked={itemsPerPageState === num}
                    onCheckedChange={() => handleItemsPerPageChange(num)}
                    className='text-popover-foreground focus:bg-accent focus:text-accent-foreground'
                  >
                    {num}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {customButtons &&
            customButtons.map((button: any, index: number) => <Fragment key={index}>{button}</Fragment>)}

          {showAddButton && (
            <Button
              size='sm'
              className='gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-9 px-4'
              onClick={onAddClick}
            >
              <PlusCircle className='h-3.5 w-3.5' />
              {buttonTitle}
            </Button>
          )}
        </div>
      </div>

      <div className='overflow-hidden rounded-xl border border-border bg-card shadow-sm ring-1 ring-border/35'>
        <Table>
          <TableHeader className='border-b border-border bg-muted/45'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className='border-b border-border/80 hover:bg-transparent'
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className='h-11 px-4 py-4 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground'
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className='[&_tr]:border-b-0'>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={tanstackColumns.length} className='p-4'>
                  <PageSkeletonLoader
                    variant='table'
                    rows={Math.max(Math.min(itemsPerPageState, 8), 4)}
                    columns={Math.max(tanstackColumns.length, 3)}
                  />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={`border-b-0 transition-colors duration-150 hover:bg-accent/35 ${
                    index % 2 === 0 ? 'bg-transparent' : 'bg-muted/22'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='py-3 px-4'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tanstackColumns.length} className='p-4'>
                  <AppEmptyState
                    icon={Search}
                    title={tableTranslations?.noResults ?? 'No results found'}
                    variant='tight'
                    iconSize='sm'
                    className='w-full border-0 bg-muted/10'
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <div className='w-full '>
          {renderPageNumbers(
            currentPage,
            totalPages,
            totalItemsProp ?? data.length,
            itemsPerPageState,
            handlePageChange,
          )}
        </div>
      )}
    </div>
  );
}
