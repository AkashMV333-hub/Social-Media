import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import FollowButton from './FollowButton';
import api from '../../api/axios';
import { FaCalendar, FaMapMarkerAlt, FaLink } from 'react-icons/fa';
import { format } from 'date-fns';
import { getImageUrl } from '../../utils/imageUtils';

// Aside content will be handled by parent Profile page
const ProfileHeader = ({ user, onUpdate, onShowAside }) => {
  const { user: currentUser, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  // parent handler to show aside content in profile page
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
    <div className="bg-spotify-gray">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-brand2 to-brand1 relative">
        {user.coverPhoto && user.coverPhoto !== 'https://via.placeholder.com/600x200' && (
          <img
            src={getImageUrl(user.coverPhoto, 'cover')}
            alt="Cover"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        {isOwnProfile && (
          <label className="absolute bottom-2 right-2 bg-brand2 hover:bg-brand1 hover:text-brand2 text-brand1 rounded-full px-4 py-2 cursor-pointer transition-all duration-200">
            <span className="text-sm font-semibold">Change Cover</span>
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
      <div className="px-4 pb-4 bg-brand1">
        <div className="flex justify-between items-start -mt-16">
          <div className="relative">
            <img
              src={getImageUrl(user.profilePicture)}
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-spotify-gray object-cover bg-spotify-light-gray"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=1DB954&color=fff&size=200';
              }}
            />
            {isOwnProfile && (
              <label className="absolute bottom-0 right-0 bg-spotify-green text-spotify-gray rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200">
                <span className="text-lg font-bold">+</span>
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
                className="border border-brand2 text-brand2 px-6 py-2 rounded-full font-semibold hover:border-white hover:text-white transition-all duration-200"
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
              className="w-full bg-spotify-light-gray border border-spotify-border text-spotify-text px-4 py-2 rounded-md focus:outline-none focus:border-spotify-green transition-colors duration-200"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
            <textarea
              name="bio"
              className="w-full bg-spotify-light-gray border border-spotify-border text-spotify-text px-4 py-2 rounded-md focus:outline-none focus:border-spotify-green transition-colors duration-200 resize-none"
              placeholder="Bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
            />
            <input
              name="location"
              className="w-full bg-spotify-light-gray border border-spotify-border text-spotify-text px-4 py-2 rounded-md focus:outline-none focus:border-spotify-green transition-colors duration-200"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
            />
            <input
              name="website"
              className="w-full bg-spotify-light-gray border border-spotify-border text-spotify-text px-4 py-2 rounded-md focus:outline-none focus:border-spotify-green transition-colors duration-200"
              placeholder="Website"
              value={formData.website}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="bg-spotify-green text-spotify-gray px-6 py-2 rounded-full font-semibold hover:scale-105 transition-transform duration-200"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <>
            <h2 className="text-2xl font-bold mt-4 text-spotify-text">{user.name}</h2>
            <p className="text-spotify-text-gray">@{user.username}</p>

            {user.bio && <p className="mt-3 text-spotify-text">{user.bio}</p>}

            <div className="flex flex-wrap gap-4 mt-3 text-spotify-text-gray text-sm">
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
                    className="text-spotify-green hover:underline transition-all duration-200"
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
              <div
                onClick={() => onShowAside && onShowAside({ type: 'following', username: user.username })}
                className="cursor-pointer hover:underline transition-all duration-200"
              >
                <span className="font-bold text-spotify-text">{user.followingCount}</span>{' '}
                <span className="text-spotify-text-gray">Following</span>
              </div>
              <div
                onClick={() => onShowAside && onShowAside({ type: 'followers', username: user.username })}
                className="cursor-pointer hover:underline transition-all duration-200"
              >
                <span className="font-bold text-spotify-text">{user.followersCount}</span>{' '}
                <span className="text-spotify-text-gray">Followers</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Followers/Following are shown in profile aside via parent handler */}
    </div>
  );
};

export default ProfileHeader;
