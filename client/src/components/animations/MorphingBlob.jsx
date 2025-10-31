import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

function MorphingBlob({ size = 'medium', color = 'primary', className = '' }) {
  const blobRef = useRef(null);

  const sizes = {
    small: 150,
    medium: 250,
    large: 400,
  };

  const colors = {
    primary: { start: '#6366f1', end: '#818cf8' },
    secondary: { start: '#ec4899', end: '#f472b6' },
    accent: { start: '#8b5cf6', end: '#a78bfa' },
  };

  const blobSize = sizes[size] || sizes.medium;
  const gradientColors = colors[color] || colors.primary;

  useEffect(() => {
    if (!blobRef.current) return;

    const path = blobRef.current;
    let time = 0;

    // Animate blob morphing
    const animate = () => {
      time += 0.01;

      // Generate organic morphing path using sinusoidal waves
      const points = 8;
      const radius = blobSize / 2;
      const centerX = blobSize / 2;
      const centerY = blobSize / 2;

      let pathD = '';

      for (let i = 0; i <= points; i++) {
        const angle = (Math.PI * 2 * i) / points;

        // Multiple wave layers for organic movement
        const wave1 = Math.sin(angle * 3 + time) * 0.1;
        const wave2 = Math.cos(angle * 2 + time * 1.5) * 0.08;
        const wave3 = Math.sin(angle * 5 + time * 0.7) * 0.06;

        const r = radius * (1 + wave1 + wave2 + wave3);
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;

        if (i === 0) {
          pathD += `M ${x} ${y}`;
        } else {
          // Create smooth curves with quadratic bezier
          const prevAngle = (Math.PI * 2 * (i - 1)) / points;
          const prevWave1 = Math.sin(prevAngle * 3 + time) * 0.1;
          const prevWave2 = Math.cos(prevAngle * 2 + time * 1.5) * 0.08;
          const prevWave3 = Math.sin(prevAngle * 5 + time * 0.7) * 0.06;
          const prevR = radius * (1 + prevWave1 + prevWave2 + prevWave3);

          const cpAngle = (prevAngle + angle) / 2;
          const cpR = (r + prevR) / 2;
          const cpX = centerX + Math.cos(cpAngle) * cpR;
          const cpY = centerY + Math.sin(cpAngle) * cpR;

          pathD += ` Q ${cpX} ${cpY} ${x} ${y}`;
        }
      }

      pathD += ' Z';
      path.setAttribute('d', pathD);

      requestAnimationFrame(animate);
    };

    animate();
  }, [blobSize]);

  return (
    <svg
      width={blobSize}
      height={blobSize}
      className={`absolute ${className}`}
      style={{ filter: 'blur(20px)', opacity: 0.6 }}
    >
      <defs>
        <linearGradient id={`gradient-${color}-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradientColors.start} />
          <stop offset="100%" stopColor={gradientColors.end} />
        </linearGradient>
      </defs>
      <path
        ref={blobRef}
        fill={`url(#gradient-${color}-${size})`}
        d=""
      />
    </svg>
  );
}

export default MorphingBlob;
