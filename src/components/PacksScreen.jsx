import { useState } from 'react';
import { packs } from '../data/players';
import PackOpening from './PackOpening';
import './PacksScreen.css';

const visiblePacks = packs.filter(p => p.id === 'starter');

export default function PacksScreen({ onCardsAdded }) {
  const [activePack, setActivePack] = useState(null);

  function handleCardsAdded(cards) {
    setActivePack(null);
    onCardsAdded(cards);
  }

  return (
    <div className="packs-screen">
      <div className="packs-header">
        <div className="packs-title">Наборы карточек</div>
        <div className="packs-subtitle">Собери всю коллекцию Торпедо</div>
      </div>

      <div className="packs-list">
        {visiblePacks.map(pack => (
          <div
            key={pack.id}
            className="pack-card"
            onClick={() => setActivePack(pack)}
            style={{ '--c1': pack.color1, '--c2': pack.color2 }}
          >
            <div className="pack-card-visual">
              <div className="pack-card-glow" />
              <div className="pack-card-art">
                <div className="pack-art-letter">T</div>
              </div>
            </div>
            <div className="pack-card-info">
              <div className="pack-card-name">{pack.name}</div>
              <div className="pack-card-desc">{pack.description}</div>
              <div className="pack-card-cost cost-free">{pack.cost}</div>
            </div>
            <div className="pack-card-arrow">›</div>
          </div>
        ))}
      </div>

      <div className="packs-info">
        <div className="info-item">
          <span className="info-icon">✦</span>
          <span>Открывай паки каждый день</span>
        </div>
        <div className="info-item">
          <span className="info-icon">⭐</span>
          <span>Собирай редкие карточки</span>
        </div>
      </div>

      {activePack && (
        <PackOpening
          pack={activePack}
          onClose={() => setActivePack(null)}
          onCardsAdded={handleCardsAdded}
        />
      )}
    </div>
  );
}
