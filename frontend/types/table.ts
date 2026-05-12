export type FilterValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | object
  | Array<string | number | boolean | null | undefined | object>;

export type Filters = Record<string, FilterValue>;

export interface UseTableStateProps {
  defaultPage?: number;
  defaultLimit?: number;
  defaultSearch?: string;
  defaultSortBy?: string;
  defaultSortOrder?: "asc" | "desc";
  defaultFilters?: Filters;
  debounceDelay?: number;
}

export interface UseTableStateReturn {
  page: number;
  limit: number;
  search: string;
  debouncedSearch: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  filters: Filters;
  
  handlePageChange: (newPage: number) => void;
  handleSearch: (searchTerm: string) => void;
  handleLimitChange: (newLimit: number) => void;
  handleSortChange: (newSortBy: string, newSortOrder: "asc" | "desc") => void;
  handleFilterChange: (newFilters: Filters) => void;
  setFilter: (key: string, value: FilterValue) => void;
  removeFilter: (key: string) => void;
  
  getQueryParams: () => Record<string, FilterValue>;
  resetFilters: () => void;
  resetAll: () => void;
}

export type DataGridProps<T = any> = any;