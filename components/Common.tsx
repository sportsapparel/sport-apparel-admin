"use client";

import React from "react";
// import { ArrowLeft, ArrowRight } from "lucide-react";

type InfoCardProps = {
  icon: React.ReactNode; // Allows any JSX element, component, or icon
  label: string;
  value: string | number;
  percentage?: number; // Optional percentage text
};

export const InfoCard = ({
  icon: Icon,
  label,
  value,
  percentage,
}: InfoCardProps) => (
  <div className="bg-white rounded-lg p-6 flex items-center space-x-4 shadow-[1px_1px_6px_0px_rgba(0,_0,_0,_0.1)] transition-shadow duration-200 ">
    {/* Icon or Component */}
    <div className="rounded-full p-1 ">{Icon}</div>
    {/* Content */}
    <div className="flex flex-col flex-grow">
      <span className="text-sm text-gray-800">{label}</span>
      <span className="text-2xl font-semibold text-gray-800">{value}</span>
      {percentage && (
        <div className="flex items-center ">
          <span
            className={`text-sm pr-1 py-1 rounded-full ${
              percentage >= 0 ? "text-green-500 " : "text-red-500 "
            }`}
          >
            {percentage}%
          </span>
          <span className="text-sm text-gray-800">from last month</span>
        </div>
      )}
    </div>
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
