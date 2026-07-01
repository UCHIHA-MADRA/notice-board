import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const notices = await prisma.notice.findMany({
        orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
      });
      return res.status(200).json(notices);
    }

    if (req.method === "POST") {
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

      const notice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: parsedDate,
          image: image || null,
        },
      });

      return res.status(201).json(notice);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (err) {
    console.error("[/api/notices]", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}