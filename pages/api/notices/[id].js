import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === "GET") {
      const notice = await prisma.notice.findUnique({ where: { id } });
      if (!notice) {
        return res.status(404).json({ error: "Notice not found" });
      }
      return res.status(200).json(notice);
    }

    if (req.method === "PUT") {
      const existing = await prisma.notice.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ error: "Notice not found" });
      }

      const { title, body, category, priority, publishDate, image } = req.body;

      const errors = [];
      if (!title || typeof title !== "string" || !title.trim()) {
        errors.push("Title is required.");
      }
      if (!body || typeof body !== "string" || !body.trim()) {
        errors.push("Body is required.");
      }
      if (!["Exam", "Event", "General"].includes(category)) {
        errors.push("Category must be one of Exam, Event, or General.");
      }
      if (!["Normal", "Urgent"].includes(priority)) {
        errors.push("Priority must be either Normal or Urgent.");
      }
      const parsedDate = new Date(publishDate);
      if (!publishDate || isNaN(parsedDate.getTime())) {
        errors.push("publishDate must be a valid date.");
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const updated = await prisma.notice.update({
        where: { id },
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: parsedDate,
          image: image || null,
        },
      });

      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      const existing = await prisma.notice.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ error: "Notice not found" });
      }

      await prisma.notice.delete({ where: { id } });
      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (err) {
    console.error(`[/api/notices/${id}]`, err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
