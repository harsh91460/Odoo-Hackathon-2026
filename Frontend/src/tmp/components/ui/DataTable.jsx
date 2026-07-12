import StatusBadge from './StatusBadge';

export default function DataTable({ columns, data }) {
  return (
    <div className="bg-panel rounded-md border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-black/20 text-gray-400 uppercase text-[10px] tracking-wider font-semibold border-b border-border">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-4 whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-white/5 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {/* Automatically render a badge if the column is a status */}
                      {col.accessor === 'status' ? (
                        <StatusBadge status={row[col.accessor]} />
                      ) : (
                        row[col.accessor]
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}