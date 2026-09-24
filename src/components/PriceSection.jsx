// ============================================================
// PriceSection — Visual price reveal
// ============================================================

import { Check } from 'lucide-react';
import RevealOnScroll from './animations/RevealOnScroll';
import './PriceSection.scss';

const INCLUSIONS = [
  'Full dinner buffet',
  'Welcome drinks',
  'Live music & DJ',
  'Games & activities',
  'Memories for life',
];

export default function PriceSection({ config }) {
  const c = config || {};
  const price = c.price;

  return (
    <section className="price-section" aria-label="Pricing information">
      <div className="price-section__bg" aria-hidden="true">
        <div className="price-section__orb" />
      </div>

      <div className="container price-section__inner">
        <RevealOnScroll direction="scale">
          <div className="price-card">
            <div className="price-card__header">
              <p className="eyebrow price-card__eyebrow">Entry Pass</p>
              <div className="price-card__amount">
                {price ? (
                  <>
                    <span className="price-card__currency">₹</span>
                    <span className="price-card__number">{price}</span>
                  </>
                ) : (
                  <span className="price-card__placeholder">[PRICE]</span>
                )}
              </div>
              <p className="price-card__per">Per Person</p>
            </div>

            <div className="price-card__divider" aria-hidden="true" />

            <ul className="price-card__inclusions" aria-label="What's included">
              {INCLUSIONS.map((item) => (
                <li key={item} className="price-card__inclusion-item">
                  <span className="price-card__check" aria-hidden="true">
                    <Check size={13} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="price-card__glow" aria-hidden="true" />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
