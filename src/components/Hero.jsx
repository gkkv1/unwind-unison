// ============================================================
// Hero Section — Cinematic opening
// ============================================================

import { useEffect, useRef, Suspense, lazy } from 'react';
import { gsap } from 'gsap';
import { ChevronDown } from 'lucide-react';

// Lazy-load 3D scene — keeps Three.js out of the initial bundle
const HeroScene = lazy(() => import('./3d/HeroScene'));
import MagneticButton from './animations/MagneticButton';
import './Hero.scss';

export default function Hero({ config }) {
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const metaRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      if (!prefersReducedMotion) {
        tl.fromTo(eyebrowRef.current,
          { opacity: 0, y: 20, letterSpacing: '0.6em' },
          { opacity: 1, y: 0, letterSpacing: '0.25em', duration: 0.8, ease: 'power3.out' }
        )
        .fromTo(titleRef.current?.children,
          { opacity: 0, y: 60, skewY: 3 },
          { opacity: 1, y: 0, skewY: 0, duration: 1, stagger: 0.12, ease: 'power4.out' },
          '-=0.3'
        )
        .fromTo(subtitleRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(metaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(ctaRef.current,
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.5)' },
          '-=0.2'
        )
        .fromTo(scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          '-=0.1'
        );
      } else {
        gsap.set([eyebrowRef.current, titleRef.current, subtitleRef.current,
                  metaRef.current, ctaRef.current, scrollIndicatorRef.current],
          { opacity: 1, y: 0 }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const scrollToNext = () => {
    const next = document.getElementById('memories');
    if (next) next.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToRSVP = () => {
    const el = document.getElementById('rsvp');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero" aria-label="Hero section">
      {/* 3D Background */}
      <div className="hero__scene" aria-hidden="true">
        <Suspense fallback={<div className="hero-fallback-bg"><div className="orb orb-1"/><div className="orb orb-2"/></div>}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Gradient overlays */}
      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__overlay-bottom" aria-hidden="true" />

      {/* Floating light beams */}
      <div className="hero__beams" aria-hidden="true">
        <div className="beam beam--1" />
        <div className="beam beam--2" />
        <div className="beam beam--3" />
      </div>

      {/* Content */}
      <div className="hero__content">
        <div className="hero__inner container">
          <p ref={eyebrowRef} className="hero__eyebrow eyebrow">
            ANNUAL CELEBRATION
          </p>

          <div ref={titleRef} className="hero__title-wrap">
            <h1 className="hero__title display">
              {(() => {
                const title = config?.eventName || 'UNWIND UNISON';
                if (title.includes('2.0')) {
                  const base = title.replace('2.0', '').trim();
                  return (
                    <>
                      <span className="hero__title-line">{base}</span>
                      <span className="hero__title-edition">2.0</span>
                    </>
                  );
                }
                return <span className="hero__title-line">{title}</span>;
              })()}
            </h1>
          </div>

          <p ref={subtitleRef} className="hero__subtitle">
            {config?.heroSubtitle || 'One Night. One Crew. Unwind in Unison.'}
          </p>

          <div ref={metaRef} className="hero__meta">
            <span className="hero__meta-item">
              {config?.eventDate || '[DATE]'}
            </span>
            <span className="hero__meta-sep">•</span>
            <span className="hero__meta-item">
              {config?.startTime || '[TIME]'}
            </span>
            <span className="hero__meta-sep">•</span>
            <span className="hero__meta-item">
              {config?.venueName || '[VENUE]'}
            </span>
          </div>

          <div ref={ctaRef} className="hero__cta">
            <MagneticButton
              className="btn btn-primary hero__btn-primary"
              onClick={scrollToRSVP}
              id="hero-rsvp-btn"
            >
              Let&apos;s Party
            </MagneticButton>
            <button
              className="btn btn-glass hero__btn-secondary"
              onClick={() => document.getElementById('memories')?.scrollIntoView({ behavior: 'smooth' })}
              id="hero-memories-btn"
            >
              See Last Year
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        ref={scrollIndicatorRef}
        className="hero__scroll-indicator"
        onClick={scrollToNext}
        aria-label="Scroll to next section"
        id="hero-scroll-btn"
      >
        <span className="hero__scroll-label">Scroll</span>
        <ChevronDown size={16} className="hero__scroll-icon" />
      </button>
    </section>
  );
}
