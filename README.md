# FitFunnel 🏋️

A prospect management platform for personal trainers and fitness managers.

## Features

### For Managers
- Dashboard Analytics: Real-time stats and team performance tracking.
- Trainer Management: Invite trainers via email and assign prospects.
- CSV Import: Smart column mapping to bulk import leads.

### For Trainers
- Assigned Prospects: Personalized dashboards for trainer-specific leads.
- Outreach Logging: Log every call, text, and interaction with notes.
- Pipeline Tracking: Move prospects through custom stages (New Lead → Contacted → Trial → PT).

## Tech Stack
- Next.js 15+ (App Router, Turbopack)
- Prisma + CockroachDB
- NextAuth.js
- Resend
- Tailwind CSS

## Getting Started

1. Prerequisites
   - Node.js 18+
   - CockroachDB instance
   - Resend API Key
2. Installation
   ```bash
   npm install
   ```
3. Setup
   Create a `.env` file:
   ```env
   DATABASE_URL=your_db_url
   NEXTAUTH_SECRET=your_secret
   NEXTAUTH_URL=http://localhost:3000
   RESEND_API_KEY=your_resend_key
   ```
4. Database & Run
   ```bash
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

## Project Structure

- app/ — App routes and API
- components/ — Layout and UI components
- lib/ — Utilities and config
- prisma/ — Database schema
- public/ — Static assets

## First-Time Setup
- Register your first account (created as MANAGER)
- Invite trainers via the Trainers page
- Start adding prospects
