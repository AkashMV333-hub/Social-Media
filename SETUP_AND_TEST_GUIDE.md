# Complete Setup and Testing Guide

This guide will walk you through setting up and testing the entire Twitter Clone application step-by-step.

## Table of Contents
1. [Initial Setup](#initial-setup)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Testing Checklist](#testing-checklist)
5. [Common Issues](#common-issues)

---

## Initial Setup

### Prerequisites Check
```bash
# Check Node.js version (should be v14+)
node --version

# Check npm version
npm --version

# Check if MongoDB is installed
mongod --version
```

If MongoDB is not installed:
- **Windows**: Download from mongodb.com
- **Mac**: `brew install mongodb-community`
- **Linux**: `sudo apt-get install mongodb`

---

## Backend Setup

### Step 1: Navigate to Server Directory
```bash
cd server
```

### Step 2: Install Dependencies
```bash
npm install
```

Expected output: All packages installed successfully

### Step 3: Create Environment File
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

### Step 4: Edit .env File

Open `server/.env` and configure:

```env
NODE_ENV=development
PORT=5000

# MongoDB (choose one option)
# Option 1: Local MongoDB
MONGO_URI=mongodb://localhost:27017/twitter-clone

# Option 2: MongoDB Atlas (recommended for deployment)
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/twitter-clone

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_change_this_to_random_string

JWT_EXPIRE=7d

# Client URL
CLIENT_URL=http://localhost:3000

# Image Storage (choose one)
# Option 1: Local storage (easiest for development)
USE_LOCAL_STORAGE=true

# Option 2: Cloudinary (recommended for production)
# USE_LOCAL_STORAGE=false
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
```

### Step 5: Start MongoDB
```bash
# Windows - open new terminal
"C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe"

# Mac/Linux - open new terminal
mongod
```

Keep this terminal running!

### Step 6: Seed Database (Optional but Recommended)
```bash
# In the server directory
npm run seed
```

Expected output:
```
MongoDB Connected
Clearing existing data...
Creating users...
Created 5 users
Creating tweets...
Created 15 tweets
Creating follow relationships...

Test credentials:
Email: john@example.com | Password: password123
Email: jane@example.com | Password: password123
...
```

### Step 7: Start Backend Server
```bash
npm run dev
```

Expected output:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

**✅ Backend is now running on http://localhost:5000**

Test it: Open browser and go to `http://localhost:5000/api/health`

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-..."
}
```

---

## Frontend Setup

### Step 1: Navigate to Client Directory
```bash
# Open NEW terminal
cd client
```

### Step 2: Install Dependencies
```bash
npm install
```

Expected output: All packages installed successfully

### Step 3: Create Environment File
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

### Step 4: Edit .env File

Open `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

### Step 5: Copy Frontend Code

The frontend code is provided in `COMPLETE_FRONTEND_CODE.md`. You need to create all the files listed in that document.

**Quick way to verify structure:**

Your `client/src` should have:
```
src/
├── api/
│   └── axios.js
├── components/
│   ├── layout/
│   │   ├── Navbar.js
│   │   └── Sidebar.js
│   ├── tweet/
│   │   ├── TweetCard.js
│   │   ├── TweetComposer.js
│   │   └── CommentList.js
│   ├── profile/
│   │   ├── ProfileHeader.js
│   │   └── FollowButton.js
│   ├── common/
│   │   ├── LoadingSpinner.js
│   │   └── ErrorMessage.js
│   └── ProtectedRoute.js
├── context/
│   └── AuthContext.js
├── pages/
│   ├── Login.js
│   ├── Register.js
│   ├── Home.js
│   ├── Profile.js
│   ├── Explore.js
│   ├── Notifications.js
│   └── Messages.js
├── App.js
├── index.js
└── index.css
```

Copy each component from `COMPLETE_FRONTEND_CODE.md` to its respective location.

### Step 6: Start Frontend Server
```bash
npm run dev
```

Expected output:
```
  VITE ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

**✅ Frontend is now running on http://localhost:3000**

---

## Testing Checklist

### 1. Authentication Flow ✅

#### Test Registration:
1. Go to `http://localhost:3000/register`
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Username: testuser
   - Password: password123
3. Click "Sign up"
4. Should redirect to home feed

#### Test Login:
1. Logout (click Logout button in navbar)
2. Go to `http://localhost:3000/login`
3. Use seeded credentials:
   - Email: john@example.com
   - Password: password123
4. Click "Log in"
5. Should redirect to home feed

**Expected Result**: Successfully logged in, see home feed

---

### 2. Tweet Creation ✅

#### Create Text Tweet:
1. On home page, find the "What's happening?" text area
2. Type: "This is my first tweet! #testing"
3. Check character count (should show X/280)
4. Click "Tweet"
5. Tweet should appear at the top of the feed

**Expected Result**: Tweet created and visible in feed

#### Create Tweet with Image:
1. Click "What's happening?"
2. Type: "Testing image upload"
3. Click the image icon
4. Select an image from your computer (max 5MB)
5. See image preview
6. Click "Tweet"
7. Tweet with image should appear in feed

**Expected Result**: Tweet with image created successfully

---

### 3. Like & Unlike ✅

1. Find any tweet in the feed
2. Click the heart icon (🤍)
3. Heart should turn red (❤️) and count increases
4. Click again to unlike
5. Heart turns gray and count decreases

**Expected Result**: Like count updates correctly

---

### 4. Comments ✅

1. Find any tweet
2. Click the comment icon (💬)
3. Type: "Great tweet!"
4. Click "Reply"
5. Comment should appear below the tweet
6. Comment count should increase

**Expected Result**: Comment added successfully

---

### 5. Follow System ✅

#### Follow User:
1. Click "Explore" in sidebar
2. Search for "jane"
3. Click on a user profile
4. Click "Follow" button
5. Button should change to "Unfollow"
6. Follower/Following counts should update

**Expected Result**: Successfully following user

#### View Home Feed:
1. Go back to Home
2. Click "Home Feed" tab
3. Should see tweets from followed users

**Expected Result**: Feed shows followed users' tweets

---

### 6. User Profile ✅

#### View Profile:
1. Click your profile picture in navbar OR
2. Click "Profile" in sidebar
3. Should see:
   - Cover photo
   - Profile picture
   - Name, username, bio
   - Join date
   - Follower/Following counts
   - Your tweets

**Expected Result**: Profile page displays correctly

#### Edit Profile:
1. On your profile, click "Edit Profile"
2. Update:
   - Name: "Updated Name"
   - Bio: "Software developer and tech enthusiast"
   - Location: "San Francisco, CA"
   - Website: "https://example.com"
3. Click "Save Changes"
4. Profile should update

**Expected Result**: Profile updated successfully

#### Upload Profile Picture:
1. On your profile, click the "+" button on profile picture
2. Select an image
3. Image should upload and display

**Expected Result**: Profile picture updated

---

### 7. Search & Explore ✅

1. Go to Explore page
2. Type "john" in search box
3. Press Enter
4. Should see users matching "john"
5. Click on a user to view their profile

**Expected Result**: Search returns relevant users

---

### 8. Notifications ✅

1. Have another user (login with different seed account):
   - Like your tweet
   - Comment on your tweet
   - Follow you
2. Click notifications icon (🔔) in navbar
3. Should see all notifications
4. Notifications should mark as read

**Expected Result**: Notifications display correctly

---

### 9. Direct Messages ✅

#### Send Message:
1. Go to Messages page
2. If no conversations, use Explore to find a user
3. Click on user profile
4. Create a way to message them (or use direct URL)
5. Go to `/messages/:userId` (replace :userId with actual ID)
6. Type: "Hello! How are you?"
7. Click "Send"
8. Message should appear in the chat

**Expected Result**: Message sent successfully

#### View Conversations:
1. Messages page should show all conversations
2. Click on a conversation
3. See full message history
4. Send and receive messages

**Expected Result**: Messaging works bi-directionally

---

### 10. Delete Tweet ✅

1. Find your own tweet
2. Click the trash icon (🗑️)
3. Confirm deletion
4. Tweet should disappear from feed
5. Tweet count should decrease

**Expected Result**: Tweet deleted successfully

---

### 11. Responsive Design ✅

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1440px)
4. Verify:
   - Navbar adapts
   - Sidebar hides on mobile
   - Feed is readable
   - Buttons are clickable

