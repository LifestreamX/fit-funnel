# FitFunnel 🏋️

A modern prospect management platform designed for personal trainers and fitness managers to streamline PT client acquisition, trainer collaboration, and outreach automation.

## 🎯 Overview

FitFunnel helps personal trainers and fitness managers efficiently manage prospects, track engagement, and convert leads into paying PT clients. Built with performance, security, and user experience in mind.

## ✨ Key Features

### For Managers

- **Dashboard Analytics**: Real-time stats on prospects, conversion rates, and team performance
- **Trainer Management**: Invite trainers via email, assign prospects, and manage permissions
- **Prospect Pipeline**: Track prospects through stages (New Lead → Contacted → Trial → PT Client)
- **Bulk Import**: CSV import with intelligent column mapping
- **Member Management**: Add, edit, and delete prospects with detailed contact information

### For Trainers

- **Assigned Prospects**: View and manage prospects assigned to you
- **Add New Leads**: Capture new prospects on the go
- **Outreach Tracking**: Log contact attempts and notes
- **Status Updates**: Move prospects through the pipeline

### Authentication & Security

- **Role-Based Access Control**: Manager and Trainer roles with appropriate permissions
- **Secure Authentication**: NextAuth.js with bcrypt password hashing
- **Password Reset**: Email-based forgot password flow
- **Session Management**: Secure JWT-based sessions

### User Experience

- **Responsive Design**: Mobile-first, works on all devices
- **Gym-Themed UI**: Orange and red color scheme with fitness branding
- **Unified Dropdowns**: All dropdowns use a custom Select component styled to match the app's theme
- **Themed Scrollbars**: Dropdown and overflow scrollbars use the app's orange accent color for a consistent look
- **Smart Forms**: Auto-formatting phone inputs, email validation
- **Instant Feedback**: Toast notifications, loading states, confirmation modals

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router, React Server Components)
- **Database**: [Prisma](https://prisma.io) + [CockroachDB](https://cockroachlabs.com)
- **Authentication**: [NextAuth.js](https://next-auth.js.org)
- **Email**: [Resend](https://resend.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Language**: TypeScript
- **Deployment Ready**: Vercel, Netlify, or self-hosted

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A CockroachDB database (free tier available at [cockroachlabs.com](https://cockroachlabs.com))
- A Resend account for transactional emails ([resend.com](https://resend.com))

### Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:LifestreamX/fit-funnel.git
   cd fit-funnel
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL=your_cockroachdb_connection_string

   # NextAuth
   NEXTAUTH_SECRET=your_secret_key_here
   NEXTAUTH_URL=http://localhost:3000

   # Email (Resend)
   RESEND_API_KEY=your_resend_api_key
   ```

   **Important**: Do NOT use quotes around values in `.env`

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000)

### First-Time Setup

1. Register your first account (will be created as MANAGER role)
2. Invite trainers via the Trainers page
3. Start adding prospects!

## 📁 Project Structure

```
fit-funnel/
├── app/
│   ├── (app)/              # Authenticated app routes
│   │   ├── dashboard/      # Manager dashboard
│   │   ├── prospects/      # Prospect management
│   │   ├── trainers/       # Trainer management
│   │   └── import/         # CSV import
│   ├── (auth)/             # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── api/                # API routes
│   └── page.tsx            # Landing page
├── components/
│   ├── layout/             # Layout components
│   └── ui/                 # Reusable UI components
├── lib/                    # Utilities and config
├── prisma/
│   └── schema.prisma       # Database schema
└── public/                 # Static assets
```

## 🔒 Security Notes

- Never commit `.env` files to version control
- Rotate `NEXTAUTH_SECRET` regularly
- Use strong passwords and enable 2FA on service accounts
- Keep dependencies updated

## 🎨 Customization

- **Colors**: Update Tailwind config in `tailwind.config.ts`
- **Branding**: Replace favicon in `public/favicon.svg`
- **Email Templates**: Modify API routes in `app/api/trainers/invite/` and `app/api/auth/`

## 📊 Database Schema

Key models:

- **User**: Managers and trainers with role-based access
- **Member**: Prospects with status tracking, contact info, and trainer assignment
- **Activity Logs**: Track all actions for audit trails

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Other Platforms

Compatible with any Node.js hosting provider. Ensure environment variables are configured and database is accessible.

## 🤝 Contributing

This is a private commercial project. Contact the repository owner for collaboration opportunities.

## 📄 License

Proprietary - All rights reserved

## 💬 Support

For questions or issues, contact the development team.

---

Built with ❤️ for fitness professionals
