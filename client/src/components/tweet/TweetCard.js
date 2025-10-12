import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { FaHeart, FaRegHeart, FaComment, FaTrash } from 'react-icons/fa';
import CommentList from './CommentList';
import { getImageUrl } from '../../utils/imageUtils';

const TweetCard = ({ tweet, onDelete }) => {
  const { user: currentUser } = useAuth();
  const [liked, setLiked] = useState(tweet.isLiked);
  const [likesCount, setLikesCount] = useState(tweet.likesCount);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(tweet.commentsCount);

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
    <div className="border-b p-4 hover:bg-gray-50 transition tweet-card">
      <div className="flex gap-3">
        <Link to={`/profile/${tweet.author.username}`}>
          <img
            src={getImageUrl(tweet.author.profilePicture)}
            alt={tweet.author.name}
            className="w-12 h-12 rounded-full"
          />
        </Link>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <Link
                to={`/profile/${tweet.author.username}`}
                className="font-bold hover:underline"
              >
                {tweet.author.name}
              </Link>
              <span className="text-gray-600 ml-2">
                @{tweet.author.username} ·{' '}
                {formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true })}
              </span>
            </div>

            {currentUser?._id === tweet.author._id && (
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-600"
              >
                <FaTrash />
              </button>
            )}
          </div>

          <p className="mt-2 text-gray-900">{tweet.text}</p>

          {tweet.image && (
            <img
              src={getImageUrl(tweet.image)}
              alt="Tweet"
              className="mt-3 rounded-lg max-h-96 w-full object-cover"
            />
          )}

          <div className="flex items-center gap-6 mt-3 text-gray-600">
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 hover:text-primary"
            >
              <FaComment />
              <span>{commentsCount}</span>
            </button>

            <button
              onClick={handleLike}
              className={`flex items-center gap-2 ${
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
