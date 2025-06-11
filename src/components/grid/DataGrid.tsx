import { parseFieldId } from "../../utils/parsers";
import type { Column, DataGridProps, FirestoreValue } from "../../types/admin";
import DataGridCell from "./DataGridCell";

// Main DataGrid Component
const DataGrid = ({ data }: DataGridProps) => {
  
  // Utility: Convert fieldId to readable column config
  const deriveColumns = (row: Record<string, any>): Column[] => {
    return Object.keys(row).map((fieldId) => {
      const { type, id, subtype } = parseFieldId(fieldId);
      const baseLabel = subtype ?? `${type}-${id}`;
      const readableLabel = baseLabel.replace(/([A-Z])/g, " $1").toLowerCase();
      
      return {
        key: fieldId,
        label: readableLabel,
        filterable: false,
        type,
      };
    });
  }
  
  const columns = deriveColumns(data[0] || {});

    // Cell Renderer
  const renderCell = (value: FirestoreValue, columnType: string) => {
    //can expand into RenderCell component at a later time
    return <DataGridCell value={value} type={columnType} />;
  }


  return (
    <div
      style={{
        overflowX: "auto",
        width: "fit-content",
        maxWidth: "100%",
        border: "1px solid #ccc",
        padding: "4px",
      }}
    >
      <table className="text-sm border-collapse" style={{ minWidth: "600px" }}>
        <thead className="bg-gray-100">
          <tr>
            {columns.map(({ key, label }) => (
              <th key={key} className="p-2 border" style={{ whiteSpace: "nowrap" }}>
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center p-4">
                No results found.
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map(({ key, type }) => (
                  <td
                    key={key}
                    className="p-2 border"
                    style={{ whiteSpace: "nowrap", verticalAlign: "top" }}
                  >
                    {renderCell(row[key], type ?? "")}
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

export default DataGrid;