**Expected Result**: App is responsive on all screen sizes

---

## API Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test User",
    "email": "apitest@example.com",
    "username": "apitest",
    "password": "password123"
  }'
```

### Login and Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@example.com",
    "password": "password123"
  }'
```

Copy the token from the response!

### Create Tweet (replace YOUR_TOKEN)
```bash
curl -X POST http://localhost:5000/api/tweets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Testing via cURL!"
  }'
```

### Get Latest Tweets
```bash
curl http://localhost:5000/api/tweets/latest
```

---

## Common Issues

### Issue: MongoDB Connection Error
**Error**: `MongoServerError: connect ECONNREFUSED`

**Solution**:
1. Ensure MongoDB is running: `mongod`
2. Check MONGO_URI in `.env`
3. Try: `mongodb://127.0.0.1:27017/twitter-clone` instead of `localhost`

---

### Issue: CORS Error
**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**:
1. Check CLIENT_URL in `server/.env` matches frontend URL
2. Ensure backend server is running
3. Restart both servers

---

### Issue: Token Invalid
**Error**: `Not authorized to access this route`

**Solution**:
1. Clear localStorage: Browser DevTools → Application → Local Storage → Clear
2. Login again
3. Check JWT_SECRET is set in `.env`

---

### Issue: Image Upload Fails
**Error**: `Image upload failed`

