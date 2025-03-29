import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { PaginationProps } from "@/types/pagination";

export const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <nav className="flex justify-end py-6 px-4">
      <ul className="flex items-center gap-2">
        <li>
          <button
            className="flex items-center gap-1 px-2 py-2 text-sm text-[#4f4f4f] rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </button>
        </li>

        {Array.from({ length: totalPages }, (_, i) => (
          <li key={i}>
            <button
              className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-colors cursor-pointer ${
                currentPage === i + 1
                  ? "bg-[#fef3e9] text-[#221f20]"
                  : "text-[#4f4f4f]"
              }`}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </button>
          </li>
        ))}

        <li>
          <button
            className="flex items-center gap-1 px-2 py-2 text-sm  text-[#4f4f4f] rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
};
