import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteEvent, getEvents } from "../services/eventService";
import { Pagination } from "../Components/Pagination";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
};

export function Events() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("DESC");

  const loadEvents = async () => {
    try {
      const data = await getEvents({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      });

      setEvents(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [page, limit, search, sortBy, sortOrder]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(column);
      setSortOrder("ASC");
    }
    setPage(1); // reset to first page
  };

  const handleDelete = async () => {
    try {
      await deleteEvent(selectedId);

      setShowModal(false);
      setSelectedId(null);
      loadEvents(page, limit);
    } catch (err) {
      console.error(err.message);
      alert("Delete failed");
    }
  };

  return (
    <div className="container mt-4">
      <h6>Search Events</h6>
      <div className="mb-3" style={{ maxWidth: 400 }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search event by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Events</h2>
        <button
          className="btn btn-success"
          onClick={() => navigate("/events/new")}
        >
          + Add Event
        </button>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <label className="me-2">Show</label>
          <select
            className="form-select d-inline-block w-auto"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={1}>1</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span className="ms-2">entries</span>
        </div>
      </div>
      <table className="table table-bordered mt-3 shadow ">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th style={{ width: 120 }}>Image</th>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("name")}
            >
              Name {sortBy === "name" && (sortOrder === "ASC" ? "▲" : "▼")}
            </th>

            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("description")}
            >
              Description{" "}
              {sortBy === "description" && (sortOrder === "ASC" ? "▲" : "▼")}
            </th>

            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("startDate")}
            >
              Start{" "}
              {sortBy === "startDate" && (sortOrder === "ASC" ? "▲" : "▼")}
            </th>

            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("endDate")}
            >
              End {sortBy === "endDate" && (sortOrder === "ASC" ? "▲" : "▼")}
            </th>

            <th style={{ width: 180 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length ? (
            events.map((e, index) => (
              <tr key={e.id}>
                <td>{(page - 1) * limit + index + 1}</td>
                <td
                  className="text-wrap"
                  style={{ maxWidth: "300px", wordBreak: "break-all" }}
                >
                  {e.imageUrl ? (
                    <img
                      src={`http://localhost:5000${e.imageUrl}`}
                      alt={e.name}
                      style={{ width: 100, height: 60, objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 100,
                        height: 60,
                        background: "#eee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      No Image
                    </div>
                  )}
                </td>
                <td
                  className="text-wrap"
                  style={{ maxWidth: "300px", wordBreak: "break-all" }}
                >
                  {e.name}
                </td>
                <td
                  className="text-wrap"
                  style={{ maxWidth: "300px", wordBreak: "break-all" }}
                >
                  {e.description}
                </td>
                <td>{formatDate(e.startDate)}</td>
                <td>{formatDate(e.endDate)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => navigate(`/events/${e.id}/edit`)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      setSelectedId(e.id);
                      setShowModal(true);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No events found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div
        className="d-flex align-items-center"
        style={{
          position: "sticky",
          bottom: 0,
          background: "#fff",
          padding: "10px",
          borderTop: "1px solid #ddd",
          zIndex: 100,
        }}
      >
        <div className="d-flex justify-content-start mt-3">
          Showing {page} of {totalPages} pages
        </div>
        <div className="ms-auto">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <p>Are you sure you want to delete this event?</p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}
