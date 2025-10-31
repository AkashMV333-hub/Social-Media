import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function TextReveal({ children, type = 'word', className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const text = containerRef.current.textContent;
    containerRef.current.innerHTML = '';

    let elements = [];

    if (type === 'character') {
      // Split by character
      elements = text.split('').map((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'rotateX(-90deg) translateY(50px)';
        span.style.transformOrigin = 'center bottom';
        containerRef.current.appendChild(span);
        return span;
      });
    } else {
      // Split by word
      const words = text.split(' ');
      elements = words.map((word, i) => {
        const span = document.createElement('span');
        span.textContent = word;
        span.style.display = 'inline-block';
        span.style.marginRight = '0.25em';
        span.style.opacity = '0';
        span.style.transform = 'rotateX(-90deg) translateY(50px)';
        span.style.transformOrigin = 'center bottom';
        containerRef.current.appendChild(span);
        return span;
      });
    }

    // Animate with 3D rotation effect
    gsap.to(elements, {
      opacity: 1,
      rotateX: 0,
      y: 0,
      duration: 0.6,
      stagger: type === 'character' ? 0.02 : 0.05,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [children, type]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ perspective: '1000px' }}
    >
      {children}
    </div>
  );
}

export default TextReveal;
