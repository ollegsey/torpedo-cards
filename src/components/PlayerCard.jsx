import { RARITIES } from '../data/players';
import './PlayerCard.css';

const POSITION_ICONS = {
  'НАП': '🏒', 'ЗАЩ': '🛡️', 'ВРТ': '🥅',
  'ЛВ': '🏒', 'ПВ': '🏒', 'Ц': '⭕',
};

export default function PlayerCard({ player, flipped = true, onClick }) {
  const rarity = RARITIES[player.rarity];

  return (
    <div
      className="card-wrapper"
      onClick={onClick}
      style={{ '--glow': rarity.glow, '--accent': player.accent }}
    >
      <div className={`card ${flipped ? 'card-face' : 'card-back'} rarity-${player.rarity}`}>

        {/* ── Back ── */}
        {!flipped ? (
          <div className="card-back-face">
            <img src="/torpedo-logo.svg" className="card-back-logo-img" alt="" />
            <div className="card-back-team">ТОРПЕДО</div>
          </div>
        ) : (
          /* ── Front ── */
          <>
            {['epic', 'legend'].includes(player.rarity) && (
              <div className="card-sparkles">
                {[...Array(8)].map((_, i) => (
                  <span key={i} className="sparkle" style={{ '--i': i }} />
                ))}
              </div>
            )}

            <div className="card-header">
              <span className="card-rarity-label">{rarity.label}</span>
              <span className="card-number">#{player.number}</span>
            </div>

            {/* Player art — photo or silhouette fallback */}
            <div className="card-player-art">
              {player.image ? (
                <img
                  src={player.image}
                  alt={player.name}
                  className="player-photo"
                  draggable={false}
                />
              ) : (
                <div className="player-silhouette">
                  <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="50" cy="22" rx="16" ry="18" fill="currentColor" opacity="0.7"/>
                    <path d="M20 55 Q50 38 80 55 L85 110 Q50 120 15 110 Z" fill="currentColor" opacity="0.6"/>
                    <path d="M20 55 L5 85" stroke="currentColor" strokeWidth="10" strokeLinecap="round" opacity="0.6"/>
                    <path d="M80 55 L95 85" stroke="currentColor" strokeWidth="10" strokeLinecap="round" opacity="0.6"/>
                  </svg>
                </div>
              )}
              <div className="player-glow-orb" />
            </div>

            <div className="card-info">
              <div className="card-name">{player.name}</div>
              <div className="card-position">
                <span className="pos-icon">{POSITION_ICONS[player.position] || '🏒'}</span>
                <span>{player.position}</span>
              </div>
            </div>

            <div className="card-stats">
              <div className="stat">
                <span className="stat-val">{player.stats.goals ?? player.stats.saves ?? '—'}</span>
                <span className="stat-label">{player.stats.saves != null ? 'Сэйвы' : 'Голы'}</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-val">{player.stats.assists ?? player.stats.gaa ?? '—'}</span>
                <span className="stat-label">{player.stats.gaa != null ? 'GAA' : 'Передачи'}</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-val">{player.stats.pts ?? player.stats.games ?? '—'}</span>
                <span className="stat-label">{player.stats.gaa != null ? 'Игры' : 'Очки'}</span>
              </div>
            </div>

            <div className="card-stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`star ${i < rarity.stars ? 'star-on' : 'star-off'}`}>◆</span>
              ))}
            </div>

            <div className="card-team">ТОРПЕДО</div>

            {player.rarity === 'legend' && <div className="card-holo-overlay" />}
          </>
        )}
      </div>
    </div>
  );
}
