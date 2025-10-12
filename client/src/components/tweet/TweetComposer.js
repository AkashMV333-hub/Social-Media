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
    <div className="border-b border-spotify-border p-4 bg-spotify-light-gray">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <img
            src={getImageUrl(user?.profilePicture)}
            alt={user?.name}
            className="w-12 h-12 rounded-full object-cover bg-spotify-gray"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name) + '&background=1DB954&color=fff&size=150';
            }}
          />
          <div className="flex-1">
            <textarea
              className="w-full bg-transparent border-none focus:outline-none resize-none text-lg text-spotify-text placeholder-spotify-text-gray"
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
                  className="rounded-lg max-h-64 w-full object-cover border border-spotify-border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-spotify-gray bg-opacity-90 text-spotify-text rounded-full p-2 hover:bg-opacity-100 transition-all duration-200"
                >
                  <FaTimes />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              <label className="cursor-pointer text-spotify-green hover:text-spotify-green hover:opacity-80 transition-opacity duration-200">
                <FaImage size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-3">
                <span className="text-sm text-spotify-text-gray">{text.length}/280</span>
                <button
                  type="submit"
                  disabled={loading || (!text.trim() && !image)}
                  className="btn-primary bg-white disabled:opacity-50 transition-opacity duration-200"
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
