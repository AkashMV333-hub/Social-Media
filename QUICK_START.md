# 🚀 Quick Start Guide

## Current Status

✅ Backend dependencies installed
✅ Frontend dependencies installed
✅ .env files created
✅ Uploads directory created
⚠️ **MongoDB needs to be installed**

---

## Step 1: Install MongoDB (REQUIRED)

### Option A: Install MongoDB Community Edition (Recommended for Development)

**Windows:**
1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer (choose "Complete" installation)
3. Install as a Windows Service
4. MongoDB will start automatically

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Option B: Use MongoDB Atlas (Cloud - Free Tier)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a new cluster (free tier M0)
4. Create a database user
5. Whitelist your IP address (or allow from anywhere: 0.0.0.0/0)
6. Get your connection string (it looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/twitter-clone
   ```
7. Replace `MONGO_URI` in `server/.env` with your connection string

---

## Step 2: Start Backend Server

```bash
# Navigate to server directory
cd server

# Option A: Seed database with test data (recommended)
npm run seed

# Start the server
npm run dev
```

**Expected Output:**
```
Server running in development mode on port 5000
MongoDB Connected: localhost (or your Atlas cluster)
```

**Test it:** Open browser and go to http://localhost:5000/api/health

---

## Step 3: Start Frontend Server

Open a **NEW terminal window**:

```bash
# Navigate to client directory
cd client

# Start the development server
npm run dev
```

**Expected Output:**
```
VITE ready in XXX ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.x.x:3000/
```

---

## Step 4: Test the Application

1. Open your browser and go to: **http://localhost:3000**

2. **Login with seed data** (if you ran `npm run seed`):
   - Email: `john@example.com`
   - Password: `password123`

   OR

3. **Register a new account**:
   - Click "Sign up"
   - Fill in the registration form
   - Start using the app!

---

## 🎯 What You Can Do Now

- ✅ Create tweets with text and images
- ✅ Like and comment on tweets
- ✅ Follow/unfollow users
- ✅ Edit your profile
- ✅ Upload profile and cover photos
- ✅ Search for users
- ✅ View notifications
- ✅ Send direct messages
- ✅ View home feed and latest tweets

---

## 🔧 Troubleshooting

### MongoDB Connection Error

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
1. Make sure MongoDB is running:
   - **Windows:** Check Services → MongoDB Server should be "Running"
   - **Mac:** `brew services list` → mongodb-community should be "started"
   - **Linux:** `sudo systemctl status mongodb`

2. Or use MongoDB Atlas (cloud database)

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### CORS Error

**Solution:**
- Make sure both backend (port 5000) and frontend (port 3000) are running
- Check that `CLIENT_URL=http://localhost:3000` in `server/.env`

---

## 📝 Test Accounts (if seeded)

After running `npm run seed`, use these accounts:

| Email | Password | Username |
|-------|----------|----------|
| john@example.com | password123 | johndoe |
| jane@example.com | password123 | janesmith |
| bob@example.com | password123 | bobjohnson |
| alice@example.com | password123 | alicew |
| charlie@example.com | password123 | charlieb |

---

## 🌐 URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health
- **API Documentation:** See `API_EXAMPLES.md`

---

## 📚 Next Steps

1. ✅ **Install MongoDB** (if not done)
2. ✅ **Start both servers**
3. ✅ **Test the application**
4. 📖 **Read the documentation:**
   - `README.md` - Project overview
   - `SETUP_AND_TEST_GUIDE.md` - Complete testing guide
   - `API_EXAMPLES.md` - API documentation
   - `COMPLETE_FRONTEND_CODE.md` - Frontend code reference

---

## 🎓 Development Tips

### Hot Reload
Both servers support hot reload:
- Backend: Automatically restarts on file changes (nodemon)
- Frontend: Automatically refreshes browser (Vite HMR)

### View Logs
- **Backend:** Check terminal where you ran `npm run dev`
- **Frontend:** Check browser console (F12)

### Database GUI
Install MongoDB Compass to view your database visually:
- Download: https://www.mongodb.com/products/compass
- Connect to: `mongodb://localhost:27017`

---

## ✨ You're All Set!

Your Twitter Clone is ready to use. Enjoy building and learning! 🎉

**Need Help?**
- Check `SETUP_AND_TEST_GUIDE.md` for detailed instructions
- Review `API_EXAMPLES.md` for API usage
- See `COMPLETE_FRONTEND_CODE.md` for frontend code

---

**Happy Coding! 🚀**
