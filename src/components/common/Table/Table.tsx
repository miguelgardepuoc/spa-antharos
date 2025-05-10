import React, { ReactNode } from 'react';
import './Table.css';

interface TableProps {
  headers: string[];
  data: any[];
  renderRow: (item: any, index: number) => React.ReactElement;
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: ReactNode;
  loadingMessage?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

const Table: React.FC<TableProps> = ({
  headers,
  data,
  renderRow,
  isLoading = false,
  error = null,
  emptyMessage = 'No hay datos disponibles',
  loadingMessage = 'Cargando datos...',
  className = '',
  headerClassName = '',
  bodyClassName = '',
}) => {
  if (isLoading) {
    return <div className="table-loading">{loadingMessage}</div>;
  }

  if (error) {
    return <div className="table-error">{error}</div>;
  }

  if (data.length === 0) {
    return <div className="table-empty">{emptyMessage}</div>;
  }

  return (
    <div className={`table-container ${className}`}>
      <table className="data-table">
        <thead className={headerClassName}>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className={bodyClassName}>
          {data.map((item, index) => renderRow(item, index))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;