import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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

  if (loading) return <p>Loading...</p>;
  if (notFound) return <p>Notice not found.</p>;

  return (
    <div>
      <h1>Edit Notice</h1>
      <NoticeForm initialData={notice} noticeId={id} />
    </div>
  );
}
