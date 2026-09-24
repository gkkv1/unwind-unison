// ============================================================
// Navbar — Floating premium navigation
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';
import './Navbar.scss';

const NAV_LINKS = [
  { label: 'Memories', href: '#memories' },
  { label: 'Event', href: '#event' },
  { label: 'Menu', href: '#menu' },
  { label: 'RSVP', href: '#rsvp', isHighlight: true },
];

export default function Navbar({ visible = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const easterEggTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);

      // Active section detection
      const sections = ['memories', 'event', 'menu', 'timeline', 'rsvp'];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!visible || !navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );
  }, [visible]);

  const handleNavClick = (href) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  // Easter egg: click logo 3 times
  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    clearTimeout(easterEggTimeout.current);
    easterEggTimeout.current = setTimeout(() => setClickCount(0), 2000);

    if (newCount >= 3) {
      setClickCount(0);
      triggerEasterEgg();
    }
  };

  const triggerEasterEgg = () => {
    const el = document.createElement('div');
    el.className = 'easter-egg-toast';
    el.innerHTML = '🎉 LET THE PARTY BEGIN!';
    document.body.appendChild(el);
    gsap.fromTo(el,
      { opacity: 0, y: 40, scale: 0.8 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out',
        onComplete: () => {
          gsap.to(el, { opacity: 0, y: -20, delay: 2, duration: 0.5, onComplete: () => el.remove() });
        }
      }
    );
  };

  if (!visible) return null;

  return (
    <>
      <nav
        ref={navRef}
        className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="navbar__inner">
          {/* Logo */}
          <button
            className="navbar__logo"
            onClick={handleLogoClick}
            aria-label="UNWIND UNISON — scroll to top"
          >
            <span ref={logoRef} className="navbar__logo-text">UNWIND</span>
            <span className="navbar__logo-dot">✦</span>
            <span className="navbar__logo-sub">UNISON</span>
          </button>

          {/* Desktop Links */}
          <ul className="navbar__links" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <button
                  className={`navbar__link ${link.isHighlight ? 'navbar__link--highlight' : ''} ${
                    activeSection === link.href.replace('#', '') ? 'navbar__link--active' : ''
                  }`}
                  onClick={() => handleNavClick(link.href)}
                  aria-current={activeSection === link.href.replace('#', '') ? 'true' : undefined}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile Toggle */}
          <button
            className="navbar__mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu ${mobileOpen ? 'mobile-menu--open' : ''}`}
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal={mobileOpen}
      >
        <ul className="mobile-menu__links" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <button
                className={`mobile-menu__link ${link.isHighlight ? 'mobile-menu__link--highlight' : ''}`}
                onClick={() => handleNavClick(link.href)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
