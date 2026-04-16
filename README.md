# CloudVault - S3 File Manager

A modern, full-stack file management application with **AWS S3 storage**, **JWT authentication**, and a **beautiful React UI** with dark theme.

**Live Preview:** Upload, download, and manage your files securely in the cloud ☁️

## 🌟 Features

✅ **User Authentication** - Register & login with encrypted passwords  
✅ **File Management** - Upload, download, and delete files  
✅ **AWS S3 Integration** - Secure cloud storage with S3  
✅ **User Isolation** - Each user only sees their own files  
✅ **Modern UI** - Dark theme with Tailwind CSS & shadcn/ui components  
✅ **Toast Notifications** - Real-time feedback with Sonner  
✅ **Sidebar Navigation** - File list and quick actions on the left  
✅ **Confirmation Modals** - Safe delete and logout confirmations  
✅ **API Logging** - Real-time API history tracking  
✅ **Responsive Design** - Works on desktop and mobile  

## 🏗️ Tech Stack

### Backend
- **Express.js** - REST API framework
- **TypeScript** - Type-safe code
- **PostgreSQL** - User & file metadata database
- **AWS SDK** - S3 file storage
- **JWT + Bcryptjs** - Secure authentication
- **Multer** - File upload handling

### Frontend
- **React 18** - UI framework
- **Vite** - Lightning-fast build tool
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Modern styling
- **shadcn/ui** - Pre-built UI components
- **Sonner** - Toast notifications
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Database
- **PostgreSQL** - Relational database

## 📋 Prerequisites

Before starting, ensure you have:

