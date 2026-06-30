import Link from "next/link";
import NoticeForm from "../../components/NoticeForm";

export default function NewNotice() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Add New Notice</h1>
        <Link href="/" className="btn btn-secondary">
          ← Back to Notices
        </Link>
      </div>
      <NoticeForm />
    </div>
  );
}
