import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likesMap, setLikesMap] = useState({}); // tweetId -> array of users

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

  // After notifications are loaded, fetch likers for like notifications
  useEffect(() => {
    const fetchLikersForLikes = async () => {
      const likeNotifications = notifications.filter(n => n.type === 'like' && n.tweet);
      const toId = (val) => {
        if (!val) return null;
        if (typeof val === 'string') return val;
        return val._id || null;
      };
      const uniqueTweetIds = [...new Set(likeNotifications.map(n => toId(n.tweet)).filter(Boolean))];
      const map = {};

      await Promise.all(uniqueTweetIds.map(async (tweetId) => {
        try {
          const res = await api.get(`/api/tweets/${tweetId}/likes`);
          map[tweetId] = res.data.data.likers || [];
        } catch (err) {
          map[tweetId] = [];
        }
      }));

      setLikesMap(map);
    };

    if (notifications.length > 0) {
      fetchLikersForLikes();
    }
  }, [notifications]);

  const markAllAsRead = async () => {
    try {
      await api.put('/api/notifications/read-all');
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };
  const navigate = useNavigate();

  const renderActionText = (notification, tweetId) => {
    // If notification refers to a post but the post is missing, show deleted message
    const refersToPost = ['like', 'comment', 'retweet'].includes(notification.type);
    if (refersToPost && !tweetId) return 'post has been deleted';

    switch (notification.type) {
      case 'like':
        return 'has liked your post';
      case 'comment':
        return 'commented on your post';
      case 'follow':
        return 'started following you';
      case 'retweet':
        return 'reposted your post';
      default:
        return (notification.message || '').replace(/\btweet\b/ig, 'post');
    }
  };

  const getActionIcon = (type) => {
    switch (type) {
      case 'like': return '♥️';
      case 'comment': return '🗯️';
      case 'follow': return '👤';
      case 'retweet': return '🔁';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-brand1">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-4">
          <Sidebar />

          <main className="flex-1 max-w-2xl">
            <div className="bg-brand2 rounded-lg shadow-lg">
              <div className="border-b border-brand2 p-4">
                <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand1 mx-auto"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No notifications yet
                </div>
              ) : (
                <div>
                  {notifications.map(notification => {
                    const getId = (val) => {
                      if (!val) return null;
                      return typeof val === 'string' ? val : (val._id || null);
                    };
                    const tweetId = getId(notification.tweet);
                    const commentId = getId(notification.comment);
                    const clickable = !!tweetId;
                    return (
                      <div
                        key={notification._id}
                        onClick={() => {
                          // If there's a valid tweetId navigate to it; otherwise, show deleted page
                          if (tweetId) {
                            const base = `/tweet/${tweetId}`;
                            const url = commentId ? `${base}?comment=${commentId}` : base;
                            navigate(url);
                          } else if (['like', 'comment', 'retweet'].includes(notification.type)) {
                            navigate('/post-deleted', { state: { notification } });
                          }
                        }}
                        className={`p-4 border-b border-gray-200 hover:bg-gray-100 transition-colors ${!notification.read ? 'bg-gray-50' : ''} ${clickable || ['like','comment','retweet'].includes(notification.type) ? 'cursor-pointer' : ''}`}
                      >
                        <div className="flex gap-3">
                          <Link to={`/profile/${notification.sender.username}`} onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                            <img
                              src={notification.sender.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(notification.sender.name)}&background=ddd&color=333`}
                              alt={notification.sender.name}
                              className="w-12 h-12 rounded-full object-cover"
                              onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(notification.sender.name)}&background=ddd&color=333`; }}
                            />
                          </Link>
                          <div className="flex-1">
                            <Link
                              to={`/profile/${notification.sender.username}`}
                              onClick={(e) => e.stopPropagation()}
                              className="font-semibold text-gray-900 hover:text-brand1 transition-colors"
                            >
                              {notification.sender.name}
                            </Link>
                            <p className="text-gray-700 flex items-center gap-2">
                              <span className="text-lg">{getActionIcon(notification.type)}</span>
                              <span>{renderActionText(notification, tweetId)}</span>
                            </p>
                             
                            <p className="text-gray-500 text-sm mt-1">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
