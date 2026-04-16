# S3 File Manager Frontend

A Vite + React application for uploading and managing files in AWS S3 with user authentication.

## Features

- User registration and login
- JWT token-based authentication
- File upload to AWS S3 (via backend)
- File download from S3
- File deletion
- Responsive UI with modern design
- Session persistence with localStorage

## Prerequisites

- Node.js (v14+)
- npm or yarn
- Backend server running on http://localhost:5000

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

### Development mode:
```bash
npm run dev
```

The app will run on `http://localhost:3000` by default.

### Build for production:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

## Features

### Authentication
- **Registration**: Create new account with username, email, and password
- **Login**: Sign in with credentials
- **Session**: Token stored in localStorage, automatically sent with API requests
- **Logout**: Clear session and return to login page

### File Management
- **Upload**: Select and upload files to S3
- **View**: List all uploaded files with details
- **Download**: Download files from S3
- **Delete**: Remove files from S3 and database

## Project Structure

```
frontend/
├── src/
│   ├── main.tsx           # Application entry point
│   ├── App.tsx            # Main app component
│   ├── LoginPage.tsx      # Login/Register component
│   ├── FileManager.tsx    # File management component
│   ├── api.ts             # API client configuration
│   ├── style.css          # Global styles
│   └── vite-env.d.ts      # Vite type definitions
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── package.json
└── .gitignore
```

## API Integration

The frontend communicates with the backend API at `http://localhost:5000/api`.

### Authentication Flow

1. **Register/Login**: Send credentials to `/api/auth/register` or `/api/auth/login`
2. **Token Storage**: JWT token stored in localStorage under key `token`
3. **API Requests**: Token automatically added to all requests via axios interceptor
4. **Session**: User data stored in localStorage under key `user`

### API Endpoints Used

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/files/upload` - Upload file
- `GET /api/files/files` - Get user's files
- `GET /api/files/download/:fileId` - Download file
- `DELETE /api/files/files/:fileId` - Delete file
- `GET /api/files/s3/list` - List S3 files

## Environment Configuration

The proxy is configured in `vite.config.ts` to forward API requests to the backend:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  }
}
```

Change the target URL if your backend runs on a different port.

## Styling

The application uses custom CSS with a modern gradient design:
- Purple gradient theme (#667eea to #764ba2)
- Responsive layout
- Mobile-friendly design
- Clean component-based styling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security

- JWT tokens stored in localStorage
- Authorization header automatically added to requests
- Token validation on backend
- CORS-enabled backend

## Troubleshooting

### "Cannot connect to backend"
- Ensure backend is running on `http://localhost:5000`
- Check CORS configuration in backend
- Verify proxy configuration in `vite.config.ts`

### "File upload fails"
- Check file size limits
- Verify AWS S3 permissions
- Ensure backend environment variables are set

### "Login shows invalid credentials"
- Verify backend database is initialized
- Check PostgreSQL connection
- Review backend logs for errors

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

MIT
