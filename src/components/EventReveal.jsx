// ============================================================
// EventReveal — "And now we do it again." transition
// ============================================================

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './EventReveal.scss';

gsap.registerPlugin(ScrollTrigger);

export default function EventReveal() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const words = sectionRef.current.querySelectorAll('.event-reveal__word');
      const divider = sectionRef.current.querySelector('.event-reveal__divider');

      gsap.fromTo(words,
        { opacity: 0, y: 50, rotateX: 20 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.15,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            once: true,
          },
        }
      );

      if (divider) {
        gsap.fromTo(divider,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            ease: 'power3.inOut',
            delay: 0.6,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="event-reveal section"
      aria-label="Event reveal"
    >
      <div className="event-reveal__container container">
        <div className="event-reveal__text" aria-label="And now... we do it again.">
          <span className="event-reveal__word event-reveal__word--and">And</span>
          <span className="event-reveal__word event-reveal__word--now">Now...</span>
        </div>
        <div className="event-reveal__divider" aria-hidden="true" />
        <div className="event-reveal__bottom">
          <p className="event-reveal__we display">
            <span className="event-reveal__word">We</span>
          </p>
          <p className="event-reveal__do display">
            <span className="event-reveal__word">Do</span>
          </p>
          <p className="event-reveal__it display">
            <span className="event-reveal__word gradient-text">It Again.</span>
          </p>
        </div>
      </div>

      {/* Background ambient glow */}
      <div className="event-reveal__bg" aria-hidden="true">
        <div className="event-reveal__glow" />
      </div>
    </section>
  );
}
