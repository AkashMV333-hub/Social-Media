import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

function PageTransition({ children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.children;

    // Fade + slide + scale entrance animation
    gsap.fromTo(
      containerRef.current,
      {
        opacity: 0,
        y: 30,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power3.out',
      }
    );

    // Staggered children animations
    if (elements.length > 0) {
      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.2,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {children}
    </div>
  );
}

export default PageTransition;
