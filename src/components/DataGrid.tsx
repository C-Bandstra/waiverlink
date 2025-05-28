import React, { useState } from "react";
import { parseFieldId } from "../utils/parsers";
import type { Column, DataGridProps } from "../types/admin";

export function DataGrid({ data }: DataGridProps) {
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Get column definitions from the first data row
 const deriveColumns = (row: Record<string, any>): Column[] => {
    return Object.keys(row).map((fieldId) => {
      const { type, id, subtype } = parseFieldId(fieldId);
      const baseLabel = subtype ?? `${type}-${id}`;
      const readableLabel = baseLabel.replace(/([A-Z])/g, " $1").toLowerCase();
      return {
        key: fieldId,
        label: readableLabel,
        filterable: true,
      };
    });
  };

  const columns = deriveColumns(data[0] || {});

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = (row: Record<string, any>): boolean => {
    return columns.every(({ key }) => {
      const filterVal = filters[key];
      if (!filterVal) return true;
      return String(row[key]).toLowerCase().includes(filterVal.toLowerCase());
    });
  };

  const filteredData = data.filter(applyFilters);

  const renderCell = (value: any): React.ReactNode => {
    if (typeof value === "object" && value?.props?.children) {
      return value.props.children; // signature span
    }
    return String(value);
  };

  return (
    <div className="p-2">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            {columns.map(({ key, label, filterable }) => (
              <th key={key} className="p-2 border">
                <div className="flex flex-col">
                  <span>{label}</span>
                  {filterable && (
                    <input
                      type="text"
                      value={filters[key] || ""}
                      onChange={(e) => handleFilterChange(key, e.target.value)}
                      className="mt-1 p-1 border rounded text-xs"
                      placeholder="Filter..."
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center p-4">
                No results found.
              </td>
            </tr>
          ) : (
            filteredData.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map(({ key }) => (
                  <td key={key} className="p-2 border">
                    {renderCell(row[key])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
