# Complete Frontend Code Reference

This document contains all remaining frontend code. Copy these files to complete the application.

## Pages

### src/pages/Login.js
```jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTwitter } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <FaTwitter className="mx-auto h-12 w-auto text-primary" size={48} />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Log in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/register" className="font-medium text-primary hover:text-blue-500">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
```

### src/pages/Register.js
```jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTwitter } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/');
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(
      formData.name,
      formData.email,
      formData.username,
      formData.password
    );

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <FaTwitter className="mx-auto h-12 w-auto text-primary" size={48} />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          <div className="space-y-4">
            <input
              name="name"
              type="text"
              required
              className="input-field"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              required
              className="input-field"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="username"
              type="text"
              required
              className="input-field"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              required
              className="input-field"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>

          <div className="text-center">
            <Link to="/login" className="font-medium text-primary hover:text-blue-500">
              Already have an account? Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
```

### src/pages/Home.js
```jsx
import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import TweetComposer from '../components/tweet/TweetComposer';
import TweetCard from '../components/tweet/TweetCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' or 'latest'

  useEffect(() => {
    fetchTweets();
  }, [activeTab]);

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === 'feed' ? '/api/tweets/feed' : '/api/tweets/latest';
      const response = await api.get(endpoint);
      setTweets(response.data.data.tweets);
    } catch (error) {
      console.error('Error fetching tweets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTweetCreated = (newTweet) => {
    setTweets([newTweet, ...tweets]);
  };

  const handleTweetDeleted = (tweetId) => {
    setTweets(tweets.filter(tweet => tweet._id !== tweetId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-4">
          <Sidebar />

          <main className="flex-1 max-w-2xl">
            <div className="bg-white rounded-lg shadow">
              <div className="border-b">
                <div className="flex">
                  <button
                    className={`flex-1 py-4 font-semibold ${
                      activeTab === 'feed'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-600'
                    }`}
                    onClick={() => setActiveTab('feed')}
                  >
                    Home Feed
                  </button>
                  <button
                    className={`flex-1 py-4 font-semibold ${
                      activeTab === 'latest'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-600'
                    }`}
                    onClick={() => setActiveTab('latest')}
                  >
                    Latest
                  </button>
                </div>
              </div>

              <TweetComposer onTweetCreated={handleTweetCreated} />

              {loading ? (
                <LoadingSpinner />
              ) : tweets.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  {activeTab === 'feed'
                    ? 'Follow users to see their tweets here'
                    : 'No tweets yet'}
                </div>
              ) : (
                tweets.map(tweet => (
                  <TweetCard
                    key={tweet._id}
                    tweet={tweet}
                    onDelete={handleTweetDeleted}
                  />
                ))
              )}
            </div>
          </main>

          <aside className="hidden lg:block w-80">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold text-lg mb-2">Trending</h3>
              <p className="text-gray-500 text-sm">Coming soon...</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;
```

