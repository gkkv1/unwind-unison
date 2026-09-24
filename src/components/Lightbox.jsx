// ============================================================
// Lightbox — Fullscreen media viewer
// ============================================================

import { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import './Lightbox.scss';

export default function Lightbox({ items, currentIndex, onClose, onPrev, onNext }) {
  const item = items?.[currentIndex];

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onPrev();
    if (e.key === 'ArrowRight') onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  if (!item) return null;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Media viewer: ${item.caption || ''}`}
      onClick={onClose}
    >
      <div className="lightbox__inner" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button
          className="lightbox__close"
          onClick={onClose}
          aria-label="Close lightbox"
          id="lightbox-close-btn"
        >
          <X size={20} />
        </button>

        {/* Media */}
        <div className="lightbox__media">
          {item.type === 'video' ? (
            <video
              src={item.url}
              controls
              autoPlay
              playsInline
              className="lightbox__video"
              aria-label={item.caption || 'Party video'}
            />
          ) : (
            <img
              src={item.url || '/placeholder-memory.jpg'}
              alt={item.caption || 'Party memory'}
              className="lightbox__image"
            />
          )}
        </div>

        {/* Caption */}
        {item.caption && (
          <div className="lightbox__caption">
            <p>{item.caption}</p>
            {item.year && <span className="lightbox__year">{item.year}</span>}
          </div>
        )}

        {/* Navigation */}
        <button
          className="lightbox__nav lightbox__nav--prev"
          onClick={onPrev}
          aria-label="Previous"
          id="lightbox-prev-btn"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="lightbox__nav lightbox__nav--next"
          onClick={onNext}
          aria-label="Next"
          id="lightbox-next-btn"
        >
          <ChevronRight size={24} />
        </button>

        {/* Counter */}
        <div className="lightbox__counter" aria-live="polite">
          {currentIndex + 1} / {items.length}
        </div>
      </div>
    </div>
  );
}
