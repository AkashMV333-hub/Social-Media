import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function AnimatedTweetCard({ tweet, onLike, onComment }) {
  const cardRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;

    // GSAP ScrollTrigger animation
    gsap.fromTo(
      cardRef.current,
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
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          end: 'top 65%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);

    // Create particle burst
    const newParticles = [];
    const particleCount = 12;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 3 + Math.random() * 2;

      newParticles.push({
        id: Date.now() + i,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1,
      });
    }

    setParticles(newParticles);

    // Animate particles
    const interval = setInterval(() => {
      setParticles(prev => {
        const updated = prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.2, // gravity
          life: p.life - 0.02,
        })).filter(p => p.life > 0);

        if (updated.length === 0) {
          clearInterval(interval);
        }

        return updated;
      });
    }, 16); // 60 FPS

    if (onLike) onLike(tweet.id);
  };

  return (
    <div
      ref={cardRef}
      className="relative bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg rounded-2xl p-6 mb-4 shadow-lg border border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Particle burst container */}
      <div className="absolute top-1/2 left-1/2 pointer-events-none" style={{ zIndex: 100 }}>
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-pink-500 rounded-full"
            style={{
              transform: `translate(${particle.x}px, ${particle.y}px)`,
              opacity: particle.life,
              transition: 'none',
            }}
          />
        ))}
      </div>

      {/* User info */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
          {tweet.user?.username?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{tweet.user?.fullName || 'User'}</h3>
          <p className="text-sm text-gray-500">@{tweet.user?.username || 'username'}</p>
        </div>
      </div>

      {/* Tweet content */}
      <p className="text-gray-800 mb-4 leading-relaxed">{tweet.content}</p>

      {/* Tweet image */}
      {tweet.image && (
        <div className="mb-4 rounded-xl overflow-hidden">
          <img
            src={tweet.image}
            alt="Tweet"
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 pt-3 border-t border-gray-200/50">
        <button
          onClick={handleLikeClick}
          className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors relative"
        >
          <svg
            className={`w-5 h-5 transition-transform ${isLiked ? 'scale-125 fill-pink-500 text-pink-500' : ''}`}
            fill={isLiked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className={isLiked ? 'text-pink-500 font-semibold' : ''}>
            {(tweet.likes?.length || 0) + (isLiked ? 1 : 0)}
          </span>
        </button>

        <button
          onClick={() => onComment && onComment(tweet.id)}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-500 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>{tweet.comments?.length || 0}</span>
        </button>

        <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors ml-auto">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default AnimatedTweetCard;
