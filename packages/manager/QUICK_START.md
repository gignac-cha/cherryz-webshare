# Quick Start Guide - Cherryz WebShare Manager

## Prerequisites

1. Node.js 18+ installed
2. API server running at `http://localhost:3000`

## Setup (5 minutes)

### 1. Install Dependencies

```bash
cd /home/user/cherryz-webshare/packages/manager
npm install
```

### 2. Configure Environment

The `.env` file is already created with default settings:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:5173**

## Usage

### Login

Default credentials:
- **Username**: `admin`
- **Password**: `admin123`

### Features

#### For All Users
- Browse files and folders
- Download files
- View file information

#### For Admins
- Upload files
- Create folders
- Delete files/folders
- Move/rename files/folders

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check
```

## Architecture

```
┌─────────────────────────────────────┐
│         Browser (localhost:5173)    │
│                                     │
│  ┌─────────────────────────────┐  │
│  │   React Application         │  │
│  │   - Authentication          │  │
│  │   - File Management         │  │
│  │   - Theme System            │  │
│  └─────────────────────────────┘  │
│              ↓ /api (proxied)      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      API Server (localhost:3000)    │
│      - JWT Authentication          │
│      - File Operations             │
│      - Role Management             │
└─────────────────────────────────────┘
```

## Troubleshooting

### Port Already in Use

If port 5173 is in use:

```bash
# Option 1: Kill the process using port 5173
lsof -ti:5173 | xargs kill

# Option 2: Use a different port
vite --port 5174
```

### API Connection Issues

1. Ensure API server is running on port 3000
2. Check `.env` file has correct API URL
3. Verify no CORS errors in browser console
4. Check network tab in browser DevTools

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

## Key Directories

```
sources/
├── api/              # API client
├── components/       # React components
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── settings/        # Configuration
└── types/           # TypeScript types
```

## Theme Toggle

Click the moon/sun icon in the header to switch between light and dark modes.

## File Operations

### Upload a File
1. Navigate to "Files" page
2. Click "Choose File" button
3. Select a file
4. Click "Upload"

### Create a Folder
1. Navigate to "Files" page
2. Click "New Folder" button
3. Enter folder name
4. Click "Create"

### Delete a File
1. Navigate to file location
2. Click trash icon on the file row
3. Confirm deletion

### Move a File
1. Navigate to file location
2. Click move icon on the file row
3. Enter new path
4. Click "Move"

### Download a File
1. Navigate to file location
2. Click download icon on the file row

## Development Tips

### Hot Module Replacement (HMR)

Vite provides instant updates during development. Changes to:
- React components
- TypeScript files
- CSS/styles

Are reflected immediately without full page reload.

### React Query DevTools

Access the React Query DevTools in the bottom-right corner during development to:
- Inspect queries
- View cache state
- Debug API calls
- Monitor refetch behavior

### Browser Extensions

Recommended:
- React DevTools
- Redux DevTools (for React Query)

## Production Deployment

### Build

```bash
npm run build
```

Output: `dist/` directory

### Serve

The built files can be served by any static file server:

```bash
# Option 1: Using Vite preview
npm run preview

# Option 2: Using serve
npx serve dist

# Option 3: Copy to web server
cp -r dist/* /var/www/html/
```

### Environment Variables

For production, update `.env`:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

Rebuild after changing environment variables.

## Support

- Check `README.md` for detailed documentation
- Check `IMPLEMENTATION.md` for technical details
- Review API documentation in `/home/user/cherryz-webshare/API.md`

## Next Steps

1. Explore the dashboard
2. Upload some test files
3. Try different themes
4. Test file operations
5. Review the code to understand the architecture

Enjoy using Cherryz WebShare Manager!
