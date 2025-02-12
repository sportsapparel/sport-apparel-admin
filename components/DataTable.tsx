"use client";

import { ReactNode } from "react";
function SkeletonLoader({
  columns,
  actions,
}: {
  columns: number;
  actions?: boolean;
}) {
  return (
    <tr>
      {Array.from({ length: columns + (actions ? 1 : 0) }).map((_, index) => (
        <td key={index} className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
        </td>
      ))}
    </tr>
  );
}
type Column<T> = {
  header: string | ReactNode;
  accessor: keyof T | ((item: T) => ReactNode);
  align?: "left" | "right" | "center";
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  actions?: (item: T) => ReactNode;
  title?: string;
  headerContent?: ReactNode;
};

export default function DataTable<T>({
  columns,
  data,
  loading,
  actions,
  title,
  headerContent,
}: TableProps<T>) {
  return (
    <div>
      {(title || headerContent) && (
        <div className="flex justify-between items-center py-3">
          {title && <h2 className="text-black font-[500]  text-xl">{title}</h2>}
          {headerContent && <div className="flex gap-2">{headerContent}</div>}
        </div>
      )}

      <div className="w-full overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-[#AD6343] ">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-3 text-${
                    column.align || "left"
                  } text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap`}
                >
                  {column.header}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">
                  ACTIONS
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <>
                {Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonLoader
                    key={index}
                    columns={columns.length}
                    actions={!!actions}
                  />
                ))}
              </>
            ) : data === undefined || data?.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-4 text-center text-sm text-gray-900"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data?.map((item, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-${
                        column.align || "left"
                      }`}
                    >
                      {typeof column.accessor === "function"
                        ? column.accessor(item)
                        : String(item[column.accessor])}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
