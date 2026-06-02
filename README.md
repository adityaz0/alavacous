# ALAVACOUS

ALAVACOUS is a Phase 1 MVP for a premium student collaboration and team-building SaaS. Students, developers, designers, editors, freelancers, and builders can create profiles, post projects, discover open teams, and apply to collaborate.

## Stack

- React + Vite
- Tailwind CSS
- Firebase Authentication
- Firestore Database
- Vercel-ready deployment

## Local Setup

1. Install dependencies.

   ```bash
   pnpm install
   ```

2. Create a Firebase project, enable Email/Password authentication, and create a Firestore database.

3. Copy `.env.example` to `.env.local` and add your Firebase web app config.

4. Start development.

   ```bash
   pnpm dev
   ```

## Firestore Collections

- `users`
- `projects`
- `applications`

Deploy the included `firestore.rules` file in Firebase before sharing the app with real users.
The current rules allow project owners to manage their projects and allow applicants to create applications while incrementing a project's `applicantCount`.

## Phase 1 Scope

Included: landing page, signup, login, logout, forgot password, protected routes, profile editor, project posting, browse/search/filter projects, project details, applications, applicant review, and dashboard summaries.

Not included yet: messaging, notifications, group chats, AI matching, or payments.
