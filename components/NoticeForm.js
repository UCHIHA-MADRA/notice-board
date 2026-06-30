import { useState } from "react";
import { useRouter } from "next/router";

export default function NoticeForm({ initialData, noticeId }) {
  const router = useRouter();
  const isEdit = Boolean(noticeId);

  const [title, setTitle] = useState(initialData?.title || "");
  const [body, setBody] = useState(initialData?.body || "");
  const [category, setCategory] = useState(initialData?.category || "General");
  const [priority, setPriority] = useState(initialData?.priority || "Normal");
  const [publishDate, setPublishDate] = useState(
    initialData?.publishDate ? initialData.publishDate.slice(0, 10) : "",
  );
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrors([]);

    const payload = { title, body, category, priority, publishDate };

    const res = await fetch(
      isEdit ? `/api/notices/${noticeId}` : "/api/notices",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      setErrors(data.errors || [data.error || "Something went wrong."]);
      setSubmitting(false);
      return;
    }

    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <ul style={{ color: "red" }}>
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      <div>
        <label>Title</label>
        <br />
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <label>Body</label>
        <br />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} />
      </div>

      <div>
        <label>Category</label>
        <br />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Exam">Exam</option>
          <option value="Event">Event</option>
          <option value="General">General</option>
        </select>
      </div>

      <div>
        <label>Priority</label>
        <br />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Normal">Normal</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>

      <div>
        <label>Publish Date</label>
        <br />
        <input
          type="date"
          value={publishDate}
          onChange={(e) => setPublishDate(e.target.value)}
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : isEdit ? "Update Notice" : "Create Notice"}
      </button>
    </form>
  );
}
