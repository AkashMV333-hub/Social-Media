# Twitter Clone - Backend API

A complete RESTful API for a Twitter-like social media application built with Node.js, Express, and MongoDB.

## Features

- JWT-based authentication with bcrypt password hashing
- User profiles with customizable bio, location, and images
- Tweet creation with text and image uploads
- Like/unlike tweets and comments
- Follow/unfollow users
- Comment system for tweets
- Real-time notifications
- Direct messaging between users
- User search functionality
- Image upload with Cloudinary or local storage
- Input validation and error handling
- Rate limiting for security
- Pagination for feeds

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **File Upload**: Multer + Cloudinary
- **Validation**: express-validator
- **Security**: Helmet, CORS, express-rate-limit

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (optional, for cloud image storage)

## Installation

1. **Clone the repository and navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/twitter-clone
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:3000

   # For Cloudinary (optional)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # For local development without Cloudinary
   USE_LOCAL_STORAGE=true
   ```

4. **Start MongoDB**

   If using local MongoDB:
   ```bash
   mongod
   ```

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

   This creates 5 test users and sample tweets. Login credentials:
   - Email: `john@example.com` | Password: `password123`
   - Email: `jane@example.com` | Password: `password123`
   - (See console output for all test accounts)

6. **Start the development server**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

## Production Deployment

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Users
- `GET /api/users/:username` - Get user profile
- `GET /api/users/:username/tweets` - Get user's tweets
- `PUT /api/users/profile` - Update profile (protected)
- `POST /api/users/profile-picture` - Upload profile picture (protected)
- `POST /api/users/cover-photo` - Upload cover photo (protected)
- `GET /api/users/:username/followers` - Get followers list
- `GET /api/users/:username/following` - Get following list

### Tweets
- `POST /api/tweets` - Create tweet (protected)
- `GET /api/tweets/:id` - Get tweet by ID
- `GET /api/tweets/feed` - Get home feed (protected)
- `GET /api/tweets/latest` - Get latest tweets (public)
- `DELETE /api/tweets/:id` - Delete tweet (protected)
- `POST /api/tweets/:id/like` - Like tweet (protected)
- `DELETE /api/tweets/:id/like` - Unlike tweet (protected)
- `POST /api/tweets/:id/comment` - Comment on tweet (protected)
- `GET /api/tweets/:id/comments` - Get tweet comments

### Follow System
- `POST /api/follow/:id/follow` - Follow user (protected)
- `DELETE /api/follow/:id/follow` - Unfollow user (protected)
- `GET /api/follow/:id/follow/status` - Check follow status (protected)

### Comments
- `DELETE /api/comments/:id` - Delete comment (protected)
- `POST /api/comments/:id/like` - Like comment (protected)
- `DELETE /api/comments/:id/like` - Unlike comment (protected)

### Notifications
- `GET /api/notifications` - Get notifications (protected)
- `GET /api/notifications/unread-count` - Get unread count (protected)
- `PUT /api/notifications/:id/read` - Mark as read (protected)
- `PUT /api/notifications/read-all` - Mark all as read (protected)
- `DELETE /api/notifications/:id` - Delete notification (protected)

### Messages
- `POST /api/messages` - Send message (protected)
- `GET /api/messages/conversations` - Get all conversations (protected)
- `GET /api/messages/conversation/:userId` - Get conversation with user (protected)
- `GET /api/messages/unread-count` - Get unread message count (protected)
- `DELETE /api/messages/:id` - Delete message (protected)

### Search
- `GET /api/search/users?q=query` - Search users

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // For validation errors
}
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevents brute force attacks on auth routes
- **Input Validation**: express-validator on all inputs
- **Helmet**: Security headers
- **CORS**: Configured for specific client origin
- **File Upload Limits**: Max 5MB for images

## Database Models

- **User**: Authentication and profile data
- **Tweet**: Posts with text and optional images
- **Comment**: Replies to tweets
- **Follow**: Follower/following relationships
- **Notification**: User notifications (likes, comments, follows)
- **Message**: Direct messages between users

## Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","username":"testuser","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get current user (replace YOUR_TOKEN)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

See `API_EXAMPLES.md` for more detailed examples.

## Project Structure

```
server/
├── config/          # Database and Cloudinary config
├── controllers/     # Request handlers
├── middleware/      # Auth, validation, error handling
├── models/          # Mongoose schemas
├── routes/          # API routes
├── scripts/         # Utility scripts (seed data)
├── utils/           # Helper functions
├── uploads/         # Local file storage (gitignored)
├── .env.example     # Environment variables template
├── server.js        # Entry point
└── package.json     # Dependencies
```

## Troubleshooting

**MongoDB connection failed**
- Ensure MongoDB is running
- Check MONGO_URI in `.env`
- For Atlas, ensure IP is whitelisted

**Image upload errors**
- If using Cloudinary, verify credentials
- If using local storage, ensure `uploads/` directory exists
- Check file size (max 5MB)

**JWT errors**
- Ensure JWT_SECRET is set in `.env`
- Check token format: `Bearer <token>`

## License

MIT
