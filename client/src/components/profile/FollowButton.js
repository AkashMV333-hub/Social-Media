import { useState, useEffect } from 'react';
import api from '../../api/axios';

const FollowButton = ({ userId }) => {
  const [following, setFollowing] = useState(false);
  const [isFollowedBy, setIsFollowedBy] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFollowStatus();
  }, [userId]);

  const checkFollowStatus = async () => {
    try {
      const response = await api.get(`/api/follow/${userId}/follow/status`);
      setFollowing(response.data.data.isFollowing);
      setIsFollowedBy(response.data.data.isFollowedBy);
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
    // Re-fetch the complete follow status to update isFollowedBy
    await checkFollowStatus();
  } catch (error) {
    console.error('Error toggling follow:', error);
  } finally {
    setLoading(false);
  }
};

  const getButtonText = () => {
    if (loading) return '...';
    if (following) return 'Unfollow';
    if (isFollowedBy) return 'Follow Back';
    return 'Follow';
  };

  const getButtonClass = () => {
    const baseClass = 'px-6 py-2 rounded-full font-semibold transition-all duration-200 ';
    
    if (following) {
      return baseClass + 'border border-spotify-border text-spotify-text hover:border-red-500 hover:text-red-500';
    }
    
    return baseClass + 'bg-spotify-green text-spotify-gray hover:scale-105';
  };

  return (
    <button
      onClick={handleToggleFollow}
      disabled={loading}
      className={getButtonClass()}
    >
      {getButtonText()}
    </button>
  );
};

export default FollowButton;