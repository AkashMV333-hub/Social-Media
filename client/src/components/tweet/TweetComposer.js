import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
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
    <div className="border-b border-dark-600 p-6 bg-gradient-card backdrop-blur-xl">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <img
            src={getImageUrl(user?.profilePicture)}
            alt={user?.name}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name) + '&background=6366f1&color=fff&size=150';
            }}
          />
          <div className="flex-1">
            <textarea
              className="w-full bg-dark-700/50 border border-dark-600 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 rounded-xl p-4 focus:outline-none resize-none text-base text-text-primary placeholder-text-subtle transition-all duration-200"
              placeholder="What's on your mind?"
              rows="4"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={280}
            />

            {imagePreview && (
              <div className="relative mt-4 group">
                <div className="rounded-2xl overflow-hidden border border-dark-600 shadow-card">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-80 w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 bg-dark-900/90 backdrop-blur-md text-text-primary rounded-full p-3 hover:bg-red-500 hover:scale-110 transition-all duration-200 shadow-lg"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <label className="cursor-pointer text-primary hover:text-primary-dark hover:bg-primary/10 p-3 rounded-xl transition-all duration-200 flex items-center gap-2 group">
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
                <span className={`text-sm font-medium ${text.length > 250 ? 'text-red-500' : 'text-text-muted'}`}>
                  {text.length}/280
                </span>
                <button
                  type="submit"
                  disabled={loading || (!text.trim() && !image)}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
