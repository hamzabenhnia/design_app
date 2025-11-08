# Football Kit Designer - Frontend

React-based 3D football kit designer with real-time customization using Three.js and React Three Fiber.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Connecting to Backend](#connecting-to-backend)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- 🎨 Real-time 3D kit customization
- 🏃 Interactive 3D model viewer with React Three Fiber
- 👤 User authentication and profile management
- 💾 Save and manage design collections
- 🎯 Redux state management
- 📱 Responsive design with Tailwind CSS
- ☁️ Cloud-based image and model uploads
- 🔒 Protected routes and authentication

## 🛠 Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **3D Graphics:** Three.js, React Three Fiber, Drei
- **State Management:** Redux with Redux Thunk
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS v4
- **HTTP Client:** Axios
- **Icons:** Lucide React, React Icons
- **Additional:** HTML2Canvas, File Saver, Fabric.js

## 📁 Project Structure

```
ui/
├── public/                 # Static assets
│   ├── fonts/             # 3D text fonts
│   ├── models/            # 3D model files
│   └── textures/          # Texture files
├── src/
│   ├── components/        # React components
│   │   ├── CardProduct.jsx
│   │   ├── FootballKitDesigner.jsx
│   │   ├── ModelsManager.jsx
│   │   ├── NavBar.jsx
│   │   ├── ShirtModel.jsx
│   │   ├── Sidebar.jsx
│   │   └── Users.jsx
│   ├── hooks/             # Custom React hooks
│   │   ├── index.js       # Hook exports
│   │   ├── useAPI.js      # API call wrapper
│   │   ├── useAuth.js     # Authentication hook
│   │   ├── useDesigns.js  # Design management
│   │   ├── useModels.js   # 3D model management
│   │   ├── useUI.js       # UI state
│   │   └── useUsers.js    # User management
│   ├── pages/             # Page components
│   │   ├── AddModel.jsx
│   │   ├── Description.jsx
│   │   ├── DesignPage.jsx
│   │   ├── Home.jsx
│   │   ├── LogIn.jsx
│   │   ├── MyCollection.jsx
│   │   ├── ProductListe.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   └── UsersList.jsx
│   ├── redux/             # Redux store
│   │   ├── actions/       # Action creators
│   │   ├── constants/     # Action types
│   │   └── reducers/      # Reducers
│   ├── services/          # API services
│   │   └── api.js         # Axios instance & API calls
│   ├── store/             # Redux store configuration
│   │   └── index.js
│   ├── App.jsx            # Main app component
│   ├── App.css            # App styles
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Verify `.env` file exists with correct backend URL
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will start on `http://localhost:5173`

5. **Open in browser:**
   ```
   http://localhost:5173
   ```

## 🔐 Environment Variables

The `.env` file in the ui directory contains:

```env
# ============================================
# BACKEND API CONFIGURATION
# ============================================
# The backend API URL - make sure backend is running on this port
VITE_API_URL=http://localhost:5000/api

# ============================================
# DEVELOPMENT CONFIGURATION
# ============================================
# Vite dev server port (default: 5173)
# VITE_PORT=5173

# ============================================
# OPTIONAL CONFIGURATION
# ============================================
# Enable/disable features
# VITE_ENABLE_ANALYTICS=false
# VITE_ENABLE_DEBUG=true
```

**Important:** Never commit `.env` files with sensitive data to version control!

## 📝 Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 🔗 Connecting to Backend

### Step 1: Ensure Backend is Running

Make sure your backend server is running first:

```bash
cd ../backend
npm run dev
```

Expected output:
```
==================================================
🚀 SERVEUR DÉMARRÉ AVEC SUCCÈS
==================================================
📍 Port: 5000
🌍 Environnement: development
🔗 URL Frontend: http://localhost:5173
🏥 Health Check: http://localhost:5000/api/health
==================================================
```

### Step 2: Verify API Connection

The frontend automatically connects to the backend using the `VITE_API_URL` from `.env`.

**API Configuration** (`src/services/api.js`):
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### Step 3: Test the Connection

1. Start the frontend: `npm run dev`
2. Navigate to: `http://localhost:5173/register`
3. Create a test account
4. Login with credentials
5. Check browser console for any API errors

### Backend API Endpoints Used

The frontend connects to these backend endpoints:

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

**Designs:**
- `GET /api/designs` - Get all designs
- `POST /api/designs` - Create design
- `PUT /api/designs/:id` - Update design
- `DELETE /api/designs/:id` - Delete design

**Models:**
- `GET /api/models` - Get all 3D models
- `POST /api/models` - Upload model
- `DELETE /api/models/:id` - Delete model

**Uploads:**
- `POST /api/upload/image` - Upload image
- `POST /api/upload/model` - Upload 3D model file

**Health Check:**
- `GET /api/health` - Server status

## 🐛 Troubleshooting

### Error: `Network Error` or `ERR_CONNECTION_REFUSED`

**Cause:** Backend server is not running or wrong URL.

**Solution:**
1. Make sure backend is running: `cd ../backend && npm run dev`
2. Verify backend URL in `.env` matches backend port (default: 5000)
3. Check CORS settings in backend allow `http://localhost:5173`

### Error: `401 Unauthorized`

**Cause:** No valid authentication token.

**Solution:**
- Login again to get a new token
- Check if token is stored: Open DevTools → Application → Local Storage → `token`
- Clear localStorage and login again: `localStorage.clear()`

### Error: `Module not found`

**Cause:** Dependencies not installed.

**Solution:**
```bash
# Delete node_modules and reinstall
rmdir /s /q node_modules
del package-lock.json
npm install
```

### 3D Models Not Loading

**Cause:** Model files missing or incorrect path.

**Solution:**
1. Check that model files exist in `public/models/`
2. Verify model paths in components match actual file locations
3. Check browser console for 404 errors
4. Verify file formats are supported (.glb, .gltf)

### Vite Server Won't Start - Port in Use

**Cause:** Port 5173 already in use.

**Solution:**
```bash
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or change port in vite.config.js
export default defineConfig({
  server: { port: 3000 },
  plugins: [tailwindcss(), react()]
})
```

### Styles Not Loading

**Cause:** Tailwind CSS configuration issue.

**Solution:**
1. Verify `@tailwindcss/vite` is in dependencies
2. Check `vite.config.js` has tailwindcss plugin:
   ```javascript
   import tailwindcss from '@tailwindcss/vite'
   plugins: [tailwindcss(), react()]
   ```
3. Clear Vite cache: `rmdir /s /q node_modules\.vite && npm run dev`

### Redux State Not Persisting

**Cause:** localStorage not being saved properly.

**Solution:**
- Check browser console for localStorage errors
- Verify Redux actions are dispatching correctly
- Install Redux DevTools extension for debugging
- Check that reducers are updating state correctly

### CORS Errors

**Cause:** Backend not configured to accept requests from frontend origin.

**Solution:**
- Verify backend `server.js` has correct CORS configuration:
  ```javascript
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  }));
  ```
- Make sure `CLIENT_URL` in backend `.env` matches frontend URL

## 🔒 Security Notes

- ⚠️ Never commit `.env` file to version control (already in `.gitignore`)
- 🔑 JWT tokens are stored in localStorage
- 🌐 Backend CORS must allow frontend origin
- 🛡️ Use HTTPS in production
- 🔐 Validate all user inputs
- 🚫 Don't store sensitive data in localStorage

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)

## 🎯 Quick Start Checklist

- [ ] Node.js installed
- [ ] Backend running on port 5000
- [ ] MongoDB connected (backend)
- [ ] Frontend `.env` configured
- [ ] Run `npm install` in ui directory
- [ ] Run `npm run dev`
- [ ] Can access `http://localhost:5173`
- [ ] Can register/login successfully
- [ ] 3D models loading correctly
- [ ] No console errors

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Test thoroughly (both frontend and backend)
4. Commit changes: `git commit -m "Add my feature"`
5. Push to branch: `git push origin feature/my-feature`
6. Submit a pull request

## 📄 License

ISC

---

**Need Help?** Check the troubleshooting section or refer to the backend README in `../backend/README.md`.
