import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { getImageUrl } from '../../utils/imageUtils';

// Recursive CommentItem component
const CommentItem = ({ comment, allComments, tweetId, tweetAuthorId, user, expandedReplies, toggleReplies, replyingToId, setReplyingToId, replyText, setReplyText, onCommentAdded, onCommentDelete, level = 0 }) => {
  const replies = allComments.filter(c => c.parentComment === comment._id);
  const isReplying = replyingToId === comment._id;
  const hasReplies = replies.length > 0;
  const isExpanded = expandedReplies[comment._id];
  
  const handleDeleteComment = async () => {
  if (!window.confirm('Are you sure you want to delete this comment?')) return;
  
  try {
    await api.delete(`/api/comments/${comment._id}`);
    // This will need to be passed down from CommentList
    onCommentDelete(comment._id);
  } catch (error) {
    console.error('Error deleting comment:', error);
  }
};
  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      const res = await api.post(`/api/tweets/${tweetId}/comment`, {
        text: replyText,
        parentComment: comment._id,
      });
      const newReply = res.data.data.comment;
      newReply.parentComment = comment._id;
      onCommentAdded && onCommentAdded(newReply); // Pass the new reply
      setReplyText('');
      setReplyingToId(null);
      toggleReplies(comment._id);
    } catch (err) {
      console.error('Reply failed', err);
    }
  };

  const indentClass = level === 0 ? '' : `ml-${Math.min(level * 8, 24)}`;
  const avatarSize = level === 0 ? 'w-8 h-8' : 'w-6 h-6';
  const paddingClass = level === 0 ? 'p-3' : 'p-2';

  return (
    <div className={`${indentClass}`}>
      <div className="flex gap-2">
        <Link to={`/profile/${comment.author.username}`}>
          <img
            src={getImageUrl(comment.author.profilePicture)}
            alt={comment.author.name}
            className={`${avatarSize} rounded-full object-cover border border-brand1/30`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.name)}&background=1DB954&color=fff&size=150`;
            }}
          />
        </Link>
        <div className={`relative flex-1 bg-brand1 rounded-lg ${paddingClass} border border-brand1/30`}>
  <div className="relative z-10">
          <div className="flex items-center gap-2">
            <Link to={`/profile/${comment.author.username}`} className="font-semibold text-sm text-white hover:text-gray-200">
  {comment.author.name}
</Link>
            {tweetAuthorId && comment.author._id === tweetAuthorId && (
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full ml-1">Author</span>
            )}
            <span className="text-xs text-white/70">
  @{comment.author.username} · {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
</span>
          </div>
          <p className="text-white hover:text-gray-100 transition-colors duration-200 text-sm mt-1">{comment.text}</p>
          
          {/* Action buttons side by side */}
          <div className="flex gap-3 mt-2">
  {user?._id === comment.author._id && (
    <button 
  onClick={handleDeleteComment}
  className="text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-lg transition-colors"
  title="Delete comment"
>
  Delete
</button>
  )}
  <button 
  onClick={() => setReplyingToId(isReplying ? null : comment._id)} 
  className="text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-lg transition-colors"
>
  {isReplying ? 'Cancel' : 'Reply'}
</button>
  {hasReplies && (
    <button 
  onClick={() => toggleReplies(comment._id)} 
  className="text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-lg transition-colors"
>
  {isExpanded ? `Hide ${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}` : `Show ${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`}
</button>
  )}
</div>
          
          {isReplying && (
            <div className="mt-3 border-t border-white/20 pt-3 bg-brand1 rounded-lg p-3">
              <form onSubmit={handleSubmitReply} className="flex gap-2">
                <img src={getImageUrl(user?.profilePicture)} alt={user?.name} className="w-6 h-6 rounded-full object-cover border border-white/30"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=1DB954&color=fff&size=150`; }} />
                <div className="mt-3 border-t border-white/20 pt-3 bg-brand1 rounded-lg p-3">
                  <input 
  type="text" 
  className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent" 
  placeholder="Tweet your reply" 
  value={replyText} 
  onChange={(e) => setReplyText(e.target.value)} 
  maxLength={280} 
