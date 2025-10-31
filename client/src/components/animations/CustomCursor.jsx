import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

function CustomCursor() {
  const cursorRingRef = useRef(null);
  const cursorDotRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursorRing = cursorRingRef.current;
    const cursorDot = cursorDotRef.current;

    if (!cursorRing || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let dotX = 0;
    let dotY = 0;

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Check if hovering over interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.getAttribute('role') === 'button' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.getAttribute('role') === 'button' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovering(false);
      }
    };

    // Smooth tracking with GSAP lerp
    const animate = () => {
      // Lerp for smooth following
      const ringSpeed = 0.15;
      const dotSpeed = 0.3;

      ringX += (mouseX - ringX) * ringSpeed;
      ringY += (mouseY - ringY) * ringSpeed;

      dotX += (mouseX - dotX) * dotSpeed;
      dotY += (mouseY - dotY) * dotSpeed;

      gsap.set(cursorRing, {
        x: ringX,
        y: ringY,
        xPercent: -50,
        yPercent: -50,
      });

      gsap.set(cursorDot, {
        x: dotX,
        y: dotY,
        xPercent: -50,
        yPercent: -50,
      });

      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      {/* Cursor ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          width: '32px',
          height: '32px',
          border: '2px solid #a855f7',
          borderRadius: '50%',
          transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
          transform: isHovering ? 'scale(2)' : 'scale(1)',
          opacity: 0.8,
          filter: 'blur(0.5px)',
        }}
      />

      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          width: '8px',
          height: '8px',
          backgroundColor: '#a855f7',
          borderRadius: '50%',
          transition: 'transform 0.15s ease-out',
          transform: isHovering ? 'scale(1.5)' : 'scale(1)',
        }}
      />
    </>
  );
}

export default CustomCursor;
