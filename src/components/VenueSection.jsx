// ============================================================
// VenueSection — Visual venue display
// ============================================================

import { MapPin, ExternalLink } from 'lucide-react';
import RevealOnScroll from './animations/RevealOnScroll';
import './VenueSection.scss';

export default function VenueSection({ config }) {
  const c = config || {};
  const mapsUrl = c.mapsUrl && c.mapsUrl !== '#' ? c.mapsUrl : null;

  return (
    <section className="venue-section" aria-label="Venue information">
      <div className="venue-section__bg" aria-hidden="true">
        <div className="venue-section__bg-gradient" />
        <div className="venue-section__bg-grid" />
      </div>

      <div className="container venue-section__inner">
        <RevealOnScroll direction="left">
          <div className="venue-section__info">
            <p className="eyebrow">Where It Happens</p>
            <h2 className="venue-section__name display">
              {c.venueName || '[VENUE_NAME]'}
            </h2>
            <p className="venue-section__address">
              <MapPin size={14} />
              {c.venueAddress || '[VENUE_ADDRESS]'}
            </p>
            <p className="venue-section__location">
              {c.location || '[LOCATION]'}
            </p>

            {mapsUrl ? (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary venue-section__map-btn"
                id="venue-maps-btn"
                aria-label={`View ${c.venueName || 'venue'} on Google Maps`}
              >
                <MapPin size={16} />
                View Location
                <ExternalLink size={14} />
              </a>
            ) : (
              <button
                className="btn btn-glass venue-section__map-btn"
                id="venue-maps-placeholder-btn"
                onClick={() => alert('Map URL will be configured via Google Sheets')}
                aria-label="Map URL not configured"
              >
                <MapPin size={16} />
                [MAPS_URL] — Configure in Sheets
              </button>
            )}
          </div>
        </RevealOnScroll>

        <RevealOnScroll direction="right">
          <div className="venue-section__visual" aria-hidden="true">
            <div className="venue-section__map-visual">
              <div className="venue-map-placeholder">
                <div className="venue-map__grid" />
                <div className="venue-map__pin">
                  <MapPin size={28} />
                </div>
                <div className="venue-map__ripple" />
                <div className="venue-map__ripple venue-map__ripple--2" />
                <div className="venue-map__label">{c.venueName || 'VENUE'}</div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