/>
<button 
  type="submit" 
  disabled={!replyText.trim()} 
  className="mt-2 bg-white hover:bg-white/90 text-brand1 text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
  Reply
</button>
                  
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Nested replies */}
      {hasReplies && isExpanded && (
        <div className={`ml-6 mt-2 pl-4 ${level > 0 ? 'border-l-2 border-gray-200' : 'border-l-2 border-gray-300'}`}>
          <div className="space-y-2">
            {replies.map(reply => (
              <CommentItem
                key={reply._id}
                comment={reply}
                allComments={allComments}
                tweetId={tweetId}
                tweetAuthorId={tweetAuthorId}
                user={user}
                expandedReplies={expandedReplies}
                toggleReplies={toggleReplies}
                replyingToId={replyingToId}
                setReplyingToId={setReplyingToId}
                replyText={replyText}
                setReplyText={setReplyText}
                onCommentAdded={onCommentAdded}
                onCommentDelete={onCommentDelete} 
                level={level + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CommentList = ({ tweetId, tweetAuthorId, onCommentAdded, scrollToCommentId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [tweetAuthorIdState, setTweetAuthorIdState] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});

  useEffect(() => { fetchComments(); }, [tweetId]);
  
  useEffect(() => {
    if (!scrollToCommentId) return;
    setTimeout(() => {
      const el = document.getElementById(`comment-${scrollToCommentId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.backgroundColor = 'rgba(99,102,241,0.12)';
        setTimeout(() => { el.style.backgroundColor = ''; }, 1200);
      }
    }, 100);
  }, [comments, scrollToCommentId]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/api/tweets/${tweetId}/comments`);
      setComments(response.data.data.comments);
      setTweetAuthorIdState(response.data.data.tweetAuthorId);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      setLoading(true);
      const response = await api.post(`/api/tweets/${tweetId}/comment`, { text: newComment });
      setComments([response.data.data.comment, ...comments]);
      setNewComment('');
      onCommentAdded();
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };
  
  const handleCommentAdded = (newComment = null) => {
  if (newComment) {
    // If it's a reply, add it to comments state
    setComments(prev => [newComment, ...prev]);
  } else {
    // If it's a top-level comment, increment count
    onCommentAdded();
  }
};
const handleCommentDelete = (commentId) => {
  setComments(prev => prev.filter(c => c._id !== commentId));
};

  const topLevelComments = comments.filter(c => !c.parentComment);

  return (
  <div className="mt-3 border-t border-gray-800 pt-3">
  <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
    <img 
      src={getImageUrl(user?.profilePicture)} 
      alt={user?.name} 
      className="w-8 h-8 rounded-full object-cover border border-brand1/30"
      onError={(e) => { 
        e.target.onerror = null; 
        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=6366f1&color=fff&size=150`; 
      }} 
    />
    <div className="mt-3 border-t border-white/20 pt-3 bg-brand1 rounded-lg p-3">
      <input 
        type="text" 
        className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent" 
        placeholder="Tweet your reply" 
        value={newComment} 
        onChange={(e) => setNewComment(e.target.value)} 
        maxLength={280} 
      />
      <button 
        type="submit" 
        disabled={loading || !newComment.trim()} 
        className="mt-2 bg-brand1 hover:bg-brand1/90 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Replying...' : 'Reply'}
      </button>
    </div>
  </form>

      <div className="space-y-3">
        {topLevelComments.map(comment => (
          <div key={comment._id} id={`comment-${comment._id}`}>
            <CommentItem
  comment={comment}
  allComments={comments}
  tweetId={tweetId}
  tweetAuthorId={tweetAuthorIdState}
  user={user}
  expandedReplies={expandedReplies}
  toggleReplies={toggleReplies}
  replyingToId={replyingToId}
  setReplyingToId={setReplyingToId}
  replyText={replyText}
  setReplyText={setReplyText}
  onCommentAdded={handleCommentAdded}
  onCommentDelete={handleCommentDelete}
  level={0}
/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;