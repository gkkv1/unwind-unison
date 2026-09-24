// ============================================================
// LoadingScreen — Cinematic intro loading animation
// ============================================================

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './LoadingScreen.scss';

export default function LoadingScreen({ onComplete }) {
  const containerRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const divider1Ref = useRef(null);
  const divider2Ref = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setTimeout(onComplete, 300);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete,
          });
        },
      });

      // Set initial states
      tl.set([line1Ref.current, line2Ref.current, line3Ref.current], {
        opacity: 0,
        y: 30,
      });
      tl.set([divider1Ref.current, divider2Ref.current], { scaleX: 0 });
      tl.set(barRef.current, { scaleX: 0 });

      // Animate
      tl.to(line1Ref.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.2)
        .to(divider1Ref.current, { scaleX: 1, duration: 0.4, ease: 'power2.inOut' }, 0.6)
        .to(line2Ref.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.7)
        .to(divider2Ref.current, { scaleX: 1, duration: 0.4, ease: 'power2.inOut' }, 1.0)
        .to(line3Ref.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 1.1)
        .to(barRef.current, { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, 1.4)
        .to({}, { duration: 0.3 }); // hold

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={containerRef} className="loading-screen" role="status" aria-label="Loading UNWIND UNISON">
      <div className="loading-content">
        <p ref={line1Ref} className="loading-line loading-line--main">UNWIND</p>
        <div ref={divider1Ref} className="loading-divider" />
        <p ref={line2Ref} className="loading-line loading-line--sub">UNISON</p>
        <div ref={divider2Ref} className="loading-divider" />
        <p ref={line3Ref} className="loading-line loading-line--year">ANNUAL CELEBRATION</p>
        <div className="loading-bar-track">
          <div ref={barRef} className="loading-bar-fill" />
        </div>
      </div>
      <div className="loading-bg-orbs" aria-hidden="true">
        <div className="bg-orb bg-orb--1" />
        <div className="bg-orb bg-orb--2" />
      </div>
    </div>
  );
}
