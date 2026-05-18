import { useState } from 'react';
import PlayerCard from './PlayerCard';
import { players, RARITIES } from '../data/players';
import './CollectionScreen.css';

const FILTERS = ['Все', 'Легендарные', 'Эпические', 'Редкие', 'Необычные', 'Обычные'];
const RARITY_MAP = {
  'Легендарные': 'legend', 'Эпические': 'epic', 'Редкие': 'rare',
  'Необычные': 'uncommon', 'Обычные': 'common',
};

export default function CollectionScreen({ collection }) {
  const [filter, setFilter] = useState('Все');
  const [selected, setSelected] = useState(null);

  const displayCards = collection.length > 0 ? collection : [];
  const totalUnique = [...new Set(displayCards.map(c => c.id))].length;

  const filtered = filter === 'Все'
    ? displayCards
    : displayCards.filter(c => c.rarity === RARITY_MAP[filter]);

  const uniqueFiltered = filtered.filter((c, idx, arr) => arr.findIndex(x => x.id === c.id) === idx);

  return (
    <div className="collection-screen">
      <div className="collection-header">
        <div className="collection-title">Коллекция</div>
        <div className="collection-stats">
          <div className="cstat">
            <span className="cstat-val">{totalUnique}</span>
            <span className="cstat-label">Уникальных</span>
          </div>
          <div className="cstat-divider" />
          <div className="cstat">
            <span className="cstat-val">{players.length}</span>
            <span className="cstat-label">Всего</span>
          </div>
          <div className="cstat-divider" />
          <div className="cstat">
            <span className="cstat-val">{Math.round(totalUnique / players.length * 100)}%</span>
            <span className="cstat-label">Заполнено</span>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${totalUnique / players.length * 100}%` }} />
        </div>
      </div>

      <div className="filter-row">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'filter-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {uniqueFiltered.length === 0 ? (
        <div className="collection-empty">
          <div className="empty-icon">🃏</div>
          <div className="empty-text">Здесь пусто</div>
          <div className="empty-sub">Открой пак, чтобы получить карточки</div>
        </div>
      ) : (
        <div className="cards-grid">
          {uniqueFiltered.map((card, idx) => (
            <div key={card.id + idx} className="grid-card" onClick={() => setSelected(card)}>
              <div className="grid-card-zoom">
                <PlayerCard player={card} flipped={true} />
              </div>
              <div className="grid-card-count">
                ×{displayCards.filter(c => c.id === card.id).length}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="card-modal-overlay" onClick={() => setSelected(null)}>
          <div className="card-modal" onClick={e => e.stopPropagation()}>
            <PlayerCard player={selected} flipped={true} />
            <div className="modal-rarity" style={{ color: RARITIES[selected.rarity].color }}>
              {RARITIES[selected.rarity].label}
            </div>
            <div className="modal-copies">
              В коллекции: ×{collection.filter(c => c.id === selected.id).length}
            </div>
            <button className="modal-close" onClick={() => setSelected(null)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}
