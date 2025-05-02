import React from 'react';
import { IconChevronLeft, IconChevronRight, IconDots } from '@tabler/icons-react';

/**
 * Pagination component for the test library
 */
export default function TestPagination({ 
  hasNextPage, 
  hasPreviousPage, 
  currentPage, 
  onPageChange, 
  totalItems, 
  itemsPerPage 
}) {
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Show at most 5 page numbers
    
    if (totalPages <= maxPagesToShow) {
      // If we have 5 or fewer pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 3) {
        // If near the start, show 2, 3, 4, ..., lastPage
        pages.push(2, 3, 4, 'ellipsis', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // If near the end, show 1, ..., lastPage-3, lastPage-2, lastPage-1, lastPage
        pages.push('ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // If in the middle, show 1, ..., currentPage-1, currentPage, currentPage+1, ..., lastPage
        pages.push('ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
      }
    }
    
    return pages;
  };
  
  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{' '}
            of <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            {/* Previous page button */}
            <button
              onClick={() => hasPreviousPage && onPageChange(currentPage - 1)}
              disabled={!hasPreviousPage}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                hasPreviousPage 
                  ? 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <span className="sr-only">Previous</span>
              <IconChevronLeft size={18} aria-hidden="true" />
            </button>
            
            {/* Page numbers */}
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === 'ellipsis' ? (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                    <IconDots size={18} aria-hidden="true" />
                  </span>
                ) : (
                  <button
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      page === currentPage
                        ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
            
            {/* Next page button */}
            <button
              onClick={() => hasNextPage && onPageChange(currentPage + 1)}
              disabled={!hasNextPage}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                hasNextPage 
                  ? 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <span className="sr-only">Next</span>
              <IconChevronRight size={18} aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
      
      {/* Mobile pagination controls */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => hasPreviousPage && onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          className={`relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ${
            hasPreviousPage
              ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Previous
        </button>
        <p className="self-center text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() => hasNextPage && onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className={`relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ${
            hasNextPage
              ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
