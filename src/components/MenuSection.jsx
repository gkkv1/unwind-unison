// ============================================================
// MenuSection — Interactive menu with animated filter tabs
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MenuCard from './MenuCard';
import RevealOnScroll from './animations/RevealOnScroll';
import './MenuSection.scss';

gsap.registerPlugin(ScrollTrigger);

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'veg', label: 'Veg' },
  { id: 'nonVeg', label: 'Non-Veg' },
  { id: 'drinks', label: 'Drinks' },
];

const DRINK_FILTERS = [
  { id: 'all-drinks', label: 'All Drinks' },
  { id: 'alcoholic', label: 'Alcoholic' },
  { id: 'nonAlcoholic', label: 'Non-Alcoholic' },
];

export default function MenuSection({ menu }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeDrinkFilter, setActiveDrinkFilter] = useState('all-drinks');
  const gridRef = useRef(null);
  const sectionRef = useRef(null);
  const indicatorRef = useRef(null);
  const tabsRef = useRef(null);

  const enabledMenu = (menu || []).filter((item) => item.enabled !== false);

  const getFiltered = () => {
    let items = enabledMenu;

    if (activeFilter !== 'all') {
      items = items.filter((item) => item.category === activeFilter);
    }

    if (activeFilter === 'drinks' && activeDrinkFilter !== 'all-drinks') {
      items = items.filter((item) => item.type === activeDrinkFilter);
    }

    return items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  };

  const filtered = getFiltered();

  // Animate cards when filter changes
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll('.menu-card');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    gsap.fromTo(cards,
      { opacity: 0, y: 20, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.05,
        duration: 0.4,
        ease: 'power3.out',
      }
    );
  }, [activeFilter, activeDrinkFilter]);

  // Update sliding tab indicator
  const handleFilterClick = (id) => {
    setActiveFilter(id);

    // Move indicator
    const tabsEl = tabsRef.current;
    if (!tabsEl || !indicatorRef.current) return;
    const btn = tabsEl.querySelector(`[data-filter="${id}"]`);
    if (!btn) return;
    const btnRect = btn.getBoundingClientRect();
    const tabsRect = tabsEl.getBoundingClientRect();
    gsap.to(indicatorRef.current, {
      x: btnRect.left - tabsRect.left,
      width: btnRect.width,
      duration: 0.3,
      ease: 'power3.out',
    });
  };

  // Initialize indicator on first render
  useEffect(() => {
    const tabsEl = tabsRef.current;
    if (!tabsEl || !indicatorRef.current) return;
    const btn = tabsEl.querySelector('[data-filter="all"]');
    if (!btn) return;
    const btnRect = btn.getBoundingClientRect();
    const tabsRect = tabsEl.getBoundingClientRect();
    gsap.set(indicatorRef.current, {
      x: btnRect.left - tabsRect.left,
      width: btnRect.width,
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="menu-section section"
      id="menu"
      aria-label="Menu section"
    >
      <div className="menu-section__bg" aria-hidden="true">
        <div className="menu-section__bg-gradient" />
      </div>

      <div className="container">
        {/* Header */}
        <RevealOnScroll>
          <div className="menu-section__header">
            <p className="eyebrow">The Spread</p>
            <h2 className="menu-section__title display">
              What&apos;s On<br />
              <span className="gradient-text">The Table?</span>
            </h2>
          </div>
        </RevealOnScroll>

        {/* Filter Tabs */}
        <div className="menu-section__filters-wrap">
          <div ref={tabsRef} className="menu-section__tabs" role="tablist" aria-label="Menu category filter">
            <div ref={indicatorRef} className="menu-section__tab-indicator" aria-hidden="true" />
            {FILTERS.map((f) => (
              <button
                key={f.id}
                data-filter={f.id}
                className={`menu-section__tab ${activeFilter === f.id ? 'menu-section__tab--active' : ''}`}
                onClick={() => handleFilterClick(f.id)}
                role="tab"
                aria-selected={activeFilter === f.id}
                aria-controls="menu-grid"
                id={`menu-tab-${f.id}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Drink sub-filter */}
          {activeFilter === 'drinks' && (
            <div className="menu-section__drink-filters" role="group" aria-label="Drink type filter">
              {DRINK_FILTERS.map((f) => (
                <button
                  key={f.id}
                  className={`menu-section__drink-filter ${activeDrinkFilter === f.id ? 'menu-section__drink-filter--active' : ''}`}
                  onClick={() => setActiveDrinkFilter(f.id)}
                  id={`drink-filter-${f.id}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Menu Grid */}
        <div
          ref={gridRef}
          className="menu-section__grid"
          id="menu-grid"
          role="tabpanel"
          aria-label={`${activeFilter} menu items`}
        >
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))
          ) : (
            <div className="menu-section__empty" role="status">
              <p>No items in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
