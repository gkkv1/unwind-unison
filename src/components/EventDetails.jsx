// ============================================================
// EventDetails — Interactive event info cards
// ============================================================

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Clock, MapPin, Star, Shirt, Music } from 'lucide-react';
import RevealOnScroll from './animations/RevealOnScroll';
import './EventDetails.scss';

gsap.registerPlugin(ScrollTrigger);

function InfoCard({ icon: Icon, label, value, accent = false, large = false, delay = 0 }) {
  return (
    <div
      className={`info-card glass-card ${accent ? 'info-card--accent' : ''} ${large ? 'info-card--large' : ''}`}
      style={{ '--card-delay': `${delay}s` }}
    >
      <div className="info-card__icon">
        <Icon size={18} />
      </div>
      <div className="info-card__content">
        <span className="info-card__label">{label}</span>
        <p className={`info-card__value ${large ? 'info-card__value--large' : ''}`}>{value}</p>
      </div>
      {accent && <div className="info-card__glow" aria-hidden="true" />}
    </div>
  );
}

export default function EventDetails({ config }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.info-card',
        { opacity: 0, y: 50, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const c = config || {};

  return (
    <section
      ref={sectionRef}
      className="event-details section"
      id="event"
      aria-label="Event details"
    >
      <div className="container">
        <RevealOnScroll>
          <div className="event-details__header">
            <p className="eyebrow">This Year's Event</p>
            <h2 className="event-details__title display">
              {c.eventName || '[EVENT_NAME]'}
            </h2>
          </div>
        </RevealOnScroll>

        <div className="event-details__grid">
          <InfoCard
            icon={Calendar}
            label="Date"
            value={c.eventDay ? `${c.eventDay}, ${c.eventDate}` : c.eventDate || '[EVENT_DATE]'}
            large
            delay={0}
          />
          <InfoCard
            icon={Clock}
            label="Time"
            value={c.endTime ? `${c.startTime} – ${c.endTime}` : c.startTime || '[TIME]'}
            delay={0.1}
          />
          <InfoCard
            icon={MapPin}
            label="Venue"
            value={c.venueName || '[VENUE_NAME]'}
            accent
            delay={0.2}
          />
          <InfoCard
            icon={Star}
            label="Location"
            value={c.location || '[LOCATION]'}
            delay={0.3}
          />
          <InfoCard
            icon={Shirt}
            label="Dress Code"
            value={c.dressCode || '[DRESS_CODE]'}
            delay={0.4}
          />
          <InfoCard
            icon={Music}
            label="Entry"
            value={c.price ? `₹${c.price} per person` : '[PRICE]'}
            accent
            delay={0.5}
          />
        </div>
      </div>
    </section>
  );
}
