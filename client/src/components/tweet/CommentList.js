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
    <div className="mt-4 border-t pt-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <img
            src={getImageUrl(user?.profilePicture)}
            alt={user?.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1">
            <input
              type="text"
              className="input-field"
              placeholder="Tweet your reply"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={280}
            />
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="btn-primary mt-2 disabled:opacity-50"
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
                className="w-8 h-8 rounded-full"
              />
            </Link>
            <div className="flex-1 bg-gray-100 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Link
                  to={`/profile/${comment.author.username}`}
                  className="font-semibold text-sm hover:underline"
                >
                  {comment.author.name}
                </Link>
                <span className="text-xs text-gray-600">
                  @{comment.author.username} ·{' '}
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm mt-1">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;
