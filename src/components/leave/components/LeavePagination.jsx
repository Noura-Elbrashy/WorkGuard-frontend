import React from 'react';

/**
 * ================================
 * LeavePagination
 * ================================
 * UI-only pagination component
 *
 * @param {number} page   - current page
 * @param {number} pages  - total pages (from backend)
 * @param {function} onChange - setPage function
 */
function LeavePagination({ page, pages, onChange }) {
  // 🔒 No pagination needed
  if (!pages || pages <= 1) return null;

  const goToPage = (p) => {
    if (p < 1 || p > pages || p === page) return;
    onChange(p);
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <nav aria-label="Leave pagination">
        <ul className="pagination pagination-sm mb-0">

          {/* Prev */}
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => goToPage(page - 1)}
              aria-label="Previous"
            >
              ◀  <i className="fa-solid fa-chevron-left" />

            </button>
          </li>

          {/* Page indicator */}
          <li className="page-item disabled">
            <span className="page-link">
              {page} / {pages}
            </span>
          </li>

          {/* Next */}
          <li className={`page-item ${page === pages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => goToPage(page + 1)}
              aria-label="Next"
            >
              ▶
            </button>
          </li>

        </ul>
      </nav>
    </div>
  );
}

export default LeavePagination;
