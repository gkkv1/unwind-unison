// ============================================================
// MemoryLane — Horizontal scroll gallery with pinned section
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MediaCard from './MediaCard';
import Lightbox from './Lightbox';
import RevealOnScroll from './animations/RevealOnScroll';
import './MemoryLane.scss';

gsap.registerPlugin(ScrollTrigger);

export default function MemoryLane({ media }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const enabledMedia = (media || []).filter((m) => m.enabled !== false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !trackRef.current || enabledMedia.length === 0) return;

    const track = trackRef.current;
    const cards = track.querySelectorAll('.media-card');
    if (cards.length === 0) return;

    // Calculate horizontal scroll distance
    const getScrollDistance = () => {
      const totalWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      return -(totalWidth - viewportWidth + 80);
    };

    const ctx = gsap.context(() => {
      // Entrance animation for title
      gsap.fromTo('.memory-lane__eyebrow, .memory-lane__heading, .memory-lane__subheading',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          }
        }
      );

      // Horizontal scroll
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        gsap.to(track, {
          x: getScrollDistance,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${Math.max(enabledMedia.length * 350, 800)}`,
            pin: true,
            anticipatePin: 1,
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        });

        // Card stagger reveal
        gsap.fromTo(cards,
          { opacity: 0, y: 60, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              once: true,
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [enabledMedia.length]);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const goPrev = () => setLightboxIndex((i) => (i > 0 ? i - 1 : enabledMedia.length - 1));
  const goNext = () => setLightboxIndex((i) => (i < enabledMedia.length - 1 ? i + 1 : 0));

  return (
    <>
      <section
        ref={sectionRef}
        className="memory-lane section"
        id="memories"
        aria-label="Memory Lane section"
      >
        {/* Header */}
        <div className="memory-lane__header container">
          <p className="memory-lane__eyebrow eyebrow">Chapter 1 Memories</p>
          <h2 className="memory-lane__heading display">
            UNWIND UNISON 1.0<br />
            <span className="gradient-text">Was Just The Beginning.</span>
          </h2>
          <p className="memory-lane__subheading">
            Every great night leaves a mark. Relive what we built together before 2.0 takes over.
          </p>
        </div>

        {/* Horizontal scroll track */}
        <div className="memory-lane__track-wrapper" aria-label="Memory gallery">
          <div ref={trackRef} className="memory-lane__track">
            <div className="memory-lane__spacer" aria-hidden="true" />
            {enabledMedia.length > 0 ? (
              enabledMedia.map((item, idx) => (
                <MediaCard
                  key={item.id || idx}
                  item={item}
                  index={idx}
                  onClick={openLightbox}
                />
              ))
            ) : (
              // Empty state
              <div className="memory-lane__empty" role="status">
                <p>Photos and videos from last year will appear here.</p>
              </div>
            )}
            <div className="memory-lane__spacer" aria-hidden="true" />
          </div>
        </div>

        {/* Mobile scroll hint */}
        <div className="memory-lane__scroll-hint" aria-hidden="true">
          <span>Swipe to explore</span>
          <div className="memory-lane__scroll-arrows">→</div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && enabledMedia.length > 0 && (
        <Lightbox
          items={enabledMedia}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </>
  );
}
