# Admin Panel

A modern Next.js dashboard for managing reading sessions, built with TypeScript, TailwindCSS, and ShadCN UI components.

## Features

- **Session Management**: View and manage reading sessions with detailed conversation threads
- **User Management**: Admin interface for managing users and their sessions
- **Analytics Dashboard**: Overview of session metrics and performance data
- **Light Theme**: Pleasant color scheme with lavender and gold accents
- **Responsive Design**: Mobile-friendly layout with collapsible sidebar
- **Data Tables**: Advanced filtering, search, and CSV export functionality
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 15.2.1 with App Router
- **Language**: TypeScript 5
- **Styling**: TailwindCSS v3
- **UI Components**: Radix UI (Dialog, Select, Slot)
- **Data Tables**: TanStack Table v8
- **State Management**: Zustand v5
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Validation**: Zod
- **Redis**: Upstash Redis, ioredis
- **Utilities**: UUID, clsx, tailwind-merge, class-variance-authority
- **Notifications**: React Toastify
- **Fonts**: Geist

## How to use

1. Clone this repo:

   ```bash
   git clone https://github.com/your-username/admin-panel-template.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Folder Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── dashboard/     # Main dashboard page
│   │   ├── sessions/      # Session management pages
│   │   ├── users/         # User management page
│   │   └── analytics/     # Analytics page
│   ├── globals.css        # Global styles with light theme
│   ├── layout.tsx         # Root layout
│   └── middleware.ts      # Route protection middleware
├── components/            # Reusable UI components
│   ├── ui/               # ShadCN UI components
│   ├── common/           # Shared components (DataTable, etc.)
│   └── dashboard/        # Dashboard-specific components
├── lib/                  # Utility libraries
├── store/               # Zustand state management
├── types/               # TypeScript type definitions
└── utils/               # Helper functions
```

## Color Theme

The application uses a light color palette:

- **Background**: Very Light Lavender (#faf9ff)
- **Primary**: Light Lavender (#f0eaff)
- **Secondary**: Light Blue (#e6e0ff)
- **Accent**: Light Purple (#d4ccff)
- **Highlight**: Gold (#ffd87d)
- **Text**: Dark Gray (#2a2a2a) and Gray (#787878)

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env.local` file in the root directory with your API endpoints and configuration.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - feel free to use this project for your own admin panel needs.
