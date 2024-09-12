import React from "react";

interface PaginationProps {
  total: number;
  limit: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  total,
  limit,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(total / limit);

  const handleClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 mx-1 text-white ${currentPage === 1 ? 'bg-gray-400' : 'bg-green-500'} rounded hover:bg-green-600`}
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => handleClick(index + 1)}
          className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600'} hover:bg-green-200`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 mx-1 text-white ${currentPage === totalPages ? 'bg-gray-400' : 'bg-green-500'} rounded hover:bg-green-600`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
