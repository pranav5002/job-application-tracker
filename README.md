# Job Application Tracker

A full-stack, intelligent workflow assistant built with **Next.js 16**, **TypeScript**, **MongoDB**, and **Better Auth** to help job seekers capture, organize, and track every stage of their hiring pipeline.

**Live Deployment:** https://job-application-tracker-gamma-ten.vercel.app/

---

## 1. Chosen Vertical
**Career & Personal Productivity Assistant** — Designing a structured, context-aware workspace that eliminates scattered spreadsheets and automates hiring pipeline tracking.

## 2. Approach & Logic
Job seekers frequently lose track of application statuses, interview stages, and follow-ups across multiple platforms. Our approach centralizes the entire workflow into an interactive Kanban system:
- **Automated Workspace Provisioning (`lib/init-user-board.ts`):** When a user signs up or accesses their dashboard for the first time, the system automatically checks for an existing workspace and initializes a structured 5-stage pipeline (*Wish List*, *Applied*, *Interviewing*, *Offer*, and *Rejected*) without duplicating records.
- **Drag-and-Drop State Management (`@dnd-kit`):** Users can dynamically reorder applications within a column or transition them across hiring stages with instant UI feedback and persistent database updates.
- **Authenticated User Isolation (`better-auth`):** Every board, column, and job card is strictly scoped to the authenticated user's `userId` via server actions.

## 3. How the Solution Works
1. **Authentication:** Users register or sign in securely via Better Auth (`/sign-up`, `/sign-in`).
2. **Board Initialization:** On first login, `initializeUserBoard()` provisions a default `"Job Hunt"` board and five ordered Kanban columns in MongoDB.
3. **Application Management:** Users create job application cards (company, role, status, notes, links) and drag them across stages as their interview process progresses.
4. **Automated Testing:** Unit, database-logic, and UI accessibility tests are powered by **Vitest** and **React Testing Library** (`npm test`).

## 4. Assumptions Made
- Users manage multiple job applications concurrently and benefit from a standardized 5-stage hiring funnel out of the box.
- Cloud persistence (MongoDB) is required so job seekers can access their boards seamlessly across devices.
- Automated tests must run deterministically without requiring live database credentials in CI environments.

---

## Local Setup & Testing

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env.local

# 3. Run automated test suite
npm test

# 4. Start development server
npm run dev
```
