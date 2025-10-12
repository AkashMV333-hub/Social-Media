# API Examples and Testing Guide

Complete collection of curl commands and examples for testing the Twitter Clone API.

## Base URL
```
http://localhost:5000/api
```

## Table of Contents
1. [Authentication](#authentication)
2. [Tweets](#tweets)
3. [Users](#users)
4. [Follow System](#follow-system)
5. [Comments](#comments)
6. [Notifications](#notifications)
7. [Messages](#messages)
8. [Search](#search)

---

## Authentication

### Register New User

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "username": "johndoe",
      "profilePicture": "https://via.placeholder.com/150",
      "bio": "",
      "followersCount": 0,
      "followingCount": 0,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save the token for subsequent requests!**

### Get Current User

**Request:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "username": "johndoe",
      ...
    }
  }
}
```

---

## Tweets

### Create Tweet (Text Only)

**Request:**
```bash
curl -X POST http://localhost:5000/api/tweets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello Twitter Clone! This is my first tweet."
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Tweet created successfully",
  "data": {
    "tweet": {
      "_id": "507f1f77bcf86cd799439012",
      "author": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "username": "johndoe",
        "profilePicture": "..."
      },
      "text": "Hello Twitter Clone! This is my first tweet.",
      "image": null,
      "likes": [],
      "likesCount": 0,
      "commentsCount": 0,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Create Tweet with Image

**Request:**
```bash
curl -X POST http://localhost:5000/api/tweets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "text=Check out this awesome picture!" \
  -F "image=@/path/to/your/image.jpg"
```

### Get Home Feed (Following Users)

**Request:**
```bash
curl -X GET "http://localhost:5000/api/tweets/feed?limit=20&skip=0" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tweets": [
      {
        "_id": "...",
        "author": {...},
        "text": "...",
        "isLiked": false,
        "likesCount": 5,
        "createdAt": "..."
      }
    ],
    "pagination": {
      "total": 100,
      "limit": 20,
      "skip": 0,
      "hasMore": true
    }
  }
}
```

### Get Latest Tweets (Global)

**Request:**
```bash
curl -X GET "http://localhost:5000/api/tweets/latest?limit=20&skip=0"
```

### Get Tweet by ID

**Request:**
```bash
curl -X GET http://localhost:5000/api/tweets/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Like Tweet

**Request:**
```bash
curl -X POST http://localhost:5000/api/tweets/507f1f77bcf86cd799439012/like \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "message": "Tweet liked successfully",
  "data": {
    "likesCount": 6
  }
}
```

### Unlike Tweet

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/tweets/507f1f77bcf86cd799439012/like \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Delete Tweet

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/tweets/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "message": "Tweet deleted successfully"
}
```

---

## Users

### Get User Profile

**Request:**
```bash
curl -X GET http://localhost:5000/api/users/johndoe
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "username": "johndoe",
      "profilePicture": "...",
      "coverPhoto": "...",
      "bio": "Software developer",
      "location": "San Francisco, CA",
      "website": "https://johndoe.com",
      "followersCount": 100,
      "followingCount": 50,
      "tweetsCount": 25,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "isFollowing": false
  }
}
```

### Get User's Tweets

**Request:**
```bash
curl -X GET "http://localhost:5000/api/users/johndoe/tweets?tab=tweets&limit=20&skip=0"
```

**Query Parameters:**
- `tab`: "tweets" (all tweets) or "media" (tweets with images)
- `limit`: Number of tweets to return (default: 20)
- `skip`: Number of tweets to skip (default: 0)

### Update Profile

**Request:**
```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "bio": "Full-stack developer | MERN enthusiast",
    "location": "San Francisco, CA",
    "website": "https://johndoe.com"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {...}
  }
}
```

### Upload Profile Picture

**Request:**
```bash
curl -X POST http://localhost:5000/api/users/profile-picture \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "image=@/path/to/profile.jpg"
```

### Upload Cover Photo

**Request:**
```bash
curl -X POST http://localhost:5000/api/users/cover-photo \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "image=@/path/to/cover.jpg"
```

### Get User's Followers

**Request:**
```bash
curl -X GET "http://localhost:5000/api/users/johndoe/followers?limit=20&skip=0"
```

### Get User's Following

**Request:**
```bash
curl -X GET "http://localhost:5000/api/users/johndoe/following?limit=20&skip=0"
```

---

## Follow System

### Follow User

**Request:**
```bash
curl -X POST http://localhost:5000/api/follow/507f1f77bcf86cd799439011/follow \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "message": "User followed successfully"
}
```

### Unfollow User

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/follow/507f1f77bcf86cd799439011/follow \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Check Follow Status

**Request:**
```bash
curl -X GET http://localhost:5000/api/follow/507f1f77bcf86cd799439011/follow/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isFollowing": true
  }
}
```

---

## Comments

### Create Comment

**Request:**
```bash
curl -X POST http://localhost:5000/api/tweets/507f1f77bcf86cd799439012/comment \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Great tweet! I totally agree."
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "comment": {
      "_id": "507f1f77bcf86cd799439013",
      "tweet": "507f1f77bcf86cd799439012",
      "author": {
        "name": "John Doe",
        "username": "johndoe",
        "profilePicture": "..."
      },
      "text": "Great tweet! I totally agree.",
      "likesCount": 0,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Get Comments on Tweet

**Request:**
```bash
curl -X GET "http://localhost:5000/api/tweets/507f1f77bcf86cd799439012/comments?limit=20&skip=0"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "_id": "...",
        "author": {...},
        "text": "...",
        "likesCount": 2,
        "createdAt": "..."
      }
    ],
    "pagination": {
      "total": 15,
      "limit": 20,
      "skip": 0,
      "hasMore": false
    }
  }
}
```

### Delete Comment

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/comments/507f1f77bcf86cd799439013 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Like Comment

**Request:**
```bash
curl -X POST http://localhost:5000/api/comments/507f1f77bcf86cd799439013/like \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Notifications

### Get Notifications

**Request:**
```bash
curl -X GET "http://localhost:5000/api/notifications?limit=20&skip=0" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "recipient": "507f1f77bcf86cd799439011",
        "sender": {
          "_id": "507f1f77bcf86cd799439015",
          "name": "Jane Smith",
          "username": "janesmith",
          "profilePicture": "..."
        },
        "type": "like",
        "tweet": {
          "_id": "507f1f77bcf86cd799439012",
          "text": "Hello Twitter Clone!"
        },
        "read": false,
        "message": "Jane Smith liked your tweet",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "unreadCount": 5,
    "pagination": {...}
  }
}
```

### Get Unread Notifications Only

**Request:**
```bash
curl -X GET "http://localhost:5000/api/notifications?unreadOnly=true" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Unread Count

**Request:**
```bash
curl -X GET http://localhost:5000/api/notifications/unread-count \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

### Mark Notification as Read

**Request:**
```bash
curl -X PUT http://localhost:5000/api/notifications/507f1f77bcf86cd799439014/read \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Mark All Notifications as Read

**Request:**
```bash
curl -X PUT http://localhost:5000/api/notifications/read-all \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Delete Notification

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/notifications/507f1f77bcf86cd799439014 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Messages

### Send Message

**Request:**
```bash
curl -X POST http://localhost:5000/api/messages \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientId": "507f1f77bcf86cd799439015",
    "text": "Hey! How are you doing?"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "message": {
      "_id": "507f1f77bcf86cd799439016",
      "sender": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "username": "johndoe",
        "profilePicture": "..."
      },
      "recipient": {
        "_id": "507f1f77bcf86cd799439015",
        "name": "Jane Smith",
        "username": "janesmith",
        "profilePicture": "..."
      },
      "text": "Hey! How are you doing?",
      "read": false,
      "conversationId": "507f1f77bcf86cd799439011_507f1f77bcf86cd799439015",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Get All Conversations

**Request:**
```bash
curl -X GET http://localhost:5000/api/messages/conversations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "conversationId": "507f1f77bcf86cd799439011_507f1f77bcf86cd799439015",
        "otherUser": {
          "_id": "507f1f77bcf86cd799439015",
          "name": "Jane Smith",
          "username": "janesmith",
          "profilePicture": "..."
        },
        "lastMessage": {
          "text": "Hey! How are you doing?",
          "createdAt": "2024-01-01T00:00:00.000Z"
        },
        "unreadCount": 2
      }
    ]
  }
}
```

### Get Conversation with User

**Request:**
```bash
curl -X GET "http://localhost:5000/api/messages/conversation/507f1f77bcf86cd799439015?limit=50&skip=0" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "_id": "...",
        "sender": {...},
        "recipient": {...},
        "text": "...",
        "read": true,
        "createdAt": "..."
      }
    ],
    "conversation": {
      "user": {...},
      "conversationId": "..."
    },
    "pagination": {...}
  }
}
```

### Get Unread Message Count

**Request:**
```bash
curl -X GET http://localhost:5000/api/messages/unread-count \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "unreadCount": 3
  }
}
```

### Delete Message

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/messages/507f1f77bcf86cd799439016 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Search

### Search Users

**Request:**
```bash
curl -X GET "http://localhost:5000/api/search/users?q=john&limit=20&skip=0"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "username": "johndoe",
        "profilePicture": "...",
        "bio": "Software developer",
        "followersCount": 100
      },
      {
        "_id": "507f1f77bcf86cd799439017",
        "name": "Johnny Smith",
        "username": "johnnysmith",
        "profilePicture": "...",
        "bio": "Designer",
        "followersCount": 50
      }
    ],
    "pagination": {
      "total": 2,
      "limit": 20,
      "skip": 0,
      "hasMore": false
    }
  }
}
```

---

## Testing Workflow Example

### Complete User Journey

```bash
# 1. Register
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","username":"testuser","password":"password123"}' \
  | jq -r '.data.token')