1. **Node.js v18+** - [Download](https://nodejs.org/)
2. **PostgreSQL v12+** - [Download](https://www.postgresql.org/download/)
3. **AWS Account** - [Create Account](https://aws.amazon.com/)
4. **Windows, Mac, or Linux** - This setup covers Windows

## 🚀 Quick Start (Windows)

### Step 1: Prepare AWS S3

#### 1.1 Create S3 Bucket
1. Go to **AWS Console → S3**
2. Click **"Create bucket"**
3. Enter bucket name: `cloudvault-storage` (must be globally unique)
4. Choose region: `us-east-1` or your preference
5. Click **Create**

#### 1.2 Create AWS IAM User
1. Go to **AWS Console → IAM → Users → Create user**
2. Username: `cloudvault-app`
3. Create access key: **Security credentials → Create access key**
4. Access key type: **Application running on an AWS compute service**
5. **Download CSV** with Access Key ID and Secret Access Key

#### 1.3 Attach S3 Permissions
1. Go to **Users → cloudvault-app → Add permissions**
2. **Attach policies directly**
3. Search and select: `AmazonS3FullAccess`
4. Click **Add permissions**

---

### Step 2: Setup PostgreSQL

1. **Download PostgreSQL** - [postgresql.org](https://www.postgresql.org/download/windows/)
2. **Run installer** and remember the `postgres` password
3. **Open pgAdmin** (comes with PostgreSQL)
4. Create new database:
   - Right-click **Databases → Create → Database**
   - Name: `s3_db`
   - Click **Create**

Or use **PowerShell**:
```powershell
# Connect as postgres user
psql -U postgres

# Create database
CREATE DATABASE s3_db;

# Exit
\q
```

---

### Step 3: Clone & Setup Backend

```powershell
# Navigate to backend
cd D:\AWS\backend

# Install dependencies
npm install

# Create .env file
# Edit the .env file with your credentials
```

**Update `.env` file** with your values:
```
PORT=5000
DATABASE_URL=postgresql://postgres:your_postgres_password@localhost:5432/s3_db
JWT_SECRET=d52875dbbc0cad81d9c4e45d912c95986eb83dc8d077e32defabaa35ad3120a8
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
NODE_ENV=development
```

**Replace:**
- `your_postgres_password` - Password you set during PostgreSQL installation
- `your_access_key_id` - From AWS CSV download
- `your_secret_access_key` - From AWS CSV download
- `your-bucket-name` - S3 bucket name (e.g., `cloudvault-storage`)

**Start Backend**:
```powershell
npm run dev
```

You should see:
```
Server is running on port 5000
Database initialized successfully
[timestamp] GET /api/health - Status: 200 - 2ms
```

**Keep this terminal open!**

---

### Step 4: Setup Frontend

**Open a NEW terminal**:

```powershell
# Navigate to frontend
cd D:\AWS\frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

You should see:
```
VITE v4.5.14 ready in 123 ms

➜  Local:   http://localhost:3001/
➜  press h to show help
```

---

### Step 5: Access the App

1. **Open browser**: `http://localhost:3001`
2. You'll see the **CloudVault login page**

---

## 📱 Using CloudVault

### Register Account
1. Click **"Create new account"** tab
2. Enter:
   - **Username**: `testuser`
   - **Email**: `test@example.com`
   - **Password**: `password123`
3. Click **Register**
4. See success message ✓

### Login
1. Return to **Login** tab
2. Enter credentials
3. Click **Login**
4. Redirected to File Manager

### File Manager Layout

```
┌─────────────────────────────────────────────┐
│  S3 File Manager          Welcome, testuser │
├──────────────┬──────────────────────────────┤
│ Your Files   │  Upload Card                 │
│ (Sidebar)    │  Drag & drop files here      │
│              │                              │
│ • file1.pdf  │                              │
│ • doc2.txt   │                              │
│              │                              │
│ [ Logout ]   │                              │
└──────────────┴──────────────────────────────┘
```

### File Operations

**Upload File**
1. Click upload area or drag file
2. See success toast
3. File appears in sidebar
4. Uploaded to AWS S3

**Download File**
1. Click file in sidebar
2. Click download icon
3. File downloads to computer

**Delete File**
1. Click file in sidebar
2. Click delete icon
3. **Confirmation modal** appears
4. Click **Delete** to confirm
5. File removed from S3 and database

**Logout**
1. Click **Logout** button
2. **Confirmation modal** appears
3. Click **Logout** to confirm
4. Redirected to login page

---

## 🔍 Real-Time API Logging

Every API call is logged in the backend terminal:

```
[4/14/2026, 11:35:49 AM] POST /api/auth/login - Status: 200 - 45ms
[4/14/2026, 11:36:05 AM] POST /api/files/upload - Status: 201 - 230ms
[4/14/2026, 11:36:10 AM] GET /api/files - Status: 200 - 15ms
[4/14/2026, 11:36:15 AM] DELETE /api/files/1 - Status: 200 - 120ms
```

---

## 🗂️ Project Structure

```
AWS/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server, logging middleware
│   │   ├── database.ts           # PostgreSQL setup, migrations
│   │   ├── auth.ts               # JWT, authentication middleware
│   │   ├── authRoutes.ts         # Register, login endpoints
│   │   ├── fileRoutes.ts         # Upload, download, delete endpoints
│   │   └── s3Service.ts          # AWS S3 operations
│   ├── .env                      # Environment variables
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx              # React entry point
│   │   ├── App.tsx               # Root component with auth
│   │   ├── LoginPage.tsx         # Login & register UI
│   │   ├── FileManager.tsx       # File management with sidebar
│   │   ├── api.ts                # Axios HTTP client
│   │   ├── index.css             # Global Tailwind styles
│   │   ├── lib/
│   │   │   └── utils.ts          # cn() utility function
│   │   └── components/ui/        # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       ├── alert.tsx
│   │       └── label.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts        # Tailwind v4 config
│   ├── postcss.config.js         # PostCSS with @tailwindcss/postcss
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
└── README.md (this file)
```

---

## 🔐 Security Features

✅ **Password Hashing** - Bcryptjs with 10 salt rounds  
✅ **JWT Tokens** - 24-hour expiration  
✅ **User Isolation** - Each user only accesses their files  
✅ **Database Verification** - Files verified to belong to user  
✅ **AWS S3 ACL** - Private access, organized by userId  
✅ **TypeScript** - Type-safe code, fewer runtime errors  

---

## 🐛 Troubleshooting

### "Port already in use" Error

**For Port 5000 (Backend)**:
```powershell
# Find process using port 5000
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

# Then restart backend
npm run dev
```

**For Port 3001 (Frontend)**: Use different port configured in Vite

### "Cannot connect to PostgreSQL"
```powershell
# Check if PostgreSQL is running
psql -U postgres

# If not, restart PostgreSQL service
# Windows: Search "Services" → Find PostgreSQL → Start
```

### "Access Denied" on S3 Upload
1. Verify AWS credentials in `.env`
2. Check IAM user has `AmazonS3FullAccess` policy
3. Confirm bucket name is correct
4. Verify AWS region in `.env`

### "User already exists" on Registration
- Use different username/email
- Or clear database: `DROP DATABASE s3_db; CREATE DATABASE s3_db;`

### Frontend not connecting to backend
1. Verify backend is running: Open `http://localhost:5000/api/health`
2. Check backend console for errors
3. Verify API endpoint in `frontend/src/api.ts`

---

## 🌐 Deploy to AWS EC2

See [EC2_DEPLOYMENT.md](EC2_DEPLOYMENT.md) for step-by-step instructions.

**Quick Summary**:
1. Create EC2 instance (Ubuntu 22.04)
2. SSH into instance
3. Install Node.js, PostgreSQL
4. Upload/clone project files
5. Update `.env` with EC2-specific values
6. Start backend with PM2
7. Build and serve frontend with Nginx
8. Access app via EC2 public IP

---

## 📊 Database Schema

### Users Table
```sql
id: SERIAL PRIMARY KEY
username: VARCHAR(255) UNIQUE NOT NULL
email: VARCHAR(255) UNIQUE NOT NULL
password_hash: VARCHAR(255) NOT NULL
created_at: TIMESTAMP DEFAULT NOW()
```

### Files Table
```sql
id: SERIAL PRIMARY KEY
user_id: INTEGER (FOREIGN KEY → users.id)
file_name: VARCHAR(255) NOT NULL
s3_key: VARCHAR(255) NOT NULL (path in S3)
file_size: INTEGER (bytes)
file_type: VARCHAR(100) (MIME type)
uploaded_at: TIMESTAMP DEFAULT NOW()
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login with credentials

### Files
- `GET /api/files` - List user's files
- `POST /api/files/upload` - Upload new file
- `GET /api/files/download/:fileId` - Download file
- `DELETE /api/files/:fileId` - Delete file

### Health
- `GET /api/health` - Check backend status

---

## 🚀 Production Checklist

- [ ] Change JWT secret to strong random value
- [ ] Use strong PostgreSQL password
- [ ] Never commit `.env` to Git
- [ ] Setup HTTPS/SSL certificate
- [ ] Restrict CORS origins
- [ ] Use RDS for PostgreSQL (managed database)
- [ ] Add rate limiting
- [ ] Add file size/type validation
- [ ] Setup automated backups
- [ ] Monitor API logs
- [ ] Use environment-specific configs

---

## 📚 Documentation

- **Backend Details**: See [backend/README.md](backend/README.md)
- **Frontend Details**: See [frontend/README.md](frontend/README.md)
- **API Docs**: See [API_DOCS.md](API_DOCS.md)

---

## 🤝 Contributing

Found a bug? Have a feature idea? Please create an issue or pull request!

---

## 📄 License

MIT License - Feel free to use this for personal or commercial projects.

---

## 🎯 Next Features (Roadmap)

- [ ] File sharing with links
- [ ] Batch file operations
- [ ] Search and filtering
- [ ] File preview (PDF, images)
- [ ] Trash/recycle bin
- [ ] File versioning
- [ ] Bandwidth statistics
- [ ] Admin dashboard

---

**Made with ❤️ using TypeScript, React, and AWS**

