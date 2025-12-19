export const Pagination = ({ page, totalPages, onPageChange }) => {
  const pages = [];

  if (totalPages <= 4) {
    // Show all pages if total is 7 or less
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (page <= 3) {
      // Near the start: show 1, 2, 3, 4, ..., last
      pages.push(2, 3, 4);
      pages.push("ellipsis-right");
      pages.push(totalPages);
    } else if (page >= totalPages - 2) {
      // Near the end: show 1, ..., last-3, last-2, last-1, last
      pages.push("ellipsis-left");
      pages.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      // In the middle: show 1, ..., page-1, page, page+1, ..., last
      pages.push("ellipsis-left");
      pages.push(page - 1, page, page + 1);
      pages.push("ellipsis-right");
      pages.push(totalPages);
    }
  }

  return (
    <nav>
      <ul className="pagination justify-content-end">
        {/* Previous */}
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(page - 1)}>
            Previous
          </button>
        </li>

        {pages.map((p, i) =>
          typeof p === "string" ? (
            <li key={`ellipsis-${i}`} className="page-item disabled">
              <span className="page-link">…</span>
            </li>
          ) : (
            <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
              <button className="page-link" onClick={() => onPageChange(p)}>
                {p}
              </button>
            </li>
          )
        )}

        {/* Next */}
        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(page + 1)}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};
