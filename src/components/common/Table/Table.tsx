import React, { ReactNode } from 'react';
import './Table.css';

export interface Column<T> {
  header: string;
  key?: keyof T;
  render?: (item: T, index: number) => ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  error?: string | null;
  loadingText?: string;
  className?: string;
  onRowClick?: (item: T) => void;
  onRowHover?: (item: T | null) => void;
  emptyMessage?: string;
}

const Table = <T extends object>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  error = null,
  loadingText = "Cargando datos...",
  className = "",
  onRowClick,
  onRowHover,
  emptyMessage = "No hay datos disponibles"
}: TableProps<T>) => {
  if (isLoading) {
    return <div className="table-loading">{loadingText}</div>;
  }

  if (error) {
    return <div className="table-error">{error}</div>;
  }

  if (data.length === 0) {
    return <div className="table-empty">{emptyMessage}</div>;
  }

  return (
    <div className="table-container">
      <table className={`data-table ${className}`}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr 
              key={keyExtractor(item)}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              onMouseEnter={onRowHover ? () => onRowHover(item) : undefined}
              onMouseLeave={onRowHover ? () => onRowHover(null) : undefined}
              className={onRowClick ? 'clickable-row' : ''}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column.render
                    ? column.render(item, rowIndex)
                    : column.key
                    ? String(item[column.key] || '')
                    : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;