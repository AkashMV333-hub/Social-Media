import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import MentionInput from '../mention/MentionInput';
import api from '../../api/axios';
import { FaImage, FaTimes } from 'react-icons/fa';
import { getImageUrl } from '../../utils/imageUtils';

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
    if (!text.trim() && !image) {
      alert('Please add text or an image to your post');
      return;
    }

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
    <div className="border-b border-gray-200 p-6 bg-brand2 backdrop-blur-xl">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">

          {/* User Avatar */}
          <img
            src={getImageUrl(user?.profilePicture)}
            alt={user?.name}
            className="w-14 h-14 rounded-full object-cover ring-1 ring-brand1"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://ui-avatars.com/api/?name=' +
                encodeURIComponent(user?.name) +
                '&background=6366f1&color=fff&size=150';
            }}
          />

          <div className="flex-1">

            {/* Text Area - Replaced with MentionInput */}
            <MentionInput
              value={text}
              onChange={setText}
              placeholder="What's on your mind?"
              className="bg-brand2 border border-brand1 focus:border-brand1 focus:ring-2 focus:ring-brand1 rounded-xl p-4 focus:outline-none resize-none text-base text-gray-700 placeholder-gray-600 transition-all duration-200"
              maxLength={280}
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative mt-4 group">
                <div className="rounded-2xl overflow-hidden border border-gray-300 shadow-md">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-80 w-full object-cover"
                  />
                </div>

                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 bg-white/90 border border-gray-300 backdrop-blur-md text-gray-700 rounded-full p-3 hover:bg-red-500 hover:text-white hover:scale-110 transition-all duration-200 shadow-md"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Bottom Controls */}
            <div className="flex items-center justify-between mt-4">

              {/* Add Image Button */}
              <label className="cursor-pointer text-brand1 hover:text-brand2 hover:bg-brand1 p-3 rounded-xl transition-all duration-200 flex items-center gap-2 group">
                <FaImage className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium hidden sm:inline">Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-4">
                {/* Character Counter */}
                <span
                  className={`text-sm font-medium ${
                    text.length > 250 ? 'text-red-500' : 'text-gray-500'
                  }`}
                >
                  {text.length}/280
                </span>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || (!text.trim() && !image)}
                  className="px-5 py-2 bg-brand1 text-brand2 font-semibold rounded-xl hover:bg-brand2 hover:text-brand1 transition-all"
                >
                  {loading ? 'Posting...' : 'Post'}
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