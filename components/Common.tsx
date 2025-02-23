"use client";

import React from "react";
// import { ArrowLeft, ArrowRight } from "lucide-react";
type InfoCardProps = {
  label: string;
  value: number;
  icon?: string;
  isLoading?: boolean;
};

export const InfoCard = ({
  label,
  value,
  icon,
  isLoading = false,
}: InfoCardProps) => (
  <div className="bg-white/70 rounded-2xl p-6 shadow-md transition-shadow duration-200 hover:shadow-lg flex gap-3 text-wrap space-y-2">
    {isLoading ? (
      <div className="animate-pulse flex gap-3">
        {/* Icon Skeleton */}
        <div className="h-8 w-8 bg-gray-300 rounded-full"></div>

        <div className="flex flex-col space-y-2">
          {/* Label Skeleton */}
          <div className="h-4 w-20 bg-gray-300 rounded-md"></div>
          {/* Value Skeleton */}
          <div className="h-8 w-28 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    ) : (
      <>
        <i className={`fa-duotone text-2xl fa-solid pt-2 ${icon}`}></i>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">{label}</span>
          <span className="text-3xl font-bold text-gray-800">{value}</span>
        </div>
      </>
    )}
  </div>
);
type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export const PageHeader = ({
  title,
  description,
  actions,
}: PageHeaderProps) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
    <div>
      <h1 className="text-2xl font-semibold text-black">{title}</h1>
      {description && <p className="text-sm text-gray_dark">{description}</p>}
    </div>
    {actions && <div className="flex gap-2 mt-4 sm:mt-0">{actions}</div>}
  </div>
);

type TableHeaderProps = {
  title: string;
};

export const TableHeader = ({ title }: TableHeaderProps) => (
  <tr>
    <th
      colSpan={7}
      className="px-6 py-3 text-center text-xs font-medium text-lightwhiteText uppercase tracking-wider bg-mediumDarkGray"
    >
      {title}
    </th>
  </tr>
);

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  return (
    totalPages > 1 && (
      <div className="flex items-center justify-between mt-4">
        <div className="flex space-x-1">
          {[...Array(totalPages)].map((_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`px-3 py-1  border border-[#5D6956] rounded-full ${
                currentPage === i + 1
                  ? "bg-[#5D6956] text-white"
                  : " text-[#5D6956]"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center rounded-3xl px-4 py-2 border border-[#5D6956] text-sm text-[#5D6956]  disabled:opacity-50"
          >
            {/* <ArrowLeft className="w-4 h-4 mr-2" /> */}
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center px-4 py-2 border border-[#5D6956] rounded-3xl text-sm text-white bg-[#5D6956] hover:bg-[#5D6956]/80 disabled:opacity-50"
          >
            Next
            {/* <ArrowRight className="w-4 h-4 ml-2" /> */}
          </button>
        </div>
      </div>
    )
  );
};
