# FitFunnel 🏋️

A prospect management platform for personal trainers and fitness managers.

## 🎯 Features

### For Managers
- **Dashboard Analytics**: Real-time stats and team performance tracking.
- **Trainer Management**: Invite trainers via email and assign prospects.
- **CSV Import**: Smart column mapping to bulk import leads.

### For Trainers
- **Assigned Prospects**: Personalized dashboards for trainer-specific leads.
- **Outreach Logging**: Log every call, text, and interaction with notes.
- **Pipeline Tracking**: Move prospects through custom stages (New Lead → Contacted → Trial → PT).

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router, Turbopack)
- **Database**: Prisma + CockroachDB
- **Auth**: NextAuth.js
- **Email**: Resend
- **Styling**: Tailwind CSS

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- CockroachDB instance
- Resend API Key

### 2. Installation
```bash
npm install
```

### 3. Setup
Create a `.env` file:
```env
DATABASE_URL=your_db_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
RESEND_API_KEY=your_resend_key
```

### 4. Database & Run
```bash
npx prisma generate
npx prisma db push
npm run dev
```

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
