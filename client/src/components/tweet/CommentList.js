import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { getImageUrl } from '../../utils/imageUtils';

const CommentList = ({ tweetId, onCommentAdded }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [tweetId]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/api/tweets/${tweetId}/comments`);
      setComments(response.data.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const response = await api.post(`/api/tweets/${tweetId}/comment`, {
        text: newComment,
      });

      setComments([response.data.data.comment, ...comments]);
      setNewComment('');
      onCommentAdded();
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 border-t border-spotify-border pt-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <img
            src={getImageUrl(user?.profilePicture)}
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover bg-spotify-light-gray"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name) + '&background=1DB954&color=fff&size=150';
            }}
          />
          <div className="flex-1">
            <input
              type="text"
              className="input-field bg-spotify-gray text-spotify-text placeholder-spotify-text-gray border-spotify-border focus:border-spotify-green transition-colors duration-200"
              placeholder="Tweet your reply"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={280}
            />
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="btn-primary mt-2 disabled:opacity-50 transition-opacity duration-200"
            >
              {loading ? 'Replying...' : 'Reply'}
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-3">
        {comments.map(comment => (
          <div key={comment._id} className="flex gap-2">
            <Link to={`/profile/${comment.author.username}`}>
              <img
                src={getImageUrl(comment.author.profilePicture)}
                alt={comment.author.name}
                className="w-8 h-8 rounded-full object-cover bg-spotify-light-gray"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(comment.author.name) + '&background=1DB954&color=fff&size=150';
                }}
              />
            </Link>
            <div className="flex-1 bg-spotify-light-gray rounded-lg p-3 border border-spotify-border">
              <div className="flex items-center gap-2">
                <Link
                  to={`/profile/${comment.author.username}`}
                  className="font-semibold text-sm text-spotify-text hover:underline transition-opacity duration-200"
                >
                  {comment.author.name}
                </Link>
                <span className="text-xs text-spotify-text-gray">
                  @{comment.author.username} ·{' '}
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm mt-1 text-spotify-text">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;
