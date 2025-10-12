import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import FollowButton from './FollowButton';
import api from '../../api/axios';
import { FaCalendar, FaMapMarkerAlt, FaLink } from 'react-icons/fa';
import { format } from 'date-fns';
import { getImageUrl } from '../../utils/imageUtils';

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
          src={getImageUrl(user.coverPhoto)}
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
              src={getImageUrl(user.profilePicture)}
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
