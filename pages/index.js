import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchNotices() {
    setLoading(true);
    try {
      const res = await fetch('/api/notices');
      const data = await res.json();
      setNotices(data);
    } catch (err) {
      setError('Failed to load notices.');
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Notice Board</h1>
      <Link href="/notices/new">Add New Notice</Link>

      {notices.length === 0 && <p>No notices yet.</p>}

      {notices.map((notice) => (
        <div
          key={notice.id}
          style={{
            border: "1px solid black",
            margin: "10px 0",
            padding: "10px",
          }}
        >
          {notice.priority === "Urgent" && (
            <span style={{ color: "red", fontWeight: "bold" }}>URGENT</span>
          )}
          <h2>{notice.title}</h2>
          <p>{notice.body}</p>
          <p>Category: {notice.category}</p>
          <p>
            Publish Date: {new Date(notice.publishDate).toLocaleDateString()}
          </p>
          <div>
            <Link href={`/notices/${notice.id}/edit`}>Edit</Link>
            {" | "}
            <button onClick={() => handleDelete(notice.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