echo "Token: $TOKEN"

# 2. Create a tweet
TWEET_ID=$(curl -s -X POST http://localhost:5000/api/tweets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"My first tweet!"}' \
  | jq -r '.data.tweet._id')

echo "Tweet ID: $TWEET_ID"

# 3. Like the tweet
curl -X POST http://localhost:5000/api/tweets/$TWEET_ID/like \
  -H "Authorization: Bearer $TOKEN"

# 4. Comment on the tweet
curl -X POST http://localhost:5000/api/tweets/$TWEET_ID/comment \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Great tweet!"}'

# 5. Get latest tweets
curl -X GET "http://localhost:5000/api/tweets/latest?limit=5"

# 6. Search users
curl -X GET "http://localhost:5000/api/search/users?q=test"
```

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created (new resource)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (not authorized for this action)
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting

Authentication endpoints are rate limited:
- **Limit**: 5 requests per 15 minutes
- **Applies to**: `/api/auth/login`, `/api/auth/register`

If rate limit exceeded:
```json
{
  "success": false,
  "message": "Too many authentication attempts, please try again later"
}
```

---

## Tips for Testing

1. **Save the token** after login/register for subsequent requests
2. **Use jq** to parse JSON responses: `curl ... | jq`
3. **Test pagination** by adjusting limit and skip parameters
4. **Check response times** with curl's `-w` flag
5. **Use Postman** for easier testing (import POSTMAN_COLLECTION.json)

---

**Happy Testing!**