### src/pages/Profile.js
```jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import ProfileHeader from '../components/profile/ProfileHeader';
import TweetCard from '../components/tweet/TweetCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tweets');

  useEffect(() => {
    fetchUserProfile();
    fetchUserTweets();
  }, [username]);

  useEffect(() => {
    if (user) {
      fetchUserTweets();
    }
  }, [activeTab]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get(`/api/users/${username}`);
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserTweets = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/users/${username}/tweets?tab=${activeTab}`);
      setTweets(response.data.data.tweets);
    } catch (error) {
      console.error('Error fetching tweets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-4">
          <Sidebar />

          <main className="flex-1 max-w-2xl">
            <div className="bg-white rounded-lg shadow">
              <ProfileHeader user={user} onUpdate={fetchUserProfile} />

              <div className="border-b">
                <div className="flex">
                  <button
                    className={`flex-1 py-4 font-semibold ${
                      activeTab === 'tweets'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-600'
                    }`}
                    onClick={() => setActiveTab('tweets')}
                  >
                    Tweets
                  </button>
                  <button
                    className={`flex-1 py-4 font-semibold ${
                      activeTab === 'media'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-600'
                    }`}
                    onClick={() => setActiveTab('media')}
                  >
                    Media
                  </button>
                </div>
              </div>

              {loading ? (
                <LoadingSpinner />
              ) : tweets.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No tweets yet
                </div>
              ) : (
                tweets.map(tweet => (
                  <TweetCard key={tweet._id} tweet={tweet} />
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
```

### src/pages/Explore.js
```jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { FaSearch } from 'react-icons/fa';

const Explore = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      const response = await api.get(`/api/search/users?q=${query}`);
      setUsers(response.data.data.users);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-4">
          <Sidebar />

          <main className="flex-1 max-w-2xl">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-2xl font-bold mb-4">Explore</h2>

              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    className="input-field pl-10"
                    placeholder="Search users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </form>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : users.length > 0 ? (
                <div className="space-y-4">
                  {users.map(user => (
                    <Link
                      key={user._id}
                      to={`/profile/${user.username}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition"
                    >
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-gray-600 text-sm">@{user.username}</p>
                        {user.bio && (
                          <p className="text-gray-700 text-sm mt-1">{user.bio}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : query ? (
                <p className="text-center text-gray-500 py-8">No users found</p>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Search for users by name or username
                </p>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Explore;
```

### src/pages/Notifications.js
```jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/api/notifications');
      setNotifications(response.data.data.notifications);
      markAllAsRead();
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/api/notifications/read-all');
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'follow': return '👤';
      case 'retweet': return '🔁';
      default: return '🔔';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-4">
          <Sidebar />

          <main className="flex-1 max-w-2xl">
            <div className="bg-white rounded-lg shadow">
              <div className="border-b p-4">
                <h2 className="text-2xl font-bold">Notifications</h2>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No notifications yet
                </div>
              ) : (
                <div>
                  {notifications.map(notification => (
                    <div
                      key={notification._id}
                      className={`p-4 border-b hover:bg-gray-50 ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1">
                          <Link
                            to={`/profile/${notification.sender.username}`}
                            className="font-semibold hover:underline"
                          >
                            {notification.sender.name}
                          </Link>
                          <p className="text-gray-700">{notification.message}</p>
                          <p className="text-gray-500 text-sm mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
```

### src/pages/Messages.js
```jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const Messages = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchConversation(userId);
    }
  }, [userId]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/api/messages/conversations');
      setConversations(response.data.data.conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (userId) => {
    try {
      const response = await api.get(`/api/messages/conversation/${userId}`);
      setMessages(response.data.data.messages);
      setSelectedUser(response.data.data.conversation.user);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    try {
      const response = await api.post('/api/messages', {
        recipientId: userId,
        text: newMessage,
      });

      setMessages([...messages, response.data.data.message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-4">
          <Sidebar />

          <main className="flex-1 max-w-4xl">
            <div className="bg-white rounded-lg shadow h-[600px] flex">
              {/* Conversations list */}
              <div className="w-1/3 border-r">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-bold">Messages</h2>
                </div>
                <div className="overflow-y-auto" style={{ height: 'calc(600px - 60px)' }}>
                  {conversations.map(conv => (
                    <Link
                      key={conv.conversationId}
                      to={`/messages/${conv.otherUser._id}`}
                      className={`block p-4 border-b hover:bg-gray-50 ${
                        userId === conv.otherUser._id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <img
                          src={conv.otherUser.profilePicture}
                          alt={conv.otherUser.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{conv.otherUser.name}</p>
                          <p className="text-sm text-gray-600 truncate">
                            {conv.lastMessage.text}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Chat panel */}
              <div className="flex-1 flex flex-col">
                {selectedUser ? (
                  <>
                    <div className="p-4 border-b">
                      <Link
                        to={`/profile/${selectedUser.username}`}
                        className="flex items-center gap-3 hover:underline"
                      >
                        <img
                          src={selectedUser.profilePicture}
                          alt={selectedUser.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-semibold">{selectedUser.name}</p>
                          <p className="text-sm text-gray-600">@{selectedUser.username}</p>
                        </div>
                      </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map(message => (
                        <div
                          key={message._id}
                          className={`flex ${
                            message.sender._id === currentUser._id
                              ? 'justify-end'
                              : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              message.sender._id === currentUser._id
                                ? 'bg-primary text-white'
                                : 'bg-gray-200'
                            }`}
                          >
                            <p>{message.text}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.sender._id === currentUser._id
                                  ? 'text-blue-100'
                                  : 'text-gray-500'
                              }`}
                            >
                              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="input-field flex-1"
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button type="submit" className="btn-primary">
                          Send
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Select a conversation to start messaging
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Messages;
```

## Components

### src/components/layout/Navbar.js
```jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaTwitter, FaBell, FaEnvelope } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <FaTwitter className="text-primary" size={32} />
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/notifications" className="text-gray-700 hover:text-primary">
              <FaBell size={20} />
            </Link>
            <Link to="/messages" className="text-gray-700 hover:text-primary">
              <FaEnvelope size={20} />
            </Link>
            <Link to={`/profile/${user?.username}`} className="flex items-center gap-2">
              <img
                src={user?.profilePicture}
                alt={user?.name}
                className="w-8 h-8 rounded-full"
              />
            </Link>
            <button
              onClick={logout}
              className="text-gray-700 hover:text-red-600 font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

### src/components/layout/Sidebar.js
```jsx
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCompass, FaBell, FaEnvelope, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/explore', icon: FaCompass, label: 'Explore' },
    { path: '/notifications', icon: FaBell, label: 'Notifications' },
    { path: '/messages', icon: FaEnvelope, label: 'Messages' },
    { path: `/profile/${user?.username}`, icon: FaUser, label: 'Profile' },
  ];

  return (
    <aside className="w-64 sticky top-20 h-fit hidden md:block">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-full transition ${
              isActive(item.path)
                ? 'bg-blue-50 text-primary font-bold'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <item.icon size={24} />
            <span className="text-xl">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
```

### src/components/tweet/TweetComposer.js
```jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { FaImage, FaTimes } from 'react-icons/fa';

const TweetComposer = ({ onTweetCreated }) => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('text', text);
      if (image) {
        formData.append('image', image);
      }

      const response = await api.post('/api/tweets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onTweetCreated(response.data.data.tweet);
      setText('');
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error creating tweet:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <img
            src={user?.profilePicture}
            alt={user?.name}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <textarea
              className="w-full border-none focus:outline-none resize-none text-lg"
              placeholder="What's happening?"
              rows="3"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={280}
            />

            {imagePreview && (
              <div className="relative mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="rounded-lg max-h-64 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-75 text-white rounded-full p-2 hover:bg-opacity-100"
                >
                  <FaTimes />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              <label className="cursor-pointer text-primary hover:text-blue-600">
                <FaImage size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{text.length}/280</span>
                <button
                  type="submit"
                  disabled={loading || (!text.trim() && !image)}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? 'Posting...' : 'Tweet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TweetComposer;
```

### src/components/tweet/TweetCard.js
```jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { FaHeart, FaRegHeart, FaComment, FaTrash } from 'react-icons/fa';
import CommentList from './CommentList';

const TweetCard = ({ tweet, onDelete }) => {
  const { user: currentUser } = useAuth();
  const [liked, setLiked] = useState(tweet.isLiked);
  const [likesCount, setLikesCount] = useState(tweet.likesCount);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(tweet.commentsCount);

  const handleLike = async () => {
    try {
      if (liked) {
        await api.delete(`/api/tweets/${tweet._id}/like`);
        setLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        await api.post(`/api/tweets/${tweet._id}/like`);
        setLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this tweet?')) return;

    try {
      await api.delete(`/api/tweets/${tweet._id}`);
      if (onDelete) {
        onDelete(tweet._id);
      }
    } catch (error) {
      console.error('Error deleting tweet:', error);
    }
  };

  return (
    <div className="border-b p-4 hover:bg-gray-50 transition tweet-card">
      <div className="flex gap-3">
        <Link to={`/profile/${tweet.author.username}`}>
          <img
            src={tweet.author.profilePicture}
            alt={tweet.author.name}
            className="w-12 h-12 rounded-full"
          />
        </Link>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <Link
                to={`/profile/${tweet.author.username}`}
                className="font-bold hover:underline"
              >
                {tweet.author.name}
              </Link>
              <span className="text-gray-600 ml-2">
                @{tweet.author.username} ·{' '}
                {formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true })}
              </span>
            </div>

            {currentUser?._id === tweet.author._id && (
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-600"
              >
                <FaTrash />
              </button>
            )}
          </div>

          <p className="mt-2 text-gray-900">{tweet.text}</p>

          {tweet.image && (
            <img
              src={tweet.image}
              alt="Tweet"
              className="mt-3 rounded-lg max-h-96 w-full object-cover"
            />
          )}

          <div className="flex items-center gap-6 mt-3 text-gray-600">
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 hover:text-primary"
            >
              <FaComment />
              <span>{commentsCount}</span>
            </button>

            <button
              onClick={handleLike}
              className={`flex items-center gap-2 ${
                liked ? 'text-red-500' : 'hover:text-red-500'
              }`}
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
              <span>{likesCount}</span>
            </button>
          </div>

          {showComments && (
            <CommentList
              tweetId={tweet._id}
              onCommentAdded={() => setCommentsCount(prev => prev + 1)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
```

### src/components/tweet/CommentList.js
```jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const CommentList = ({ tweetId, onCommentAdded }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [tweetId]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/api/tweets/${tweetId}/comments`);
      setComments(response.data.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const response = await api.post(`/api/tweets/${tweetId}/comment`, {
        text: newComment,
      });

      setComments([response.data.data.comment, ...comments]);
      setNewComment('');
      onCommentAdded();
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <img
            src={user?.profilePicture}
            alt={user?.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1">
            <input
              type="text"
              className="input-field"
              placeholder="Tweet your reply"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={280}
            />
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="btn-primary mt-2 disabled:opacity-50"
            >
              {loading ? 'Replying...' : 'Reply'}
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-3">
        {comments.map(comment => (
          <div key={comment._id} className="flex gap-2">
            <Link to={`/profile/${comment.author.username}`}>
              <img
                src={comment.author.profilePicture}
                alt={comment.author.name}
                className="w-8 h-8 rounded-full"
              />
            </Link>
            <div className="flex-1 bg-gray-100 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Link
                  to={`/profile/${comment.author.username}`}
                  className="font-semibold text-sm hover:underline"
                >
                  {comment.author.name}
                </Link>
                <span className="text-xs text-gray-600">
                  @{comment.author.username} ·{' '}
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm mt-1">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;
```

### src/components/profile/ProfileHeader.js
```jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import FollowButton from './FollowButton';
import api from '../../api/axios';
import { FaCalendar, FaMapMarkerAlt, FaLink } from 'react-icons/fa';
import { format } from 'date-fns';

const ProfileHeader = ({ user, onUpdate }) => {
  const { user: currentUser, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio,
    location: user.location,
    website: user.website,
  });

  const isOwnProfile = currentUser?._id === user._id;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/api/users/profile', formData);
      updateUser(response.data.data.user);
      setEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);

      const endpoint = type === 'profile' ? '/api/users/profile-picture' : '/api/users/cover-photo';
      const response = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onUpdate();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 relative">
        <img
          src={user.coverPhoto}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        {isOwnProfile && (
          <label className="absolute bottom-2 right-2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 cursor-pointer">
            <span className="text-sm">Change Cover</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'cover')}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-start -mt-16">
          <div className="relative">
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-white"
            />
            {isOwnProfile && (
              <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer">
                <span className="text-xs">+</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'profile')}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="mt-16">
            {isOwnProfile ? (
              <button
                onClick={() => setEditing(!editing)}
                className="btn-outline"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            ) : (
              <FollowButton userId={user._id} />
            )}
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <input
              name="name"
              className="input-field"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
            <textarea
              name="bio"
              className="textarea-field"
              placeholder="Bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
            />
            <input
              name="location"
              className="input-field"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
            />
            <input
              name="website"
              className="input-field"
              placeholder="Website"
              value={formData.website}
              onChange={handleChange}
            />
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </form>
        ) : (
          <>
            <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
            <p className="text-gray-600">@{user.username}</p>

            {user.bio && <p className="mt-3">{user.bio}</p>}

            <div className="flex flex-wrap gap-4 mt-3 text-gray-600 text-sm">
              {user.location && (
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className="flex items-center gap-1">
                  <FaLink />
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {user.website}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1">
                <FaCalendar />
                <span>Joined {format(new Date(user.createdAt), 'MMMM yyyy')}</span>
              </div>
            </div>

            <div className="flex gap-6 mt-3">
              <div>
                <span className="font-bold">{user.followingCount}</span>{' '}
                <span className="text-gray-600">Following</span>
              </div>
              <div>
                <span className="font-bold">{user.followersCount}</span>{' '}
                <span className="text-gray-600">Followers</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
```

### src/components/profile/FollowButton.js
```jsx
import { useState, useEffect } from 'react';
import api from '../../api/axios';

const FollowButton = ({ userId }) => {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFollowStatus();
  }, [userId]);

  const checkFollowStatus = async () => {
    try {
      const response = await api.get(`/api/follow/${userId}/follow/status`);
      setFollowing(response.data.data.isFollowing);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleToggleFollow = async () => {
    try {
      setLoading(true);
      if (following) {
        await api.delete(`/api/follow/${userId}/follow`);
        setFollowing(false);
      } else {
        await api.post(`/api/follow/${userId}/follow`);
        setFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFollow}
      disabled={loading}
      className={following ? 'btn-outline' : 'btn-primary'}
    >
      {loading ? '...' : following ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
```

### src/components/common/LoadingSpinner.js
```jsx
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

export default LoadingSpinner;
```

### src/components/common/ErrorMessage.js
```jsx
const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
```

## Frontend README

### client/README.md
```markdown
# Twitter Clone - Frontend

React frontend for the Twitter-like social media application.

## Features

- User authentication (login/register)
- Create tweets with text and images
- Like and comment on tweets
- Follow/unfollow users
- User profiles with customizable bio and photos
- Search users
- Direct messaging
- Notifications
- Responsive design with Tailwind CSS

## Tech Stack

- React 18
- React Router v6
- Axios
- Tailwind CSS
- Vite
- date-fns

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your backend URL:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

   App will run on `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── api/                 # Axios configuration
├── components/          # Reusable components
│   ├── layout/         # Navbar, Sidebar
│   ├── tweet/          # Tweet-related components
│   ├── profile/        # Profile components
│   └── common/         # Shared components
├── context/            # React Context (Auth)
├── pages/              # Page components
├── App.js              # Main app with routes
├── index.js            # Entry point
└── index.css           # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:5000)

## Security Notes

Currently using localStorage for JWT token storage. For production:

1. Consider using httpOnly cookies
2. Implement refresh token mechanism
3. Add CSRF protection
4. Enable HTTPS in production

## License

MIT
```

---

## Copy all these files to complete your frontend!

Make sure to create the directory structure as shown and copy each component/page to its respective location.
