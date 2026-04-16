# S3 File Manager Backend

A TypeScript/Express backend for managing file uploads to AWS S3 with PostgreSQL database and JWT authentication.

## Features

- User registration and login with encrypted passwords (bcryptjs)
- JWT-based authentication
- AWS S3 integration for file storage
- PostgreSQL database for metadata storage
- REST APIs for file operations (upload, download, delete, list)

## Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- AWS Account with S3 bucket
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Configure your `.env` file with:
   - PostgreSQL connection string
   - AWS credentials
   - S3 bucket name
   - JWT secret key

Example `.env`:
```
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/s3_db
JWT_SECRET=your_super_secret_jwt_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
NODE_ENV=development
```

## Database Setup

PostgreSQL will be automatically initialized on first server start. The following tables will be created:
- `users` - User authentication and profile data
- `files` - File metadata and S3 references

## Running the Server

### Development mode (with hot reload):
```bash
npm run dev
```

### Build TypeScript:
```bash
npm run build
```

### Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password"
}

Response:
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### File Operations

All file endpoints require Authentication header: `Authorization: Bearer <token>`

#### Upload File
```
POST /api/files/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form Data:
- file: <binary_file_content>

Response:
{
  "message": "File uploaded successfully",
  "file": {
    "id": 1,
    "user_id": 1,
    "file_name": "document.pdf",
    "s3_key": "1/1234567890-document.pdf",
    "file_size": 102400,
    "file_type": "application/pdf",
    "uploaded_at": "2024-01-15T10:30:00"
  }
}
```

#### Get User's Files
```
GET /api/files/files
Authorization: Bearer <token>

Response:
{
  "files": [
    {
      "id": 1,
      "user_id": 1,
      "file_name": "document.pdf",
      "s3_key": "1/1234567890-document.pdf",
      "file_size": 102400,
      "file_type": "application/pdf",
      "uploaded_at": "2024-01-15T10:30:00"
    }
  ]
}
```

#### Download File
```
GET /api/files/download/:fileId
Authorization: Bearer <token>

Response: Binary file content
```

#### Delete File
```
DELETE /api/files/files/:fileId
Authorization: Bearer <token>

Response:
{
  "message": "File deleted successfully"
}
```

#### List S3 Files
```
GET /api/files/s3/list
Authorization: Bearer <token>

Response:
{
  "files": [...]
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 5000) |
| DATABASE_URL | PostgreSQL connection string |
| JWT_SECRET | Secret key for JWT token generation |
| AWS_ACCESS_KEY_ID | AWS access key |
| AWS_SECRET_ACCESS_KEY | AWS secret key |
| AWS_REGION | AWS region (e.g., us-east-1) |
| AWS_S3_BUCKET | S3 bucket name |
| NODE_ENV | Environment (development/production) |

## Folder Structure

```
backend/
├── src/
│   ├── index.ts           # Main server file
│   ├── database.ts        # PostgreSQL connection & initialization
│   ├── s3Service.ts       # AWS S3 operations
│   ├── auth.ts            # Authentication & JWT
│   ├── authRoutes.ts      # Auth endpoints
│   └── fileRoutes.ts      # File management endpoints
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore
```

## Security Notes

- Passwords are encrypted using bcryptjs with salt rounds of 10
- JWT tokens expire after 24 hours
- S3 files are stored with ACL set to private
- All API endpoints except auth require authentication token

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `404` - Not found
- `500` - Server error

## License

MIT