**Solution**:
1. Check file size (<5MB)
2. Verify file type (jpg, png, gif, webp)
3. If using local storage:
   - Check `server/uploads/` directory exists
   - Check `USE_LOCAL_STORAGE=true` in `.env`
4. If using Cloudinary:
   - Verify credentials in `.env`
   - Check Cloudinary dashboard for errors

---

### Issue: Frontend Won't Start
**Error**: Various npm errors

**Solution**:
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

---

### Issue: Port Already in Use
**Error**: `Port 5000 is already in use`

**Solution**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

---

## Performance Testing

### Load Test with Apache Bench
```bash
# Test home feed endpoint
ab -n 100 -c 10 http://localhost:5000/api/tweets/latest

# Expected: <100ms average response time
```

### Check Database Indexes
```bash
# Connect to MongoDB
mongo

# Use database
use twitter-clone

# Check indexes
db.users.getIndexes()
db.tweets.getIndexes()
db.follows.getIndexes()
```

---

## Production Deployment Checklist

### Backend
- [ ] Set NODE_ENV=production
- [ ] Use strong JWT_SECRET
- [ ] Configure MongoDB Atlas
- [ ] Set up Cloudinary
- [ ] Enable rate limiting
- [ ] Set up error logging (Sentry)
- [ ] Configure HTTPS
- [ ] Set up backup strategy

### Frontend
- [ ] Update VITE_API_URL to production backend
- [ ] Build: `npm run build`
- [ ] Test build: `npm run preview`
- [ ] Deploy to Vercel/Netlify
- [ ] Configure custom domain
- [ ] Enable HTTPS

---

## Success Criteria

✅ All authentication flows work
✅ Can create, view, like, and delete tweets
✅ Can follow/unfollow users
✅ Search finds users correctly
✅ Notifications display properly
✅ Direct messages work
✅ Profile updates save correctly
✅ Images upload successfully
✅ Responsive on mobile/tablet/desktop
✅ No console errors
✅ Fast load times (<2s)

---

## Next Steps

After completing all tests:

1. **Customize**: Update branding, colors, features
2. **Deploy**: Push to production
3. **Monitor**: Set up error tracking and analytics
4. **Scale**: Optimize for more users
5. **Enhance**: Add features from roadmap

---

## Support

If you encounter issues:
1. Check this guide
2. Review error logs
3. Check MongoDB is running
4. Verify all environment variables
5. Restart both servers
6. Clear browser cache and localStorage

---

**Happy Testing! 🎉**
