import { useState } from 'react';

export default function Pagination({ totalPages , currentPage, handleSetPage}) {

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      handleSetPage(page)
    }
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg shadow-sm">
      {/* Mobile View: Simple Prev/Next buttons */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:flex sm:flex-col sm:gap-3 sm:flex-1 sm:items-center sm:justify-between">
        
        {/* page buttons  */}
        <div>
          <nav className="isolate inline-flex gap-2 rounded-md shadow-xs bg-white" aria-label="Pagination">
            {/* Previous Button */}
            <button
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="sr-only">Previous</span>
              <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Page Numbers */}
            {pageNumbers.map((page) => {
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-all duration-150 focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer ${
                    isActive
                      ? 'z-10 bg-blue-600 text-white focus-visible:outline-blue-600'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="sr-only">Next</span>
              <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>

        {/* page details */}
        <div>
          <p className="text-sm text-gray-700">
            Showing Page <span className="font-semibold text-blue-600">{currentPage}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalPages}</span> pages
          </p>
        </div>
      </div>
    </div>
  );
}

