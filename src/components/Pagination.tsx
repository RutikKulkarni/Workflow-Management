import { PaginationProps } from "@/types/pagination";

export const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex justify-end mt-12 space-x-2 pr-8">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ease-in-out ${currentPage === i + 1
              ? "bg-black text-white shadow-md"
              : "bg-gray-100 text-gray-700"
            }`}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};
