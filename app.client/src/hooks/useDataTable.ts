import { useState, useMemo, useEffect } from "react";

export type SortOrder = "asc" | "desc" | null;

export interface UseDataTableOptions<T> {
  data: T[];
  initialSortField?: string | keyof T;
  initialSortOrder?: SortOrder;
  initialPageSize?: number;
  customValueGetters?: Record<string, (item: T) => any>;
}

export interface UseDataTableReturn<T> {
  // Data
  paginatedData: T[];
  sortedData: T[];
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;

  // Sorting State & Handlers
  sortField: string | null;
  sortOrder: SortOrder;
  handleSort: (field: string) => void;

  // Pagination State & Handlers
  currentPage: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  resetPagination: () => void;
}

/**
 * Helper to safely extract nested property values using dot notation (e.g. "category.name")
 */
function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

export function useDataTable<T>({
  data = [],
  initialSortField = "",
  initialSortOrder = null,
  initialPageSize = 10,
  customValueGetters,
}: UseDataTableOptions<T>): UseDataTableReturn<T> {
  const [sortField, setSortField] = useState<string | null>(initialSortField ? String(initialSortField) : null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder || null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSizeState] = useState<number>(initialPageSize);

  // Reset page when data length shrinks below current page range
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(data.length / pageSize));
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [data.length, pageSize, currentPage]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else if (sortOrder === "desc") {
        setSortField(null);
        setSortOrder(null);
      } else {
        setSortOrder("asc");
      }
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  // Helper to extract value considering custom getters and fallbacks
  const getItemValue = (item: T, field: string) => {
    if (customValueGetters && customValueGetters[field]) {
      return customValueGetters[field](item);
    }
    if (field.includes("||")) {
      const parts = field.split("||");
      for (const part of parts) {
        const val = getNestedValue(item, part.trim());
        if (val !== undefined && val !== null && val !== "") return val;
      }
      return undefined;
    }
    return getNestedValue(item, field);
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (!sortField || !sortOrder) return data;

    return [...data].sort((a, b) => {
      const valA = getItemValue(a, sortField);
      const valB = getItemValue(b, sortField);

      if (valA === valB) return 0;

      const isAEmpty = valA === null || valA === undefined || valA === "";
      const isBEmpty = valB === null || valB === undefined || valB === "";

      if (isAEmpty && isBEmpty) return 0;
      if (isAEmpty) return 1;
      if (isBEmpty) return -1;

      let comparison = 0;

      if (typeof valA === "number" && typeof valB === "number") {
        comparison = valA - valB;
      } else if (typeof valA === "boolean" && typeof valB === "boolean") {
        comparison = valA === valB ? 0 : valA ? -1 : 1;
      } else if (valA instanceof Date && valB instanceof Date) {
        comparison = valA.getTime() - valB.getTime();
      } else {
        // String or fallback
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        comparison = strA.localeCompare(strB, undefined, { numeric: true, sensitivity: "base" });
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [data, sortField, sortOrder, customValueGetters]);

  // Pagination calculation
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const paginatedData = useMemo(() => {
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, startIndex, endIndex]);

  const setPage = (page: number) => {
    const validPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(validPage);
  };

  const setPageSize = (size: number) => {
    setPageSizeState(size);
    setCurrentPage(1);
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    paginatedData,
    sortedData,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    sortField,
    sortOrder,
    handleSort,
    currentPage: safeCurrentPage,
    pageSize,
    setPage,
    setPageSize,
    resetPagination,
  };
}
