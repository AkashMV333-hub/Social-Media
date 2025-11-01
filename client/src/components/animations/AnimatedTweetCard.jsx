import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaComment, FaRetweet, FaShare } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import { getImageUrl } from '../../utils/imageUtils';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedTweetCard({ tweet, onUpdate, index = 0 }) {
  const cardRef = useRef(null);
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(
    tweet.likes?.some(like => like.userId === user?.id) || false
  );
  const [likesCount, setLikesCount] = useState(tweet.likes?.length || 0);

  // Background colors for text-only posts
  const textPostColors = ['#BF937C', '#4F3A35', '#2F6755', '#98A69A','#AC7E6E', '#C9ADA7', '#82BAC4', '#725444', '#82BAC4'];
  const backgroundColor = !tweet.image ? textPostColors[index % textPostColors.length] : 'transparent';

  // Dynamic font size based on text length
  const getDynamicFontSize = (text) => {
    if (!text) return 'text-lg';
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

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Scroll trigger animation
    gsap.fromTo(
      card,
      {
        opacity: 0,
        y: 50,
        rotateX: -15,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
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

    // Hover animation with GLOW
    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.01,
        boxShadow: '0 10px 30px rgba(99, 102, 241, 0.25), 0 0 20px rgba(139, 92, 246, 0.15)',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleLike = async () => {
    try {
      const response = await axios.post(`/api/tweets/${tweet.id}/like`);
      setIsLiked(response.data.liked);
      setLikesCount(response.data.likesCount);

      // Particle burst animation
      createParticleBurst(cardRef.current);

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error liking tweet:', error);
    }
  };

  const createParticleBurst = (element) => {
    const rect = element.getBoundingClientRect();
    const particleCount = 12;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle-burst';
      particle.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: linear-gradient(135deg, #ec4899, #8b5cf6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
      `;
      document.body.appendChild(particle);

      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 100 + Math.random() * 50;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      gsap.to(particle, {
        x,
        y,
        opacity: 0,
        scale: 0,
        duration: 0.8 + Math.random() * 0.4,
        ease: 'power2.out',
        onComplete: () => particle.remove(),
      });
    }
  };

  // Random background colors for each tweet
  const cardColors = [
    'from-purple-500/10 to-pink-500/10',
    'from-blue-500/10 to-cyan-500/10',
    'from-green-500/10 to-emerald-500/10',
    'from-orange-500/10 to-red-500/10',
    'from-indigo-500/10 to-purple-500/10',
    'from-rose-500/10 to-pink-500/10',
    'from-teal-500/10 to-green-500/10',
    'from-yellow-500/10 to-orange-500/10',
    'from-violet-500/10 to-purple-500/10',
  ];

  const randomColor = cardColors[Math.floor(Math.random() * cardColors.length)];

  // Colored backgrounds for profile names (consistent per user)
  const nameColors = [
    'bg-gradient-to-r from-purple-500/20 to-pink-500/20',
    'bg-gradient-to-r from-blue-500/20 to-cyan-500/20',
    'bg-gradient-to-r from-green-500/20 to-emerald-500/20',
    'bg-gradient-to-r from-orange-500/20 to-red-500/20',
    'bg-gradient-to-r from-indigo-500/20 to-purple-500/20',
    'bg-gradient-to-r from-rose-500/20 to-pink-500/20',
    'bg-gradient-to-r from-teal-500/20 to-green-500/20',
  ];

  // Profile photo placeholder gradients
  const avatarGradients = [
    'from-indigo-500 to-purple-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-pink-500 to-rose-500',
    'from-violet-500 to-purple-500',
    'from-teal-500 to-blue-500',
    'from-yellow-500 to-orange-500',
    'from-fuchsia-500 to-pink-500',
  ];

  const getNameColor = (username) => {
    if (!username) return nameColors[0];
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return nameColors[hash % nameColors.length];
  };

  const getAvatarGradient = (username) => {
    if (!username) return avatarGradients[0];
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return avatarGradients[hash % avatarGradients.length];
  };

  // Get initials from full name (first and last name)
  const getInitials = (fullName, username) => {
    if (fullName) {
      const names = fullName.trim().split(' ');
      if (names.length >= 2) {
        // Get first letter of first name and first letter of last name
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      } else if (names.length === 1) {
        // If only one name, use first two letters
        return names[0].substring(0, 2).toUpperCase();
      }
    }
    // Fallback to username first letter
    return username?.[0]?.toUpperCase() || 'U';
  };

  return (
    <div
      ref={cardRef}
      className={`bg-gradient-to-br ${randomColor} backdrop-blur-xl rounded-2xl p-6 mb-4 border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300`}
      style={{ perspective: '1000px' }}
    >
      <div className="flex items-start space-x-4">
        <Link to={`/profile/${tweet.author?.username}`} className="group">
          {tweet.author?.profilePicture ? (
            <img
              src={getImageUrl(tweet.author.profilePicture)}
              alt={tweet.author?.username}
              className="w-12 h-12 rounded-full ring-2 ring-primary/50 hover:ring-primary transition-all duration-300 transform hover:scale-110 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]"
            />
          ) : (
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarGradient(tweet.author?.username)} flex items-center justify-center text-white font-bold text-sm ring-2 ring-primary/50 hover:ring-primary transition-all duration-300 transform hover:scale-110 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]`}>
              {getInitials(tweet.author?.name, tweet.author?.username)}
            </div>
          )}
        </Link>

        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Link
              to={`/profile/${tweet.author?.username}`}
              className="relative group"
            >
              <span className={`${getNameColor(tweet.author?.username)} px-3 py-1 rounded-full font-bold text-text-primary transition-all duration-300 profile-name-glow`}>
                {tweet.author?.name || tweet.author?.username}
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
            </Link>
            <span className="text-text-muted text-sm">
              @{tweet.author?.username}
            </span>
            <span className="text-text-subtle text-sm">·</span>
            <span className="text-text-subtle text-sm">
              {formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true })}
            </span>
          </div>

          {!tweet.image ? (
            <div
              className="mt-6 rounded-2xl w-full flex items-center justify-center p-8 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden relative group mb-6 "
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
              <p className="mt-4 text-white mb-4 leading-relaxed font-medium">{tweet.text}</p>
              <img
                src={getImageUrl(tweet.image)}
                alt="Tweet"
                className="rounded-xl w-full mb-4 max-h-96 object-cover transform transition-transform duration-300 hover:scale-[1.02]"
              />
            </>
          )}

          <div className="flex items-center space-x-8 text-gray-400">
            <button
              onClick={handleLike}
              className="flex items-center space-x-2 hover:text-pink-500 transition-all duration-300 group transform hover:scale-110"
            >
              {isLiked ? (
                <FaHeart className="text-pink-500 animate-pulse" />
              ) : (
                <FaRegHeart className="group-hover:scale-125 transition-transform" />
              )}
              <span className="text-sm font-medium">{likesCount}</span>
            </button>

            <button className="flex items-center space-x-2 hover:text-blue-500 transition-all duration-300 group transform hover:scale-110">
              <FaComment className="group-hover:scale-125 transition-transform" />
              <span className="text-sm font-medium">
                {tweet.comments?.length || 0}
              </span>
            </button>

            <button className="flex items-center space-x-2 hover:text-green-500 transition-all duration-300 group transform hover:scale-110">
              <FaRetweet className="group-hover:rotate-180 transition-transform duration-500" />
            </button>

            <button className="flex items-center space-x-2 hover:text-primary transition-all duration-300 group transform hover:scale-110">
              <FaShare className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
