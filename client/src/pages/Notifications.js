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
    <div className="min-h-screen bg-spotify-black">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-4">
          <Sidebar />

          <main className="flex-1 max-w-2xl">
            <div className="bg-spotify-gray rounded-lg shadow-lg">
              <div className="border-b border-spotify-border p-4">
                <h2 className="text-2xl font-bold text-spotify-text">Notifications</h2>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-spotify-green mx-auto"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-spotify-text-subdued">
                  No notifications yet
                </div>
              ) : (
                <div>
                  {notifications.map(notification => (
                    <div
                      key={notification._id}
                      className={`p-4 border-b border-spotify-border hover:bg-spotify-light-gray transition-colors ${
                        !notification.read ? 'bg-spotify-dark' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1">
                          <Link
                            to={`/profile/${notification.sender.username}`}
                            className="font-semibold text-spotify-text hover:text-spotify-green transition-colors"
                          >
                            {notification.sender.name}
                          </Link>
                          <p className="text-spotify-text-gray">{notification.message}</p>
                          <p className="text-spotify-text-subdued text-sm mt-1">
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
