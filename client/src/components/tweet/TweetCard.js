import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { FaHeart, FaRegHeart, FaComment, FaTrash } from 'react-icons/fa';
import CommentList from './CommentList';
import { getImageUrl } from '../../utils/imageUtils';

const TweetCard = ({ tweet, onDelete, index = 0 }) => {
  const { user: currentUser } = useAuth();
  const [liked, setLiked] = useState(tweet.isLiked);
  const [likesCount, setLikesCount] = useState(tweet.likesCount);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(tweet.commentsCount);

  // Background colors for text-only posts
  const textPostColors = ['#BF937C', '#4F3A35', '#2F6755', '#98A69A','#AC7E6E', '#C9ADA7', '#82BAC4', '#725444', '#82BAC4'];
  const backgroundColor = !tweet.image ? textPostColors[index % textPostColors.length] : 'transparent';

  // Dynamic font size based on text length
  const getDynamicFontSize = (text) => {
    const length = text.length;
    if (length <= 10) return 'text-9xl';
    if (length <= 20) return 'text-7xl';
    if (length <= 50) return 'text-5xl';
    if (length <= 100) return 'text-4xl';
    if (length <= 150) return 'text-3xl';
    if (length <= 200) return 'text-2xl';
    if (length <= 300) return 'text-xl';
    return 'text-lg';
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await api.delete(`/api/tweets/${tweet._id}/like`);
        setLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        await api.post(`/api/tweets/${tweet._id}/like`);
        setLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this tweet?')) return;

    try {
      await api.delete(`/api/tweets/${tweet._id}`);
      if (onDelete) {
        onDelete(tweet._id);
      }
    } catch (error) {
      console.error('Error deleting tweet:', error);
    }
  };

  return (
    <div className="border-b border-spotify-border p-4 hover:bg-spotify-light-gray hover:bg-opacity-50 transition-all duration-200 tweet-card">
      <div className="flex gap-3">
        <Link to={`/profile/${tweet.author.username}`}>
          <img
            src={getImageUrl(tweet.author.profilePicture)}
            alt={tweet.author.name}
            className="w-12 h-12 rounded-full object-cover bg-spotify-light-gray"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(tweet.author.name) + '&background=1DB954&color=fff&size=150';
            }}
          />
        </Link>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <Link
                to={`/profile/${tweet.author.username}`}
                className="font-bold text-spotify-text hover:underline transition-opacity duration-200"
              >
                {tweet.author.name}
              </Link>
              <span className="text-spotify-text-gray ml-2">
                @{tweet.author.username} ·{' '}
                {formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true })}
              </span>
            </div>

            {currentUser?._id === tweet.author._id && (
              <button
                onClick={handleDelete}
                className="text-spotify-text-gray hover:text-red-600 transition-colors duration-200"
              >
                <FaTrash />
              </button>
            )}
          </div>

          {!tweet.image ? (
            <div
              className="mt-3 rounded-lg w-full flex items-center justify-center p-6"
              style={{
                backgroundColor,
                minHeight: '24rem',
                maxHeight: '24rem'
              }}
            >
              <p className={`text-white font-bold ${getDynamicFontSize(tweet.text)} leading-snug text-center break-words w-full`}>
                {tweet.text}
              </p>
            </div>
          ) : (
            <>
              <p className="mt-2 text-spotify-text">{tweet.text}</p>
              <img
                src={getImageUrl(tweet.image)}
                alt="Tweet"
                className="mt-3 rounded-lg max-h-96 w-full object-cover border border-spotify-border"
              />
            </>
          )}

          <div className="flex items-center gap-6 mt-3 text-spotify-text-gray">
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 hover:text-spotify-green transition-colors duration-200"
            >
              <FaComment />
              <span>{commentsCount}</span>
            </button>

            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors duration-200 ${
                liked ? 'text-red-500' : 'hover:text-red-500'
              }`}
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
              <span>{likesCount}</span>
            </button>
          </div>

          {showComments && (
            <CommentList
              tweetId={tweet._id}
              onCommentAdded={() => setCommentsCount(prev => prev + 1)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
