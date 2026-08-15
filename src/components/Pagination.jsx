import React from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isLoadMoreMode = false,
  onToggleLoadMore,
  hasMore = false,
  onLoadMore,
  loading = false,
  label = "Items"
}) => {
  if (totalPages <= 1 && !isLoadMoreMode) return null;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers array (e.g. 1, 2, 3, ...)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-12 pt-8 border-t border-[#E3DDCE] relative z-10 space-y-6">

      {/* Mode Switcher + Count Summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
        <div className="flex items-center gap-2 text-[#4A5A78]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#B4863A]" />
          <span>
            Showing <strong className="text-[#3A2A1C] font-semibold">{startItem} - {endItem}</strong> of{' '}
            <strong className="text-[#3A2A1C] font-semibold">{totalItems}</strong> {label}
          </span>
        </div>

        {onToggleLoadMore && (
          <div className="flex items-center gap-1.5 bg-[#F7F3E9] p-1 rounded-lg border border-[#E3DDCE]">
            <button
              type="button"
              onClick={() => onToggleLoadMore(false)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                !isLoadMoreMode
                  ? 'bg-[#3A2A1C] text-[#C9A45C] shadow-sm font-semibold'
                  : 'text-[#4A5A78] hover:text-[#3A2A1C]'
              }`}
            >
              Page Numbers
            </button>
            <button
              type="button"
              onClick={() => onToggleLoadMore(true)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                isLoadMoreMode
                  ? 'bg-[#3A2A1C] text-[#C9A45C] shadow-sm font-semibold'
                  : 'text-[#4A5A78] hover:text-[#3A2A1C]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#B4863A]" />
              <span>Load More Mode</span>
            </button>
          </div>
        )}
      </div>

      {/* Paged Controls OR Load More Button */}
      {isLoadMoreMode ? (
        <div className="flex flex-col items-center justify-center pt-2">
          {hasMore ? (
            <button
              type="button"
              onClick={onLoadMore}
              disabled={loading}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#3A2A1C] hover:bg-[#2C2015] text-[#C9A45C] font-sans text-xs font-bold tracking-widest uppercase rounded-lg shadow-luxury transition-all border border-[#B4863A]/40 hover:border-[#B4863A] disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#C9A45C] group-hover:rotate-12 transition-transform" />
              <span>{loading ? 'Loading More...' : `Load More ${label} (Page ${currentPage + 1} of ${totalPages})`}</span>
            </button>
          ) : (
            <div className="text-center font-sans text-xs text-[#8A8478] bg-[#F7F3E9] px-4 py-2 rounded border border-[#E3DDCE]">
              ✨ You have reached the end of all {totalItems} {label.toLowerCase()}.
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Previous Page Button */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            aria-label="Previous Page"
            className="flex items-center justify-center px-3 py-2 rounded-md border border-[#E3DDCE] bg-white text-[#3A2A1C] hover:border-[#B4863A] hover:bg-[#F7F3E9] disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-[#E3DDCE] transition-all text-xs font-medium cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 mr-1 text-[#B4863A]" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* First page jump if far */}
          {pageNumbers[0] > 1 && (
            <>
              <button
                type="button"
                onClick={() => onPageChange(1)}
                className="w-9 h-9 flex items-center justify-center rounded-md border border-[#E3DDCE] bg-white text-[#3A2A1C] hover:border-[#B4863A] hover:bg-[#F7F3E9] text-xs font-semibold cursor-pointer"
              >
                1
              </button>
              {pageNumbers[0] > 2 && (
                <span className="px-1 text-[#8A8478] text-xs font-semibold">…</span>
              )}
            </>
          )}

          {/* Page Numbers */}
          {pageNumbers.map((num) => {
            const isActive = num === currentPage;
            return (
              <button
                key={num}
                type="button"
                onClick={() => onPageChange(num)}
                className={`w-9 h-9 flex items-center justify-center rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#3A2A1C] text-[#C9A45C] border border-[#B4863A] shadow-md scale-105'
                    : 'bg-white text-[#3A2A1C] border border-[#E3DDCE] hover:border-[#B4863A] hover:bg-[#F7F3E9]'
                }`}
              >
                {num}
              </button>
            );
          })}

          {/* Last page jump if far */}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="px-1 text-[#8A8478] text-xs font-semibold">…</span>
              )}
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                className="w-9 h-9 flex items-center justify-center rounded-md border border-[#E3DDCE] bg-white text-[#3A2A1C] hover:border-[#B4863A] hover:bg-[#F7F3E9] text-xs font-semibold cursor-pointer"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next Page Button */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            aria-label="Next Page"
            className="flex items-center justify-center px-3 py-2 rounded-md border border-[#E3DDCE] bg-white text-[#3A2A1C] hover:border-[#B4863A] hover:bg-[#F7F3E9] disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-[#E3DDCE] transition-all text-xs font-medium cursor-pointer"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4 ml-1 text-[#B4863A]" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
