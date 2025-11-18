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
    <div className="border-b border-dark-600 p-6 tweet-card backdrop-blur-sm rounded-lg mb-2">
      <div className="flex gap-4">
        <Link to={`/profile/${tweet.author.username}`} className="flex-shrink-0">
          <div className="relative group">
            <div className="absolute inset-0 bg-brand1 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
            <img
              src={getImageUrl(tweet.author.profilePicture)}
              alt={tweet.author.name}
              className="relative w-14 h-14 rounded-full object-cover ring-2 ring-dark-600 group-hover:ring-primary transition-all duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(tweet.author.name) + '&background=6366f1&color=fff&size=150';
              }}
            />
          </div>
        </Link>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <Link
                to={`/profile/${tweet.author.username}`}
                className="font-bold text-text-primary hover:text-primary transition-colors duration-200 text-lg"
              >
                {tweet.author.name}
              </Link>
              <span className="text-text-muted text-sm">
                @{tweet.author.username} · {formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true })}
              </span>
            </div>

            {currentUser?._id === tweet.author._id && (
              <button
                onClick={handleDelete}
                className="text-text-muted hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all duration-200"
                title="Delete post"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            )}
          </div>

          {!tweet.image ? (
            <div
              className="mt-4 rounded-2xl w-full flex items-center justify-center p-8 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden relative group"
              style={{
                backgroundColor,
                minHeight: '24rem',
                maxHeight: '24rem'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <p className={`relative text-white font-bold ${getDynamicFontSize(tweet.text)} leading-snug text-center break-words w-full drop-shadow-lg`}>
                {tweet.text}
              </p>
            </div>
          ) : (
            <>
              <p className="mt-4 text-text-secondary text-base leading-relaxed">{tweet.text}</p>
              <div className="mt-4 rounded-2xl overflow-hidden border border-dark-600 hover:border-primary/30 transition-all duration-300 shadow-card hover:shadow-card-hover group">
                <img
                  src={getImageUrl(tweet.image)}
                  alt="Post image"
                  className="w-full max-h-[32rem] object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </>
          )}

          <div className="flex items-center gap-2 mt-5">

            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 group ${
                liked
                  ? 'text-red-500 bg-red-500/10'
                  : 'text-text-muted hover:text-red-500 hover:bg-red-500/10'
              }`}
            >
              {liked ? (
                <FaHeart className="w-4 h-4 group-hover:scale-125 transition-transform" />
              ) : (
                <FaRegHeart className="w-4 h-4 group-hover:scale-110 transition-transform" />
              )}
              <span className="font-semibold">{likesCount}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-primary/10 text-text-muted hover:text-primary transition-all duration-200 group"
            >
              <FaComment className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">{commentsCount}</span>
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
