import React, { useState } from 'react';

const PaginationTable = ({ data, headers, rowsPerPage = 100 }) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const currentData = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-2 py-2 text-xs font-medium uppercase text-gray-500">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentData.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {headers.map((header, colIndex) => (
                <td key={colIndex} className="whitespace-nowrap px-2 py-2 text-sm text-gray-700">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded"
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>
        <span>
          Page {page + 1} / {totalPages}
        </span>
        <button
          className="px-3 py-1 bg-gray-200 rounded"
          disabled={page === totalPages - 1}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationTable;
