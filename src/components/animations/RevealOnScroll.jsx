// ============================================================
// RevealOnScroll — GSAP ScrollTrigger reveal wrapper
// ============================================================

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  direction = 'up', // 'up' | 'left' | 'right' | 'scale' | 'none'
  stagger = false,
  threshold = 0.15,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const getFrom = () => {
      switch (direction) {
        case 'left': return { opacity: 0, x: -50 };
        case 'right': return { opacity: 0, x: 50 };
        case 'scale': return { opacity: 0, scale: 0.88 };
        case 'none': return { opacity: 0 };
        default: return { opacity: 0, y: 50 };
      }
    };

    const targets = stagger ? el.children : el;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        getFrom(),
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.9,
          delay,
          ease: 'power3.out',
          stagger: stagger ? 0.1 : 0,
          scrollTrigger: {
            trigger: el,
            start: `top ${(1 - threshold) * 100}%`,
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay, direction, stagger, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
