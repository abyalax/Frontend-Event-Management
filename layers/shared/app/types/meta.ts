export type SortOrder = 'ASC' | 'DESC';
export interface MetaRequest<E = undefined> {
  page: number;
  limit: number;
  sort_by?: keyof E | string;
  sort_order?: SortOrder;
  search?: string;
}

export interface Paginated<T> {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: [string, SortOrder][];
    searchBy: string[];
    search: string;
    select: string[];
    filter?: {
      [column: string]: string | string[];
    };
    cursor?: string;
  };
  links: {
    first?: string;
    previous?: string;
    current: string;
    next?: string;
    last?: string;
  };
}
