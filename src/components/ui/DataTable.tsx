import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search, Download } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { DataTableColumn, PaginationProps, SortDirection } from '../../types';

interface DataTableProps<T = any> {
  data: T[];
  columns: DataTableColumn<T>[];
  onSort?: (key: string, direction: SortDirection) => void;
  pagination?: PaginationProps;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  searchable?: boolean;
  exportable?: boolean;
}

interface TableSkeletonProps {
  rows: number;
  columns: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows, columns }) => (
  <div className="animate-pulse">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            {Array(columns).fill(0).map((_, i) => (
              <th key={i} className="p-4 text-left">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array(rows).fill(0).map((_, i) => (
            <tr key={i} className="border-b">
              {Array(columns).fill(0).map((_, j) => (
                <td key={j} className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  onSort,
  pagination,
  onPageChange,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  searchable = false,
  exportable = false,
}: DataTableProps<T>) => {
  const { features } = useTheme();
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key: string) => {
    if (!features.allowSorting) return;

    let newDirection: SortDirection = 'asc';
    
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        newDirection = 'desc';
      } else if (sortDirection === 'desc') {
        newDirection = null;
      }
    }

    setSortKey(newDirection ? key : '');
    setSortDirection(newDirection);
    onSort?.(key, newDirection);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const handleExport = () => {
    if (!features.exportData) return;
    
    const csv = [
      columns.map(col => col.label).join(','),
      ...filteredData.map(row =>
        columns.map(col => {
          const value = row[col.key];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <TableSkeleton rows={5} columns={columns.length} />;
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {(features.showSearch && searchable) || (features.exportData && exportable) ? (
        <div className="p-4 border-b flex justify-between items-center">
          {features.showSearch && searchable && (
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
          
          {features.exportData && exportable && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              Export
            </button>
          )}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`p-4 text-left text-sm font-medium text-gray-700 ${
                    column.sortable && features.allowSorting ? 'cursor-pointer hover:bg-gray-100' : ''
                  } ${column.className || ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && features.allowSorting && (
                      <div className="flex flex-col">
                        <ChevronUp
                          size={12}
                          className={
                            sortKey === column.key && sortDirection === 'asc'
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }
                        />
                        <ChevronDown
                          size={12}
                          className={
                            sortKey === column.key && sortDirection === 'desc'
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="p-4 text-sm text-gray-900">
                      {column.render
                        ? column.render(row, row[column.key])
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {features.showPagination && pagination && (
        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {Math.min((pagination.page - 1) * pagination.pageSize + 1, pagination.total)} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} results
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            
            <span className="px-3 py-1 text-sm">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            
            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
              className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};