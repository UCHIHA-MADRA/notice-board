import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchNotices() {
    setLoading(true);
    try {
      const res = await fetch("/api/notices");
      const data = await res.json();
      setNotices(data);
    } catch (err) {
      setError("Failed to load notices.");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchNotices();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notice?",
    );
    if (!confirmed) return;

    const res = await fetch(`/api/notices/${id}`, { method: "DELETE" });
    if (res.ok) {
      setNotices(notices.filter((n) => n.id !== id));
    } else {
      alert("Failed to delete notice.");
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Notice Board</h1>
        <Link href="/notices/new" className="btn btn-primary">
          + Add New Notice
        </Link>
      </div>

      {loading && <p className="state-message">Loading notices…</p>}
      {!loading && error && <p className="state-message">{error}</p>}
      {!loading && !error && notices.length === 0 && (
        <p className="state-message">No notices yet. Add the first one.</p>
      )}

      {!loading && !error && notices.length > 0 && (
        <div className="notice-grid">
          {notices.map((notice) => (
            <article key={notice.id} className="notice-card">
              <div className="notice-card__header">
                <h2 className="notice-card__title">{notice.title}</h2>
                {notice.priority === "Urgent" && (
                  <span className="badge badge--urgent">Urgent</span>
                )}
              </div>

              <p className="notice-card__body">{notice.body}</p>

              <div className="notice-card__meta">
                <span className="badge badge--category">{notice.category}</span>
                <span>{new Date(notice.publishDate).toLocaleDateString()}</span>
              </div>

              <div className="notice-card__actions">
                <Link
                  href={`/notices/${notice.id}/edit`}
                  className="btn btn-secondary"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(notice.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
