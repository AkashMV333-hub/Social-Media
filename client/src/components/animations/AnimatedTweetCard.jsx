// WHITE THEME VERSION
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaComment, FaRetweet, FaShare, FaTrash } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import { getImageUrl } from '../../utils/imageUtils';
import CommentList from '../tweet/CommentList';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedTweetCard({ tweet, onUpdate, index = 0 }) {
  const cardRef = useRef(null);
  const { user } = useAuth();
  // normalize id and counts so component works with both `id` and `_id` shapes
  const tweetId = tweet.id || tweet._id;
  const initialLikes = tweet.likes ?? (typeof tweet.likesCount !== 'undefined' ? null : null);
  const initialLikesCount = Array.isArray(tweet.likes) ? tweet.likes.length : (tweet.likesCount ?? 0);
  const initialCommentsCount = Array.isArray(tweet.comments) ? tweet.comments.length : (tweet.commentsCount ?? 0);

  const [isLiked, setIsLiked] = useState(
    // prefer explicit isLiked flag, otherwise check likes array for current user
    tweet.isLiked ?? (Array.isArray(tweet.likes) ? tweet.likes.some(like => like.userId === user?.id) : false)
  );
  const [likesCount, setLikesCount] = useState(initialLikesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount || 0);

  // Soft pastel backgrounds for text-only posts (white-theme friendly)
  const textPostColors = [
    '#FFEFEA', '#E8F6FF', '#EAF9F1', '#FFF6DA', '#F4EBFF',
    '#FDECEE', '#E5F4FB', '#FFF2E5'
  ];
  const backgroundColor = !tweet.image ? textPostColors[index % textPostColors.length] : 'transparent';

  const getDynamicFontSize = (text) => {
    if (!text) return 'text-lg';
    const length = text.length;
    if (length <= 10) return 'text-8xl';
    if (length <= 20) return 'text-6xl';
    if (length <= 50) return 'text-4xl';
    if (length <= 100) return 'text-3xl';
    if (length <= 150) return 'text-2xl';
    if (length <= 200) return 'text-xl';
    return 'text-lg';
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.fromTo(
      card,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse',
        },
      }
    );

    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.02,
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        duration: 0.3,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        duration: 0.3,
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const handleLike = async () => {
    try {
      // Toggle like via API. API returns { liked, likesCount }
      // use normalized tweetId
      const response = await axios.post(`/api/tweets/${tweetId}/like`);
      setIsLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      console.error('Error liking tweet:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this tweet?')) return;

    try {
      await axios.delete(`/api/tweets/${tweetId}`);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting tweet:', error);
    }
  };

  // Card soft gradients
  const cardColors = [
    'from-white to-gray-50',
    'from-gray-50 to-white',
    'from-white to-gray-100',
    'from-gray-100 to-white',
  ];
  const randomColor = cardColors[Math.floor(Math.random() * cardColors.length)];

  // Pastel name chips
  const nameColors = [
    'bg-purple-100',
    'bg-blue-100',
    'bg-green-100',
    'bg-yellow-100',
    'bg-pink-100',
    'bg-indigo-100',
    'bg-orange-100',
  ];

  const avatarGradients = [
    'from-purple-300 to-pink-300',
    'from-blue-300 to-cyan-300',
    'from-green-300 to-emerald-300',
    'from-yellow-300 to-orange-300',
    'from-pink-300 to-rose-300',
  ];

  const getNameColor = (username) => {
    if (!username) return nameColors[0];
    const hash = username.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return nameColors[hash % nameColors.length];
  };

  const getAvatarGradient = (username) => {
    if (!username) return avatarGradients[0];
    const hash = username.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return avatarGradients[hash % avatarGradients.length];
  };

  const getInitials = (fullName, username) => {
    if (fullName) {
      const parts = fullName.split(' ');
      if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      return parts[0].slice(0, 2).toUpperCase();
    }
    return username?.[0]?.toUpperCase() || 'U';
  };

  return (
    <div
      ref={cardRef}
      className={`bg-brand2 ${randomColor} rounded-2xl p-6 border border-brand2 shadow-sm`}
      style={{ perspective: '1000px' }}
    >
      <div className="flex items-start space-x-4">
        
        {/* Avatar */}
        <Link to={`/profile/${tweet.author?.username}`}>
          {tweet.author?.profilePicture ? (
            <img
              src={getImageUrl(tweet.author.profilePicture)}
              className="w-12 h-12 rounded-full border border-brand1 hover:scale-110 transition-all"
            />
          ) : (
            <div
              className={`w-12 h-12 rounded-full bg-brand2 ${getAvatarGradient(
                tweet.author?.username
              )} flex items-center justify-center text-brand1 font-bold`}
            >
              {getInitials(tweet.author?.name, tweet.author?.username)}
            </div>
          )}
        </Link>

        {/* Right Side */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Link to={`/profile/${tweet.author?.username}`}>
              <span className={`bg-brand1 px-3 py-1 rounded-full font-semibold`}>
                {tweet.author?.name || tweet.author?.username}
              </span>
            </Link>

            <span className="text-brand1 text-sm">@{tweet.author?.username}</span>
            <span className="text-brand1 text-sm">·</span>
            <span className="text-brand1 text-sm">
              {formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true })}
            </span>
          </div>

          {/* TEXT POST */}
          {!tweet.image ? (
            <p className="mt-4 text-gray-900 leading-relaxed font-medium whitespace-pre-wrap">
    {tweet.text}
  </p>
          ) : (
            <>
              <p className="mt-4 text-gray-900 mb-4 leading-relaxed font-medium">
                {tweet.text}
              </p>
              <img
                src={getImageUrl(tweet.image)}
                alt="Tweet"
                className="rounded-xl w-full mb-4 max-h-96 object-cover hover:scale-[1.02] transition-transform"
              />
            </>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-8 text-brand1">
            {/* Like */}
            <button
              onClick={handleLike}
              className="flex items-center text-xl space-x-2 hover:text-red-500 transition transform hover:scale-110"
            >
              {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              <span className="text-sm">{likesCount}</span>
            </button>

            {/* Comment */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center text-xl space-x-2 hover:text-blue-500 transition transform hover:scale-110"
            >
              <FaComment />
              <span className="text-sm">{commentsCount}</span>
            </button>

            {/* Delete (if owner) */}
            {user?._id === tweet.author?._id && (
              <button
                onClick={handleDelete}
                className="text-text-muted hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all duration-200"
                title="Delete post"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            )}

            {/* Retweet
            <button className="flex items-center space-x-2 hover:text-green-500 transition transform hover:scale-110">
              <FaRetweet />
            </button>

             Share 
            <button className="flex items-center space-x-2 hover:text-gray-800 transition transform hover:scale-110">
              <FaShare />
            </button>
            */}
          </div>
          {showComments && (
            <div className="mt-4">
              <CommentList
                tweetId={tweetId}
                tweetAuthorId={tweet.author?._id}
                onCommentAdded={() => setCommentsCount(prev => prev + 1)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

