# Notice Board

A full CRUD notice board built for the Reno Platforms Web Development Internship assignment. Notices can be created, viewed, edited, and deleted, with Urgent notices always sorted to the top.

**Live app:** https://notice-board-orpin-beta.vercel.app/

## Tech Stack

- Next.js (Pages Router)
- Prisma ORM
- TiDB Cloud Serverless (MySQL-compatible, free tier)
- Deployed on Vercel (Hobby tier)

## Running Locally

1. Clone the repository:

   ```
   git clone https://github.com/UCHIHA-MADRA/notice-board.git
   cd notice-board
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the project root with your own database connection string:

   ```
   DATABASE_URL="mysql://USERNAME:PASSWORD@HOST:4000/DATABASE_NAME?sslaccept=strict&tls=true&connect_timeout=30&pool_timeout=30&connection_limit=1"
   ```

   This project uses TiDB Cloud Serverless (free tier). You can get a connection string by creating a free cluster at [tidbcloud.com](https://tidbcloud.com).

4. Push the Prisma schema to your database:

   ```
   npx prisma db push
   ```

5. Run the development server:

   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## One Thing I'd Improve With More Time

The validation logic for notice fields (checking required fields, valid category/priority values, and valid dates) is currently duplicated between the POST handler in `pages/api/notices/index.js` and the PUT handler in `pages/api/notices/[id].js`. With more time, I'd extract this into a shared helper function (e.g. `lib/validateNotice.js`) that both routes import and call, so validation rules only need to be defined and maintained in one place.

Beyond that, the bigger improvement would be authentication and role-based access — right now anyone with the link can create, edit, or delete any notice, which works for this assignment's scope but wouldn't be production-ready. With more time, I'd add proper login (e.g. NextAuth) and split the app into two views: an admin/staff dashboard for creating and managing notices, and a read-only student/recruiter-facing view for browsing them. This would also open the door to features like per-notice audit history (who posted or edited what, and when) and targeted notices (e.g. visible only to a specific batch or department).

## AI Usage

I used Claude as a coding assistant for this project, primarily for:

- **UI/frontend code** — generating the minimal React components and page structure (notice list, add/edit form). I intentionally kept styling to the bare minimum (no CSS framework usage beyond defaults) so I could focus my own effort on the backend: API design, validation, and the Urgent-first ordering logic.
- **Database setup** — getting Prisma and TiDB Cloud Serverless configured correctly, including resolving a tricky real-world issue where the database was reachable via the Prisma CLI but intermittently failed when queried from the running app. This took genuine back-and-forth debugging (checking network connectivity, TiDB's dashboard, and connection timeout settings) before landing on the fix.
- **This README** — drafting and structuring it based on what I actually built and decided.

The core logic — the Prisma schema, the API routes (`pages/api/notices/`), and the validation rules — I wrote and understand myself, using AI suggestions as a starting point that I then tested and adjusted. Every part of the app was run and verified locally and on the live Vercel deployment by me before submission.