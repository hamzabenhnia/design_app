# Football Kit Designer - Backend API

Backend API for the Football Kit Designer application. Built with Node.js, Express, MongoDB, and Cloudinary for file storage.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Setup](#database-setup)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- 🔐 JWT-based authentication
- 👤 User management
- 🎨 Design creation and management
- 📦 3D model handling
- ☁️ Cloud file storage with Cloudinary
- 🔒 Secure file upload with validation
- 🛡️ Express middleware for security and validation

## 🛠 Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **File Storage:** Cloudinary
- **File Upload:** Multer
- **Security:** bcryptjs, express-validator
- **Dev Tools:** Nodemon

## 📁 Project Structure

```
backend/
├── config/              # Configuration files
│   ├── cloudinary.js    # Cloudinary setup
│   └── db.js           # MongoDB connection
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── designController.js
│   ├── modelController.js
│   ├── uploadController.js
│   └── userController.js
├── middleware/          # Custom middleware
│   ├── auth.js         # JWT authentication
│   ├── upload.js       # File upload handling
│   └── validation.js   # Request validation
├── models/             # Database models
│   ├── Design.js
│   ├── Model3D.js
│   ├── Product.js
│   └── User.js
├── routes/             # API routes
│   ├── auth.js
│   ├── designs.js
│   ├── models.js
│   ├── uploads.js
│   └── users.js
├── uploads/            # Temporary file storage
│   └── temp/
├── utils/              # Utility functions
│   └── upload.js
├── .env                # Environment variables (not in git)
├── .gitignore         # Git ignore rules
├── package.json       # Dependencies and scripts
├── server.js          # Application entry point
└── README.md          # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas account)
- Cloudinary account (optional, for file uploads)

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` (or create `.env` file)
   - Update the variables (see [Environment Variables](#environment-variables))

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

5. **Test the API:**
   ```bash
   curl http://localhost:5000/api/health
   ```

   Expected response:
   ```json
   {
     "status": "OK",
     "message": "Server is running",
     "timestamp": "2025-11-07T..."
   }
   ```

## 🔐 Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# ============================================
# SERVER CONFIGURATION
# ============================================
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# ============================================
# DATABASE CONFIGURATION
# ============================================
# Option 1: MongoDB Atlas (Cloud)
# Get your MongoDB Atlas URI from: https://www.mongodb.com/cloud/atlas
# Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/football-kit?retryWrites=true&w=majority

# Option 2: Local MongoDB
# MONGODB_URI=mongodb://localhost:27017/football-kit

# ============================================
# JWT CONFIGURATION
# ============================================
# IMPORTANT: Change this to a strong, random secret in production!
# Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRE=30d

# ============================================
# CLOUDINARY CONFIGURATION
# ============================================
# Get your credentials from: https://cloudinary.com/users/register/free
# Find them in your Cloudinary Dashboard
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ============================================
# EMAIL CONFIGURATION (Optional)
# ============================================
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Generate Secure JWT Secret

Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users` - Get all users (protected, admin)
- `GET /api/users/:id` - Get user by ID (protected)
- `PUT /api/users/:id` - Update user (protected)
- `DELETE /api/users/:id` - Delete user (protected, admin)

### Designs
- `GET /api/designs` - Get all designs
- `GET /api/designs/:id` - Get design by ID
- `POST /api/designs` - Create design (protected)
- `PUT /api/designs/:id` - Update design (protected)
- `DELETE /api/designs/:id` - Delete design (protected)

### 3D Models
- `GET /api/models` - Get all 3D models
- `GET /api/models/:id` - Get model by ID
- `POST /api/models` - Upload 3D model (protected)
- `DELETE /api/models/:id` - Delete model (protected)

### File Uploads
- `POST /api/upload/image` - Upload image (protected)
- `POST /api/upload/model` - Upload 3D model file (protected)

### Health Check
- `GET /api/health` - Server health status

## 💾 Database Setup

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. **Create account:**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create cluster:**
   - Click "Build a Database"
   - Choose "FREE" shared cluster
   - Select cloud provider and region
   - Click "Create Cluster"

3. **Create database user:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username and password
   - Grant "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP address:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
   - Click "Confirm"

5. **Get connection string:**
   - Go to "Database"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Update `MONGODB_URI` in `.env`

### Option 2: Local MongoDB

1. **Install MongoDB:**
   - Download from: https://www.mongodb.com/try/download/community
   - Or use package manager:
     ```bash
     # Windows (chocolatey)
     choco install mongodb

     # macOS (homebrew)
     brew tap mongodb/brew
     brew install mongodb-community

     # Linux (Ubuntu/Debian)
     sudo apt-get install mongodb
     ```

2. **Start MongoDB:**
   ```bash
   # Windows
   net start MongoDB

   # macOS/Linux
   sudo systemctl start mongod
   ```

3. **Update .env:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/football-kit
   ```

## 🐛 Troubleshooting

### Error: `querySrv ENOTFOUND _mongodb._tcp.cluster0.mongodb.net`

**Cause:** Invalid MongoDB connection string or placeholder values.

**Solution:**
- Ensure you've replaced `username`, `password`, and cluster URL in `MONGODB_URI`
- Or use local MongoDB: `MONGODB_URI=mongodb://localhost:27017/football-kit`

### Error: `Missing script: "dev"`

**Cause:** Package.json is missing the `type: "module"` field or dev script.

**Solution:**
- Ensure `package.json` has `"type": "module"`
- Ensure scripts section has: `"dev": "nodemon server.js"`

### Error: `Cannot find module './config/database.js'`

**Cause:** Incorrect import path in server.js.

**Solution:**
- The file is named `db.js`, not `database.js`
- Update import to: `import('./config/db.js')`

### Error: `JWT must be provided`

**Cause:** Protected routes require authentication token.

**Solution:**
- Include JWT token in request headers:
  ```
  Authorization: Bearer <your_token>
  ```

### Port Already in Use

**Cause:** Port 5000 is being used by another application.

**Solution:**
- Change `PORT` in `.env` file to another port (e.g., 5001)
- Or stop the other application using port 5000

## 📝 NPM Scripts

```bash
# Start production server
npm start

# Start development server with auto-reload
npm run dev

# Run tests (not implemented yet)
npm test
```

## 🔒 Security Notes

- ⚠️ Never commit `.env` file to version control
- 🔑 Always use strong, random JWT secrets
- 🌐 Restrict IP access in MongoDB Atlas for production
- 🛡️ Enable HTTPS in production
- 🔐 Use environment-specific credentials

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Atlas Guide](https://www.mongodb.com/docs/atlas/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [JWT.io](https://jwt.io/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC

---

**Need Help?** Check the troubleshooting section or create an issue in the repository.
