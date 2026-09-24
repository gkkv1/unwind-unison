// ============================================================
// Footer — Final CTA + social share
// ============================================================

import { Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import RevealOnScroll from './animations/RevealOnScroll';
import './Footer.scss';

export default function Footer({ config }) {
  const [copied, setCopied] = useState(false);
  const c = config || {};

  const handleShare = async () => {
    const eventTitle = c.eventName || 'UNWIND UNISON';
    const shareData = {
      title: `${eventTitle} — The Annual Celebration`,
      text: `Join us for ${eventTitle}! ${c.eventDate || ''} at ${c.venueName || ''}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // User cancelled or error — silently ignore
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToRSVP = () => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__bg" aria-hidden="true">
        <div className="footer__glow" />
      </div>

      <div className="container footer__inner">
        {/* Final CTA */}
        <RevealOnScroll direction="scale">
          <div className="footer__cta">
            <p className="eyebrow footer__eyebrow">Ready?</p>
            <h2 className="footer__title display">
              Ready For<br />
              <span className="gradient-text">Another Memory?</span>
            </h2>
            <p className="footer__subtitle">
              {c.eventDate && c.venueName
                ? `${c.eventDate} · ${c.venueName}`
                : 'Date & Venue — Coming Soon'}
            </p>

            <div className="footer__actions">
              <button
                className="btn btn-primary footer__rsvp-btn"
                onClick={scrollToRSVP}
                id="footer-rsvp-btn"
              >
                RSVP Now
              </button>
              <button
                className="btn btn-glass footer__share-btn"
                onClick={handleShare}
                id="footer-share-btn"
                aria-label="Share this event"
              >
                {copied ? (
                  <><Check size={16} /> Copied!</>
                ) : (
                  <><Share2 size={16} /> Share</>
                )}
              </button>
            </div>
          </div>
        </RevealOnScroll>

        {/* Divider */}
        <div className="divider footer__divider" aria-hidden="true" />

        {/* Footer bottom */}
        <div className="footer__bottom">
          <button
            className="footer__logo"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            id="footer-logo-btn"
          >
            <span className="footer__logo-main display">UNWIND</span>
            <span className="footer__logo-sub">UNISON</span>
          </button>

          <nav className="footer__nav" aria-label="Footer navigation">
            {[
              { label: 'Memories', href: '#memories' },
              { label: 'Event', href: '#event' },
              { label: 'Menu', href: '#menu' },
              { label: 'RSVP', href: '#rsvp' },
            ].map((link) => (
              <button
                key={link.href}
                className="footer__nav-link"
                onClick={() => document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <p className="footer__credit">
            One Night. One Crew. Unwind in Unison · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
