'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  /** Stagger children with delays */
  stagger?: boolean;
  /** Root margin for earlier trigger, e.g. '-50px' */
  rootMargin?: string;
}

/**
 * Lightweight scroll-reveal wrapper.
 * Adds `.is-visible` when the element enters the viewport,
 * triggering the CSS transition defined in globals.css.
 */
export default function AnimateOnScroll({ 
  children, 
  className = '', 
  stagger = false,
  rootMargin = '0px 0px -60px 0px'
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.unobserve(el); // Only animate once
        }
      },
      { threshold: 0.1, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${stagger ? 'stagger-children' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
