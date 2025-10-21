# Cherryz WebShare - Manager Application

A modern web-based file management interface built with React, TypeScript, and Vite.

## Features

### Authentication
- Secure login with JWT tokens
- Token persistence in localStorage
- Protected routes requiring authentication
- Role-based access (Admin/User)

### File Management
- Browse files and folders with breadcrumb navigation
- Upload files with progress indicator (Admin only)
- Create directories (Admin only)
- Delete files and folders with confirmation (Admin only)
- Move/rename files and folders (Admin only)
- Download files (All users)
- Display file metadata (size, modified date)

### UI/UX
- Responsive layout
- Dark/light theme support
- Toast notifications for user feedback
- Loading states and error handling
- Empty states
- Modern, clean design with Radix UI components

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **State Management**: TanStack React Query
- **Styling**: Emotion (CSS-in-JS)
- **UI Components**: Radix UI
- **Icons**: FontAwesome
- **Date Handling**: dayjs

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Running API server (see main project README)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Development

```bash
# Start development server
npm run dev

# Type checking
npm run type-check
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
sources/
├── main.tsx                        # Application entry point
├── Application.tsx                 # Root component with providers
├── vite-env.d.ts                  # Vite type definitions
├── settings/
│   ├── index.ts                   # App settings and constants
│   └── theme.ts                   # Theme configuration
├── types/
│   └── index.ts                   # TypeScript type definitions
├── api/
│   └── client.ts                  # API client functions
├── hooks/
│   ├── useAuthentication.ts       # Authentication hook
│   ├── useTheme.ts                # Theme management hook
│   └── useToast.ts                # Toast notification hook
├── components/
│   ├── ui/
│   │   └── Toast.tsx              # Toast notification component
│   ├── layouts/
│   │   └── MainLayout.tsx         # Main layout with header/nav
│   ├── authentication/
│   │   └── LoginForm.tsx          # Login form component
│   └── files/
│       ├── FileList.tsx           # File browser table
│       ├── FileUpload.tsx         # File upload component
│       └── FileActions.tsx        # File action dialogs
└── pages/
    ├── LoginPage.tsx              # Login page
    ├── DashboardPage.tsx          # Dashboard page
    └── FilesPage.tsx              # File management page
```

## API Integration

The application communicates with the backend API at `/api` (proxied by Vite dev server).

### Endpoints Used

- `POST /api/authentication/login` - User login
- `GET /api/files?path=...` - List files in directory
- `GET /api/files/download?path=...` - Download file
- `POST /api/files/upload` - Upload file (Admin)
- `POST /api/files/directory` - Create directory (Admin)
- `PUT /api/files/move` - Move/rename file (Admin)
- `DELETE /api/files?path=...` - Delete file (Admin)

### Authentication

All API requests (except login) include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## User Roles

### Admin
- Full access to all features
- Can upload, move, delete files and folders
- Can create directories

### User
- Read-only access
- Can browse files and folders
- Can download files

## Default Credentials

```
Username: admin
Password: admin123
```

## Development Notes

- TypeScript strict mode is enabled
- All components use Emotion's CSS-in-JS for styling
- React Query handles all server state management
- Theme persistence uses localStorage
- Auto-refresh is disabled to prevent unnecessary API calls

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ JavaScript features
- CSS Grid and Flexbox

## License

Private - Part of Cherryz WebShare project
