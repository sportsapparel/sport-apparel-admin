"use client";

// import { Calendar, ChevronDown, Search, X } from "lucide-react";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type FilterOption = {
  label: string;
  value: string;
};

type FilterConfig = {
  key: string;
  options: FilterOption[];
  placeholder: string;
};

type SearchBarProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  onDateFilter?: (dates: { from: Date | null; to: Date | null }) => void;
  onFilterChange?: (key: string, value: string) => void;
  showFilters?: boolean;
  className?: string;
  filters?: FilterConfig[];
  selectedFilters?: Record<string, string>;
  selectedDates?: { from: Date | null; to: Date | null };
};

const SearchBar = ({
  value = "",
  onChange = () => {},
  placeholder = "Search...",
  onDateFilter,
  onFilterChange,
  showFilters = true,
  className = "",
  filters = [],
  selectedFilters = {},
  selectedDates = { from: null, to: null },
}: SearchBarProps) => {
  const [openDropdowns, setOpenDropdowns] = React.useState<
    Record<string, boolean>
  >({});
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const closeDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: false,
    }));
  };

  // Handle clicking outside of dropdowns
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".filter-dropdown")) {
        setOpenDropdowns({});
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDateRange = () => {
    if (!selectedDates.from) return "Set Date";
    const fromDate = selectedDates.from.toLocaleDateString();
    const toDate = selectedDates.to
      ? selectedDates.to.toLocaleDateString()
      : "Present";
    return `${fromDate} - ${toDate}`;
  };

  return (
    <div
      className={`flex flex-wrap gap-2 md:gap-0 md:flex-nowrap items-center space-x-2 w-full  ${className}`}
    >
      <div className="flex relative flex-1 gap-2">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <i className="fa fa-search text-gray-400" aria-hidden="true"></i>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-3 py-2 border border-gray-400 rounded-3xl text-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#AD6343]"
        />

        {/* <button
          title="Search"
          className="px-3 py-3  rounded-full bg-[#3467B8] text-sm text-white hover:bg-[#3467B8]/90"
        >
          <i className="fa fa-search" aria-hidden="true"></i>
        </button> */}

        {value && (
          <button
            className="absolute inset-y-0 right-0 flex items-center px-3"
            title="Clear search"
            onClick={() => onChange("")}
          >
            <span className="text-gray-400 hover:text-gray-400">
              <i className="fa-solid fa-xmark"></i>{" "}
            </span>
          </button>
        )}
      </div>

      {showFilters && (
        <div className="flex space-x-2">
          {onDateFilter && (
            <div className="relative filter-dropdown">
              <button
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className={`px-3 py-2 border border-[#3467B8] rounded-lg bg-white text-sm text-[#4B5563] hover:bg-[#F9FAFB] flex items-center justify-between gap-2 min-w-[200px]`}
              >
                <div className="flex items-center gap-2">
                  <i className="fa fa-calendar h-4 w-4 text-[#6B7280]" />
                  <span className="truncate">{formatDateRange()}</span>
                </div>
                <i className="fa fa-angle-down h-4 w-4 text-[#6B7280]" />
              </button>

              {isDatePickerOpen && (
                <div className="absolute mt-2 bg-white border border-[#3467B8] rounded-lg shadow-lg z-10 p-4 right-0">
                  <div className="flex gap-4">
                    <div>
                      <label className="block text-sm text-grayText mb-1">
                        From
                      </label>
                      <DatePicker
                        selected={selectedDates.from}
                        onChange={(date: Date | null) =>
                          onDateFilter?.({ ...selectedDates, from: date })
                        }
                        selectsStart
                        startDate={selectedDates.from || undefined}
                        endDate={selectedDates.to || undefined}
                        className="w-full px-3 py-2 border border-[#3467B8] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-darkblue  text-text"
                        dateFormat="yyyy-MM-dd"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-grayText mb-1">
                        To
                      </label>
                      <DatePicker
                        selected={selectedDates.to}
                        onChange={(date: Date | null) =>
                          onDateFilter?.({ ...selectedDates, to: date })
                        }
                        selectsEnd
                        startDate={selectedDates.from || undefined}
                        endDate={selectedDates.to || undefined}
                        minDate={selectedDates.from || undefined}
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-darkblue text-text"
                        dateFormat="yyyy-MM-dd"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 gap-2">
                    <button
                      onClick={() => {
                        onDateFilter?.({ from: null, to: null });
                        setIsDatePickerOpen(false);
                      }}
                      className="px-3 py-1 text-sm text-red-500 hover:text-red-600"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => {
                        onDateFilter?.(selectedDates);
                        setIsDatePickerOpen(false);
                      }}
                      className="px-3 py-1 text-sm text-text hover:text-text/80"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {filters.map((filter) => (
            <div key={filter.key} className="relative filter-dropdown">
              <button
                onClick={() => toggleDropdown(filter.key)}
                className="px-3 py-2 border border-[#3467B8] rounded-3xl bg-white text-sm  hover:bg-[#F9FAFB] flex items-center justify-between min-w-20 text-[#3467B8] gap-2"
              >
                <span className="truncate">
                  {selectedFilters[filter.key] === "all"
                    ? filter.placeholder
                    : filter.options.find(
                        (o) => o.value === selectedFilters[filter.key]
                      )?.label || filter.placeholder}
                </span>
                <i className="fa fa-angle-down h-4 w-4 text-[#3467B8]" />
              </button>

              {openDropdowns[filter.key] && (
                <div className="absolute mt-2 bg-white border border-[#3467B8] rounded-lg shadow-lg w-full z-10 text-[#3467B8]">
                  <ul className="py-1">
                    <li
                      onClick={() => {
                        // console.log(`Resetting filter for key: ${filter.key}`);
                        onFilterChange?.(filter.key, "all");
                        closeDropdown(filter.key);
                      }}
                      className="px-3 py-2 text-sm text-[#3467B8] hover:bg-[#F9FAFB] cursor-pointer"
                    >
                      {filter.placeholder}
                    </li>
                    {filter.options.map((option) => (
                      <li
                        key={option.value}
                        onClick={() => {
                          // console.log(
                          //   `Setting filter for key: ${filter.key}, value: ${option.value}`
                          // );
                          onFilterChange?.(filter.key, option.value);
                          closeDropdown(filter.key);
                        }}
                        className={`px-3 py-2 text-sm  hover:bg-[#F9FAFB] cursor-pointer ${
                          selectedFilters[filter.key] === option.value
                            ? "font-semibold bg-[#3467B8]/80 text-white hover:bg-[#3467B8]/80"
                            : ""
                        }`}
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
// usage
// const {
//     filteredData: filteredPlansList,
//     currentPage,
//     setCurrentPage,
//     searchTerm,
//     setSearchTerm,
//     totalPages,
//     // selectedFilters,
//     // setFilter,
//     // filterOptions,
//   } = useFilteredData(plansList || [], {
//     searchKeys: ["name", "description"],
//   });
