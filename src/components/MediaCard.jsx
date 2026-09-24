// ============================================================
// MediaCard — Individual memory card with tilt + reveal
// ============================================================

import { useRef, useState } from 'react';
import { Play, Image } from 'lucide-react';
import './MediaCard.scss';

export default function MediaCard({ item, index, onClick }) {
  const cardRef = useRef(null);
  const [imageError, setImageError] = useState(false);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(10px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)';
    }
  };

  // Placeholder gradient based on index
  const gradients = [
    'linear-gradient(135deg, #1a0533, #2d1060)',
    'linear-gradient(135deg, #1a0028, #3d0a40)',
    'linear-gradient(135deg, #0a0a20, #1a0535)',
    'linear-gradient(135deg, #200518, #40102a)',
    'linear-gradient(135deg, #0d1a40, #051535)',
  ];
  const placeholderBg = gradients[index % gradients.length];

  return (
    <div
      ref={cardRef}
      className={`media-card media-card--${item.type}`}
      style={{ '--delay': `${index * 0.1}s` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(index)}
      role="button"
      tabIndex={0}
      aria-label={`View ${item.caption || 'memory'}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(index); }}
      id={`media-card-${index}`}
    >
      <div className="media-card__media">
        {item.url && !imageError ? (
          item.type === 'video' ? (
            <video
              src={item.url}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="media-card__video"
              aria-label={item.caption || 'Party video'}
            />
          ) : (
            <img
              src={item.url}
              alt={item.caption || 'Party memory'}
              className="media-card__image"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          )
        ) : (
          // Placeholder
          <div
            className="media-card__placeholder"
            style={{ background: placeholderBg }}
            aria-hidden="true"
          >
            <div className="media-card__placeholder-icon">
              {item.type === 'video' ? (
                <Play size={32} />
              ) : (
                <Image size={32} />
              )}
            </div>
            <div className="media-card__placeholder-text">
              <span>Memory {index + 1}</span>
              <span className="media-card__placeholder-year">{item.year}</span>
            </div>
            {/* Decorative elements */}
            <div className="media-card__placeholder-orb" aria-hidden="true" />
          </div>
        )}

        {/* Video play overlay */}
        {item.type === 'video' && (
          <div className="media-card__play-overlay" aria-hidden="true">
            <div className="media-card__play-btn">
              <Play size={20} fill="white" />
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="media-card__overlay" aria-hidden="true">
          <div className="media-card__expand-icon">↗</div>
        </div>
      </div>

      {/* Caption */}
      <div className="media-card__caption">
        <span className="media-card__caption-text">{item.caption || `Memory ${index + 1}`}</span>
        {item.year && (
          <span className="tag tag-purple media-card__year">{item.year}</span>
        )}
      </div>
    </div>
  );
}
