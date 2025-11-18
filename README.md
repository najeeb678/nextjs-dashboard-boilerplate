# Admin Panel Template

A modern Next.js dashboard template for building admin interfaces, built with TypeScript, TailwindCSS, and ShadCN UI components.

## Features

- **Data Management**: View and manage data entities with detailed information displays
- **User Management**: Admin interface for managing users and permissions
- **Analytics Dashboard**: Overview of key metrics and performance data
- **Light Theme**: Customizable color scheme with modern design
- **Responsive Design**: Mobile-friendly layout with collapsible sidebar
- **Data Tables**: Advanced filtering, search, and export functionality
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS v3
- **UI Components**: Radix UI primitives
- **Data Tables**: TanStack Table
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Form Validation**: Zod (optional)
- **Notifications**: React Toastify (optional)

## How to use

1. Clone this repo:

   ```bash
   git clone https://github.com/your-username/nextjs-admin-template.git
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
│   │   ├── [entity]/      # Dynamic entity management pages
│   │   ├── users/         # User management page
│   │   └── analytics/     # Analytics and reports page
│   ├── globals.css        # Global styles and theme
│   ├── layout.tsx         # Root layout component
│   └── middleware.ts      # Route protection and middleware
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (buttons, inputs, etc.)
│   ├── common/           # Shared components (tables, forms, etc.)
│   └── dashboard/        # Dashboard-specific components
├── lib/                  # Utility libraries and configurations
├── store/               # State management (Zustand)
├── types/               # TypeScript type definitions
└── utils/               # Helper functions and utilities
```

## Customization

### Color Theme

The application includes a customizable light theme. You can modify the color palette in `src/app/globals.css`:

```css
:root {
  --background: /* your background color */ ;
  --primary: /* your primary color */ ;
  --secondary: /* your secondary color */ ;
  --accent: /* your accent color */ ;
  --highlight: /* your highlight color */ ;
  --text-primary: /* your primary text color */ ;
  --text-secondary: /* your secondary text color */ ;
}
```

### Adding New Pages

1. Create a new folder in `src/app/(dashboard)/`
2. Add your page component with `page.tsx`
3. Update the sidebar navigation in `src/components/dashboard/Sidebar.tsx`
4. Add any necessary API routes or data fetching logic

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

MIT License - feel free to use this template for your own admin panel projects.
