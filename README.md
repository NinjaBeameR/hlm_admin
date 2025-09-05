# Admin Dashboard

A production-ready React admin dashboard with Supabase authentication and real-time data management.

## Features

- **Secure Authentication**: Email/password login with Supabase Auth
- **Protected Routes**: Automatic authentication guards and redirects
- **Real-time Data**: Read-only access to bug reports and suggestions
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Professional UI**: Clean, modern interface with loading states and error handling
- **Type Safety**: Full TypeScript integration with proper type definitions

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Supabase account and project
- npm or yarn package manager

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Set up Supabase database:**
   
   Create the following tables in your Supabase database:

   ```sql
   -- Bug reports table
   CREATE TABLE bug_reports (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     description TEXT NOT NULL,
     app_version TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT now()
   );

   -- Suggestions table  
   CREATE TABLE suggestions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     description TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT now()
   );

   -- Enable Row Level Security
   ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;
   ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

   -- Create policies for authenticated users
   CREATE POLICY "Authenticated users can read bug reports"
     ON bug_reports FOR SELECT
     TO authenticated
     USING (true);

   CREATE POLICY "Authenticated users can read suggestions"
     ON suggestions FOR SELECT  
     TO authenticated
     USING (true);
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

### Authentication Setup

1. In your Supabase dashboard, go to Authentication > Settings
2. Ensure email confirmation is disabled for development
3. Create admin users through the Supabase dashboard or Auth API

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── DataTable.tsx   # Sortable table component
│   ├── EmptyState.tsx  # Empty state displays
│   ├── ErrorMessage.tsx # Error handling UI
│   ├── LoadingSpinner.tsx # Loading states
│   ├── Navigation.tsx  # App navigation bar
│   └── ProtectedRoute.tsx # Route protection
├── contexts/           # React Context providers
│   └── AuthContext.tsx # Authentication state
├── hooks/              # Custom React hooks
│   ├── useBugReports.ts # Bug reports data hook
│   └── useSuggestions.ts # Suggestions data hook
├── pages/              # Main page components
│   ├── BugReportsPage.tsx
│   ├── LoginPage.tsx
│   └── SuggestionsPage.tsx
├── types/              # TypeScript definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── supabase.ts     # Supabase client config
└── App.tsx             # Main app component
```

## Deployment

### Netlify Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

3. **Configure redirects** (create `public/_redirects`):
   ```
   /*    /index.html   200
   ```

### Manual Deployment

1. Build the project: `npm run build`
2. Upload the `dist` folder contents to your hosting provider
3. Configure your web server to serve `index.html` for all routes

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## Database Schema

### Bug Reports Table
- `id`: UUID primary key
- `description`: Text description of the bug
- `app_version`: Version where bug was found
- `created_at`: Timestamp

### Suggestions Table
- `id`: UUID primary key  
- `description`: Text description of the suggestion
- `created_at`: Timestamp

## Security

- Row Level Security (RLS) enabled on all tables
- Authentication required for all data access
- No write operations - read-only dashboard
- Secure environment variable handling

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Troubleshooting

### Common Issues

1. **Supabase connection errors**: Verify environment variables are correct
2. **Authentication issues**: Check Supabase Auth settings and RLS policies  
3. **Build errors**: Ensure all dependencies are installed with `npm install`
4. **Data not loading**: Verify database tables exist and have proper RLS policies

### Support

For technical issues:
1. Check browser console for errors
2. Verify Supabase connection and policies
3. Ensure environment variables are properly set
4. Check network connectivity

## License

MIT License - see LICENSE file for details.