# Cherryz WebShare - Viewer Application

A clean, modern, read-only file browsing and download application built with React, TypeScript, and Vite.

## Features

- **Authentication**: Secure login with JWT token storage
- **File Browsing**: Browse directories with breadcrumb navigation
- **File Download**: Download files directly from the browser
- **Search & Filter**: Client-side search to find files quickly
- **Sorting**: Sort files by name, size, or modification date
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Design**: Works on all screen sizes
- **TypeScript**: Fully typed with strict mode enabled

## Tech Stack

- **Vite** - Fast build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **Emotion** - CSS-in-JS styling
- **Radix UI** - Accessible UI components
- **FontAwesome** - Icons
- **dayjs** - Date formatting

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file with the following:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:5173

The dev server proxies API requests to http://localhost:3000 to avoid CORS issues.

### Production Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Type Checking

Run TypeScript type checking:

```bash
npm run type-check
```

## Project Structure

```
sources/
├── main.tsx                    # Entry point
├── Application.tsx             # Main app with providers and routing
├── emotion.d.ts                # Emotion theme types
├── settings/
│   └── index.ts               # Configuration constants
├── types/
│   └── index.ts               # TypeScript types
├── api/
│   └── client.ts              # API client functions
├── hooks/
│   └── useAuthentication.ts   # Authentication hook
├── components/
│   ├── layouts/
│   │   └── MainLayout.tsx     # Main layout with header
│   ├── authentication/
│   │   └── LoginForm.tsx      # Login form component
│   └── files/
│       ├── FileList.tsx       # File browser with search/sort
│       └── FileDetails.tsx    # Breadcrumbs and folder info
└── pages/
    ├── LoginPage.tsx          # Login page
    └── FilesPage.tsx          # File browsing page
```

## Usage

### Login

1. Navigate to the application
2. Enter your username and password
3. Click "Login"

Default credentials (when using the API server):
- Username: `admin` or any registered user
- Password: Your password

### Browsing Files

- Click on folders to navigate into them
- Use breadcrumbs to navigate back up
- Use the search box to filter files by name
- Click sort buttons to sort by name, size, or date
- Click "Download" button to download files

### Theme Toggle

Click the sun/moon icon in the header to toggle between light and dark modes.

### Logout

Click the "Logout" button in the header to log out.

## API Integration

The viewer integrates with the Cherryz WebShare API:

- **POST** `/api/authentication/login` - User login
- **GET** `/api/files?path=...` - List files in a directory
- **GET** `/api/files/download?path=...` - Download a file

See `/API.md` in the project root for full API documentation.

## Differences from Manager App

The Viewer app is intentionally limited to read-only operations:

- ✅ View files and directories
- ✅ Download files
- ✅ Search and filter
- ✅ Sort files
- ❌ No upload functionality
- ❌ No delete functionality
- ❌ No move/rename functionality
- ❌ No directory creation

This makes it ideal for users who only need to browse and download files.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT
