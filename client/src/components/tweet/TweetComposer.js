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
    <div className="border-b p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <img
            src={getImageUrl(user?.profilePicture)}
            alt={user?.name}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <textarea
              className="w-full border-none focus:outline-none resize-none text-lg"
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
                  className="rounded-lg max-h-64 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-75 text-white rounded-full p-2 hover:bg-opacity-100"
                >
                  <FaTimes />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              <label className="cursor-pointer text-primary hover:text-blue-600">
                <FaImage size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{text.length}/280</span>
                <button
                  type="submit"
                  disabled={loading || (!text.trim() && !image)}
                  className="btn-primary disabled:opacity-50"
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
