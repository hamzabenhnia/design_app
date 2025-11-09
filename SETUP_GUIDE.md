# 🚀 Quick Setup Guide - Football Kit Designer

## ✅ All Issues Fixed

### Frontend Fixes:
1. ✅ **Login page now connects to backend API** - No more fake data
2. ✅ **Users are saved in MongoDB** - Real authentication with database
3. ✅ **Auto-redirect after login** - Navigates to home page on success
4. ✅ **Error handling** - Shows backend error messages
5. ✅ **Register page updated** - Works with backend API
6. ✅ **Improved UI** - Better styling and loading states
7. ✅ **Token management** - JWT token stored in localStorage

### Backend Setup:
1. ✅ **Seed script created** - Add Hamza and Taieb to database
2. ✅ **MongoDB connection** - Using Atlas cloud database

---

## 📝 Steps to Run the Application

### Step 1: Start Backend Server

```bash
cd backend

# Make sure MongoDB URI is configured in .env
# MONGODB_URI=mongodb+srv://taiebjlassi93_db_user:4PemYLR7dEzb7O2I@cluster0.mpccipj.mongodb.net/football-kit?retryWrites=true&w=majority

# Start the backend
npm run dev
```

**Expected output:**
```
✅ MongoDB connecté avec succès
==================================================
🚀 SERVEUR DÉMARRÉ AVEC SUCCÈS
==================================================
📍 Port: 5000
🌍 Environnement: development
🔗 URL Frontend: http://localhost:5173
🏥 Health Check: http://localhost:5000/api/health
==================================================
```

### Step 2: Seed Database with Test Users

Open a **NEW terminal** (keep backend running):

```bash
cd backend
npm run seed
```

**Expected output:**
```
✅ MongoDB connected successfully

🌱 Starting to seed users...

✅ Created user: Hamza ben hnia (hamza.benhnia@example.com)
✅ Created user: Taieb jlassi (taieb.jlassi@example.com)

🎉 Seeding completed successfully!

📋 Login credentials:

   👤 Hamza ben hnia
      Email: hamza.benhnia@example.com
      Password: Password123!
      Role: admin

   👤 Taieb jlassi
      Email: taieb.jlassi@example.com
      Password: Password123!
      Role: user
```

### Step 3: Start Frontend

Open **ANOTHER terminal**:

```bash
cd ui
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 4: Test the Application

1. **Open browser:** http://localhost:5173

2. **Click "Connexion" button** in navbar

3. **Login with test account:**
   - Email: `hamza.benhnia@example.com`
   - Password: `Password123!`
   - Click "Se connecter"

4. **You should be:**
   - Redirected to home page
   - See user name in navbar
   - Token saved in browser localStorage

5. **Test second user:**
   - Click user icon → Déconnexion
   - Login again with:
     - Email: `taieb.jlassi@example.com`
     - Password: `Password123!`

---

## 🔍 Verify Users in MongoDB Atlas

1. Go to https://cloud.mongodb.com
2. Navigate to your cluster
3. Click **"Browse Collections"**
4. Select `football-kit` database → `users` collection
5. You should see both users with hashed passwords

---

## 🎯 What Changed in the Code

### Frontend (`ui` directory)

#### 1. **`src/redux/actions/authActions.js`**
- ❌ Before: Used fake `setTimeout` with dummy data
- ✅ After: Calls real backend API at `/api/auth/login` and `/api/auth/register`
- ✅ Saves JWT token to localStorage
- ✅ Returns success/error for navigation

#### 2. **`src/pages/LogIn.jsx`**
- ✅ Added auto-redirect after successful login
- ✅ Improved UI with Tailwind styling
- ✅ Added loading spinner
- ✅ Better error message display
- ✅ Added NavBar component

#### 3. **`src/pages/Register.jsx`**
- ✅ Connected to backend API
- ✅ Auto-redirect after registration
- ✅ Added NavBar
- ✅ Improved styling and UX

#### 4. **`src/hooks/index.js`**
- ✅ Added `useAppSelector` for better Redux typing

### Backend (`backend` directory)

#### 5. **`scripts/seedUsers.js`** (NEW)
- ✅ Seeds two test users: Hamza and Taieb
- ✅ Checks if users exist before creating
- ✅ Hashes passwords automatically
- ✅ Shows login credentials after seeding

#### 6. **`package.json`**
- ✅ Added `"seed": "node scripts/seedUsers.js"` script

---

## 🐛 Troubleshooting

### Login button does nothing
- ✅ **Fixed!** Now calls backend API
- Check browser console for errors
- Ensure backend is running on port 5000

### "Network Error" or "Connection refused"
- ❌ Backend not running
- ✅ Solution: `cd backend && npm run dev`

### "Email ou mot de passe incorrect"
- ❌ Wrong credentials or user doesn't exist
- ✅ Solution: Run `npm run seed` to create test users

### Token not saved
- Check browser DevTools → Application → Local Storage
- Should see `token` and `user` keys

### CORS errors
- Backend `.env` has `CLIENT_URL=http://localhost:5173`
- Server.js has CORS configured for frontend URL

---

## 📊 Test the Full Flow

### Registration Flow
1. Go to http://localhost:5173/register
2. Fill in form:
   - Nom: Test
   - Prénom: User
   - Email: test@example.com
   - Travail: Developer
   - Password: Test123!
   - Confirm: Test123!
3. Click "S'inscrire"
4. ✅ Should redirect to home
5. ✅ User appears in navbar
6. ✅ User saved in MongoDB

### Login Flow
1. Go to http://localhost:5173/login
2. Enter credentials:
   - Email: hamza.benhnia@example.com
   - Password: Password123!
3. Click "Se connecter"
4. ✅ Should redirect to home
5. ✅ User appears in navbar
6. ✅ Token in localStorage

### Logout Flow
1. Click user icon in navbar
2. Click "Déconnexion"
3. ✅ User removed from navbar
4. ✅ Token cleared from localStorage
5. ✅ Shows "Connexion" button again

---

## 🎉 Success Indicators

✅ Backend running on port 5000  
✅ Frontend running on port 5173  
✅ MongoDB Atlas connected  
✅ Two test users in database  
✅ Login redirects to home  
✅ User info shows in navbar  
✅ Token saved in localStorage  
✅ Logout clears session  
✅ Register creates new users in DB  

---

## 📧 Test User Credentials

**Admin User:**
```
Email: hamza.benhnia@example.com
Password: Password123!
Role: admin
```

**Regular User:**
```
Email: taieb.jlassi@example.com
Password: Password123!
Role: user
```

---

## 🔗 Important URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health
- **MongoDB Atlas:** https://cloud.mongodb.com

---

**Everything is now working! 🎉**
