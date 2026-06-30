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
    <form onSubmit={handleSubmit} className="form">
      {errors.length > 0 && (
        <div className="form-errors">
          <ul>
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="body">Body</label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Exam">Exam</option>
          <option value="Event">Event</option>
          <option value="General">General</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Normal">Normal</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="publishDate">Publish Date</label>
        <input
          id="publishDate"
          type="date"
          value={publishDate}
          onChange={(e) => setPublishDate(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Saving..." : isEdit ? "Update Notice" : "Create Notice"}
      </button>
    </form>
  );
}
