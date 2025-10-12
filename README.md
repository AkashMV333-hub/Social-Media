# Twitter Clone - Full Stack MERN Social Media Application

A complete, production-ready Twitter-like social media application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

### Core Functionality
- User authentication with JWT and bcrypt
- Create, read, and delete tweets with text and images
- Like/unlike tweets and comments
- Comment system for tweets
- Follow/unfollow users
- User profiles with customizable bio, location, website, and images
- Home feed showing tweets from followed users
- Global latest tweets feed
- Search users by name or username
- Real-time notifications for likes, comments, and follows
- Direct messaging between users
- Responsive mobile-first design

### Technical Features
- RESTful API architecture
- JWT-based authentication
- Password hashing with bcrypt
- Image upload with Cloudinary or local storage
- Input validation with express-validator
- Error handling and logging
- Rate limiting for security
- Pagination for feeds
- CORS configuration
- MongoDB indexes for performance
- React Context for state management
- Protected routes
- Responsive UI with Tailwind CSS

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcrypt
- Multer (file uploads)
- Cloudinary (cloud storage)
- express-validator
- Helmet (security)
- CORS

### Frontend
- React 18
- React Router v6
- Axios
- Tailwind CSS
- Vite
- date-fns
- React Icons

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (optional, for cloud image storage)

## Quick Start

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd SocialMediaSite
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Required: MONGO_URI, JWT_SECRET
# Optional: Cloudinary credentials (or set USE_LOCAL_STORAGE=true)
```

#### Example .env configuration:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/twitter-clone
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
USE_LOCAL_STORAGE=true
```

```bash
# Start MongoDB (if using local)
mongod

# Seed the database with test data
npm run seed

# Start the server
npm run dev
```

Server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open new terminal
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
# VITE_API_URL=http://localhost:5000

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Test the Application

#### Using Seed Data:
The seed script creates 5 test users:

- Email: `john@example.com` | Password: `password123`
- Email: `jane@example.com` | Password: `password123`
- Email: `bob@example.com` | Password: `password123`
- Email: `alice@example.com` | Password: `password123`
- Email: `charlie@example.com` | Password: `password123`

#### Manual Testing Flow:
1. Go to `http://localhost:3000/register`
2. Create a new account
3. Create a tweet with text and/or image
4. Search for other users in the Explore page
5. Follow users
6. Like and comment on tweets
7. Check notifications
8. Send direct messages

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJhbGc..."
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Tweet Endpoints

#### Create Tweet
```http
POST /api/tweets
Authorization: Bearer <token>
Content-Type: multipart/form-data

text: "This is my first tweet!"
image: <file> (optional)
```

#### Get Home Feed
```http
GET /api/tweets/feed?limit=20&skip=0
Authorization: Bearer <token>
```

#### Get Latest Tweets
```http
GET /api/tweets/latest?limit=20&skip=0
```

#### Like Tweet
```http
POST /api/tweets/:id/like
Authorization: Bearer <token>
```

#### Create Comment
```http
POST /api/tweets/:id/comment
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Great tweet!"
}
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/:username
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "bio": "Software developer",
  "location": "San Francisco",
  "website": "https://johndoe.com"
}
```

#### Follow User
```http
POST /api/follow/:userId/follow
Authorization: Bearer <token>
```

### Search Endpoints

#### Search Users
```http
GET /api/search/users?q=john
```

### Complete API documentation available in:
- `server/README.md` - Detailed API docs
- `POSTMAN_COLLECTION.json` - Import into Postman

## Testing with cURL

### Register a user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create a tweet (replace YOUR_TOKEN)
```bash
curl -X POST http://localhost:5000/api/tweets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello Twitter Clone!"
  }'
```

## Project Structure

```
SocialMediaSite/
├── server/                    # Backend
│   ├── config/               # Database & Cloudinary config
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Auth, validation, error handling
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── scripts/              # Seed data
│   ├── utils/                # Helper functions
│   ├── .env.example          # Environment variables template
│   ├── server.js             # Entry point
│   └── package.json
│
├── client/                   # Frontend
│   ├── src/
│   │   ├── api/             # Axios configuration
│   │   ├── components/      # React components
│   │   ├── context/         # React Context (Auth)
│   │   ├── pages/           # Page components
│   │   ├── App.js           # Main app with routes
│   │   └── index.js         # Entry point
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── tailwind.config.js
│
├── POSTMAN_COLLECTION.json   # API testing
├── COMPLETE_FRONTEND_CODE.md # Full frontend reference
└── README.md                 # This file
```

## Database Models

### User
- name, email, username, password (hashed)
- profilePicture, coverPhoto, bio, location, website
- followersCount, followingCount, tweetsCount
- createdAt, updatedAt

### Tweet
- author (ref: User)
- text, image
- likes[], likesCount
- commentsCount, retweetsCount
- createdAt, updatedAt

### Comment
- tweet (ref: Tweet)
- author (ref: User)
- text
- likes[], likesCount
- createdAt, updatedAt

### Follow
- follower (ref: User)
- following (ref: User)
- createdAt

### Notification
- recipient (ref: User)
- sender (ref: User)
- type (like, comment, follow, retweet)
- tweet, comment (refs)
- read, message
- createdAt

### Message
- sender (ref: User)
- recipient (ref: User)
- text, read
- conversationId
- createdAt

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT tokens with expiration
- Rate limiting on auth routes (5 requests per 15 minutes)
- Input validation on all endpoints
- Helmet for security headers
- CORS configuration
- File upload size limits (5MB)
- Protected routes requiring authentication
- User authorization checks

## Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables
2. Connect MongoDB Atlas
3. Configure Cloudinary
4. Deploy from Git

### Frontend (Vercel/Netlify)
1. Set VITE_API_URL to production backend
2. Build: `npm run build`
3. Deploy `dist` folder

### MongoDB Atlas Setup
1. Create cluster
2. Get connection string
3. Update MONGO_URI in .env
4. Whitelist IP addresses

### Cloudinary Setup
1. Sign up at cloudinary.com
2. Get cloud name, API key, and secret
3. Update .env with credentials
4. Set USE_LOCAL_STORAGE=false

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in .env
- For Atlas: Check IP whitelist

### CORS Error
- Verify CLIENT_URL in server .env matches frontend URL
- Check if server is running

### Image Upload Fails
- If using Cloudinary: Verify credentials
- If using local storage: Ensure uploads/ directory exists
- Check file size (<5MB)

### JWT Token Errors
- Ensure JWT_SECRET is set
- Check token format: `Bearer <token>`
- Token may be expired (default 7 days)

## Features Roadmap

### Future Enhancements
- [ ] Retweet functionality
- [ ] Tweet threads
- [ ] Hashtags and trending topics
- [ ] @mentions
- [ ] Real-time updates with WebSockets
- [ ] Email verification
- [ ] Password reset
- [ ] Two-factor authentication
- [ ] Advanced search filters
- [ ] Block/mute users
- [ ] Bookmark tweets
- [ ] Dark mode
- [ ] Analytics dashboard
- [ ] Media galleries
- [ ] Verified accounts

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

MIT

## Support

For issues or questions:
- Check the documentation in `server/README.md` and `client/README.md`
- Review `COMPLETE_FRONTEND_CODE.md` for all frontend code
- Import `POSTMAN_COLLECTION.json` for API testing
- Open an issue on GitHub

## Acknowledgments

- Built as a learning project demonstrating full-stack MERN development
- Inspired by Twitter's UI and functionality
- Perfect for portfolios, interviews, and learning

---

**Happy Coding!**
