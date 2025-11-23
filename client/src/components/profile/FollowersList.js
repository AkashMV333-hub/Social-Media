import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import LoadingSpinner from '../common/LoadingSpinner';

const FollowersList = ({ username, type = 'followers', onUserClick }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const endpoint = type === 'followers'
          ? `/api/users/${username}/followers`
          : `/api/users/${username}/following`;

        const response = await axios.get(endpoint);

        if (response.data.success) {
          setUsers(response.data.data[type] || []);
        }
      } catch (err) {
        console.error(`Error fetching ${type}:`, err);
        setError(err.response?.data?.message || `Failed to load ${type}`);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUsers();
    }
  }, [username, type]);

  const handleUserClick = (userUsername) => {
    if (onUserClick) onUserClick(userUsername);
    navigate(`/profile/${userUsername}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-brand1">
          {type === 'followers'
            ? 'No followers yet'
            : 'Not following anyone yet'}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y bg-brand1 divide-spotify-gray">
      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => handleUserClick(user.username)}
          className="p-4 hover:bg-spotify-gray cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-spotify-green flex items-center justify-center">
                  <span className="text-spotify-dark text-xl font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h3 className="font-bold text-spotify-text truncate">
                  {user.name}
                </h3>
              </div>
              <p className="text-spotify-text-gray text-sm">@{user.username}</p>
              {user.bio && (
                <p className="text-spotify-text text-sm mt-1 line-clamp-2">
                  {user.bio}
                </p>
              )}
            </div>

            {/* Arrow Icon */}
            <div className="flex-shrink-0 text-spotify-text-gray">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowersList;