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
      className={
        following
          ? 'border border-spotify-border text-spotify-text px-6 py-2 rounded-full font-semibold hover:border-red-500 hover:text-red-500 transition-all duration-200'
          : 'bg-spotify-green text-spotify-gray px-6 py-2 rounded-full font-semibold hover:scale-105 transition-transform duration-200'
      }
    >
      {loading ? '...' : following ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
