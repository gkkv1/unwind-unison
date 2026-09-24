// ============================================================
// Timeline — Animated party timeline
// ============================================================

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RevealOnScroll from './animations/RevealOnScroll';
import './Timeline.scss';

gsap.registerPlugin(ScrollTrigger);

const timelineIcons = ['🚪', '🥂', '🍽️', '🎵', '🎮', '💃', '📸', '👋'];

export default function Timeline({ timeline }) {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  const items = (timeline || [])
    .filter((t) => t.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !lineRef.current) return;

    const ctx = gsap.context(() => {
      // Animate the vertical progress line
      gsap.fromTo(lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 60%',
            scrub: 1,
          },
        }
      );

      // Animate each item
      const itemEls = sectionRef.current.querySelectorAll('.timeline-item');
      const isMobile = window.innerWidth <= 767;
      itemEls.forEach((el, i) => {
        const xOffset = isMobile ? -30 : (i % 2 === 0 ? -40 : 40);
        gsap.fromTo(el,
          { opacity: 0, x: xOffset },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [items.length]);

  return (
    <section
      ref={sectionRef}
      className="timeline section"
      id="timeline"
      aria-label="Party timeline"
    >
      <div className="timeline__bg" aria-hidden="true">
        <div className="timeline__bg-glow" />
      </div>

      <div className="container">
        <RevealOnScroll>
          <div className="timeline__header">
            <p className="eyebrow">The Night</p>
            <h2 className="timeline__title display">
              How The Night<br />
              <span className="gradient-text">Unfolds</span>
            </h2>
          </div>
        </RevealOnScroll>

        <div className="timeline__container">
          {/* Vertical line */}
          <div className="timeline__line-track" aria-hidden="true">
            <div ref={lineRef} className="timeline__line" />
          </div>

          {/* Items */}
          <div className="timeline__items" role="list">
            {items.length > 0 ? items.map((item, idx) => (
              <div
                key={item.order || idx}
                className={`timeline-item ${idx % 2 === 0 ? 'timeline-item--left' : 'timeline-item--right'}`}
                role="listitem"
              >
                <div className="timeline-item__dot" aria-hidden="true">
                  <span className="timeline-item__icon">
                    {timelineIcons[idx % timelineIcons.length]}
                  </span>
                </div>
                <div className="timeline-item__card glass-card">
                  {/* {item.time && (
                    <p className="timeline-item__time">{item.time}</p>
                  )} */}
                  <h3 className="timeline-item__title">{item.title}</h3>
                  {item.description && (
                    <p className="timeline-item__desc">{item.description}</p>
                  )}
                </div>
              </div>
            )) : (
              <p className="timeline__empty" role="status">Timeline will be configured soon.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
