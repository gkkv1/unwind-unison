// ============================================================
// MenuCard — Animated food/drink card
// ============================================================

import { useRef } from 'react';
import './MenuCard.scss';

const categoryEmoji = {
  'Starters': '🍢',
  'Main Course': '🍛',
  'Salads': '🥗',
  'Desserts': '🍮',
  'Cocktails': '🍸',
  'Mocktails': '🥤',
  'Beer': '🍺',
  'Whisky': '🥃',
  'Vodka': '🍾',
  'Rum': '🍹',
  'Juices': '🧃',
  'Soft Drinks': '🥤',
  'default': '✦',
};

const typeConfig = {
  veg: { label: 'Veg', color: '#22c55e', dotColor: '#22c55e' },
  nonVeg: { label: 'Non-Veg', color: '#ef4444', dotColor: '#ef4444' },
  alcoholic: { label: 'Alcoholic', color: '#a855f7', dotColor: '#a855f7' },
  nonAlcoholic: { label: 'Non-Alc', color: '#38bdf8', dotColor: '#38bdf8' },
  food: { label: '', color: '', dotColor: '' },
};

export default function MenuCard({ item }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    card.style.setProperty('--mouse-x', `${x * 100}%`);
    card.style.setProperty('--mouse-y', `${y * 100}%`);
  };

  const isVeg = item.category === 'veg';
  const isAlcoholic = item.type === 'alcoholic';
  const isDrink = item.category === 'drinks';

  const type = typeConfig[item.type] || typeConfig[item.category] || { label: '', color: '' };
  const emoji = categoryEmoji[item.subCategory] || categoryEmoji['default'];

  return (
    <div
      ref={cardRef}
      className={`menu-card glass-card ${isDrink ? 'menu-card--drink' : ''} ${isAlcoholic ? 'menu-card--alcoholic' : ''}`}
      onMouseMove={handleMouseMove}
      id={`menu-card-${item.id}`}
    >
      {/* Hover spotlight */}
      <div className="menu-card__spotlight" aria-hidden="true" />

      {/* Icon/emoji area */}
      <div className="menu-card__icon-area" aria-hidden="true">
        <span className="menu-card__emoji">{emoji}</span>

        {/* Drink: animated bubbles */}
        {isDrink && (
          <div className="menu-card__bubbles">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bubble" style={{ '--i': i }} aria-hidden="true" />
            ))}
          </div>
        )}

        {/* Food: steam effect */}
        {!isDrink && (
          <div className="menu-card__steam" aria-hidden="true">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="steam-line" style={{ '--i': i }} aria-hidden="true" />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="menu-card__content">
        <div className="menu-card__header">
          <h3 className="menu-card__name">{item.name}</h3>
          {type.label && (
            <span
              className="menu-card__type-dot"
              style={{ background: type.dotColor }}
              aria-label={type.label}
              title={type.label}
            />
          )}
        </div>

        <p className="menu-card__subcategory">{item.subCategory}</p>

        {item.description && (
          <p className="menu-card__description">{item.description}</p>
        )}
      </div>

      {/* Bottom tag */}
      {isVeg && (
        <div className="menu-card__veg-indicator" aria-label="Vegetarian">
          <span className="menu-card__veg-dot" />
        </div>
      )}
    </div>
  );
}
