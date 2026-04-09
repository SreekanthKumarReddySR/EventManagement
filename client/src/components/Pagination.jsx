export default function Pagination({ page, totalPages, onPageChange, isLoading }) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <section className="panel pagination-bar">
      <div>
        <p className="eyebrow">Pagination</p>
        <h2>Page {page} of {totalPages}</h2>
      </div>

      <div className="pagination-actions">
        <button
          className="ghost-button compact-button"
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={isLoading || page <= 1}
        >
          Previous
        </button>

        <button
          className="ghost-button compact-button"
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={isLoading || page >= totalPages}
        >
          Next
        </button>
      </div>
    </section>
  );
}
