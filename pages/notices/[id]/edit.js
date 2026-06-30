import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import NoticeForm from "../../../components/NoticeForm";

export default function EditNotice() {
  const router = useRouter();
  const { id } = router.query;
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/notices/${id}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setNotice(data);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Edit Notice</h1>
        <Link href="/" className="btn btn-secondary">
          ← Back to Notices
        </Link>
      </div>

      {loading && <p className="state-message">Loading…</p>}
      {!loading && notFound && (
        <p className="state-message">Notice not found.</p>
      )}
      {!loading && !notFound && (
        <NoticeForm initialData={notice} noticeId={id} />
      )}
    </div>
  );
}
