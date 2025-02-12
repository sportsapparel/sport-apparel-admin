"use client";

import { useState, useEffect, useMemo } from "react";

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}` | K
          : K
        : never;
    }[keyof T]
  : never;

// type FilterOption = {
//   key: string;
//   value: string;
// };

type FilterConfig<T> = {
  searchKeys: NestedKeyOf<T>[];
  filterKeys?: {
    key: NestedKeyOf<T>;
    transformValue?: (value: unknown) => string;
  }[];
  itemsPerPage?: number;
};

const getNestedValue = (obj: Record<string, unknown>, path: string) => {
  return path.split(".").reduce((acc: unknown, part) => {
    return acc && typeof acc === "object" && acc !== null
      ? (acc as Record<string, unknown>)[part]
      : undefined;
  }, obj);
};
export function useFilteredData<T extends Record<string, unknown>>(
  data: T[],
  config: FilterConfig<T>
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string>
  >({});

  const { searchKeys, filterKeys = [], itemsPerPage = 10 } = config;

  // Get unique filter options for each filter key
  const filterOptions = useMemo(() => {
    return filterKeys.reduce((acc, { key, transformValue }) => {
      const uniqueValues = new Set(
        data.map((item) => {
          const value = getNestedValue(item, key as string);
          return transformValue ? transformValue(value) : String(value);
        })
      );

      acc[key as string] = Array.from(uniqueValues)
        .filter(Boolean)
        .map((value) => ({
          label: value.charAt(0).toUpperCase() + value.slice(1),
          value: value,
        }));

      return acc;
    }, {} as Record<string, { label: string; value: string }[]>);
  }, [data, filterKeys]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilters]);

  // Filter data based on search term and selected filters
  const filteredData = useMemo(() => {
    // console.log("Filtering data with search term:", searchTerm);
    // console.log("Selected filters:", selectedFilters);
    return data?.filter((item) => {
      // Search term filter
      const matchesSearch = searchKeys.some((key) => {
        const value = getNestedValue(item, key as string);
        return String(value)?.toLowerCase()?.includes(searchTerm.toLowerCase());
      });

      // Multiple filters
      const matchesAllFilters = Object.entries(selectedFilters).every(
        ([key, selectedValue]) => {
          if (!selectedValue || selectedValue === "all") return true;

          const filterConfig = filterKeys.find((config) => config.key === key);
          if (!filterConfig) return true;

          const itemValue = getNestedValue(item, key);
          const transformedValue = filterConfig.transformValue
            ? filterConfig.transformValue(itemValue)
            : String(itemValue);

          return transformedValue === selectedValue;
        }
      );
      // console.log(
      //   `Item: ${JSON.stringify(
      //     item
      //   )}, matchesSearch: ${matchesSearch}, matchesAllFilters: ${matchesAllFilters}`
      // );
      return matchesSearch && matchesAllFilters;
    });
  }, [data, searchTerm, selectedFilters, searchKeys, filterKeys]);

  // Paginate the filtered data
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredData, currentPage, itemsPerPage]);

  // Update a single filter
  const setFilter = (key: string, value: string) => {
    // console.log(`Setting filter - Key: ${key}, Value: ${value}`);
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedFilters({});
  };

  return {
    filteredData: paginatedData,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    selectedFilters,
    setFilter,
    resetFilters,
    filterOptions,
    totalPages: Math.ceil(filteredData.length / itemsPerPage),
  };
}
