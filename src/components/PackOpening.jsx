import { useState, useRef, useLayoutEffect } from 'react';
import PlayerCard from './PlayerCard';
import { getPackCards, RARITIES } from '../data/players';
import './PackOpening.css';

const STAGE = { PACK: 'pack', TEARING: 'tearing', CARDS: 'cards' };
const SWIPE_THRESHOLD = 60;

export default function PackOpening({ pack, onCardsAdded, onClose }) {
  const [stage, setStage] = useState(STAGE.PACK);
  const [cards] = useState(() => getPackCards(pack.id));
  const [dragDelta, setDragDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // carousel
  const [currentIdx, setCurrentIdx] = useState(0);
  const [cardSwipeStart, setCardSwipeStart] = useState(null);
  const [cardSwipeDelta, setCardSwipeDelta] = useState(0);

  const [revealed, setRevealed] = useState([]);
  const [modalIdx, setModalIdx] = useState(null);
  const [modalFlipped, setModalFlipped] = useState(false);

  // card scale for responsive sizing
  const [cardScale, setCardScale] = useState(1);
  const overlayRef = useRef(null);

  useLayoutEffect(() => {
    function calcScale() {
      const w = overlayRef.current?.offsetWidth || window.innerWidth;
      // cap at 1.1 so scaled card (280*1.1=308px) stays within screen height
      setCardScale(Math.min((w * 0.62) / 200, 1.1));
    }
    calcScale();
    window.addEventListener('resize', calcScale);
    return () => window.removeEventListener('resize', calcScale);
  }, []);

  const dragStartX = useRef(null);
  const allRevealed = cards.length > 0 && revealed.length === cards.length;

  function getX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }

  // ── Pack swipe handlers ──
  function onPackDown(e) {
    if (stage !== STAGE.PACK) return;
    dragStartX.current = getX(e);
    setIsDragging(true);
  }
  function onPackMove(e) {
    if (!isDragging || dragStartX.current === null) return;
    setDragDelta(getX(e) - dragStartX.current);
  }
  function onPackUp() {
    if (!isDragging) return;
    setIsDragging(false);
    if (Math.abs(dragDelta) >= SWIPE_THRESHOLD) {
      triggerOpen();
    } else {
      setDragDelta(0);
    }
    dragStartX.current = null;
  }

  function triggerOpen() {
    setStage(STAGE.TEARING);
    setTimeout(() => { setStage(STAGE.CARDS); setDragDelta(0); }, 950);
  }

  // ── Carousel swipe handlers ──
  function onCarouselDown(e) {
    setCardSwipeStart(getX(e));
    setCardSwipeDelta(0);
  }
  function onCarouselMove(e) {
    if (cardSwipeStart === null) return;
    setCardSwipeDelta(getX(e) - cardSwipeStart);
  }
  function onCarouselUp() {
    if (cardSwipeStart === null) return;
    if (cardSwipeDelta < -40 && currentIdx < cards.length - 1) {
      setCurrentIdx(i => i + 1);
    } else if (cardSwipeDelta > 40 && currentIdx > 0) {
      setCurrentIdx(i => i - 1);
    }
    setCardSwipeStart(null);
    setCardSwipeDelta(0);
  }

  // ── Card reveal ──
  function handleCardTap(idx) {
    if (revealed.includes(idx)) return;
    setModalIdx(idx);
    setModalFlipped(false);
    setTimeout(() => setModalFlipped(true), 80);
  }
  function handleModalOk() {
    setRevealed(prev => [...prev, modalIdx]);
    setModalIdx(null);
    // auto-advance to next unrevealed card
    const next = cards.findIndex((_, i) => i > modalIdx && !revealed.includes(i));
    if (next !== -1) setCurrentIdx(next);
  }

  function handleCollect() {
    onCardsAdded(cards);
  }

  const progress = Math.min(Math.abs(dragDelta) / SWIPE_THRESHOLD, 1);
  const rotateY = dragDelta * 0.25;
  const rotateZ = dragDelta * -0.04;

  return (
    <div
      ref={overlayRef}
      className="po-overlay"
      onMouseMove={stage === STAGE.PACK ? onPackMove : onCarouselMove}
      onMouseUp={stage === STAGE.PACK ? onPackUp : onCarouselUp}
      onTouchMove={stage === STAGE.PACK ? onPackMove : onCarouselMove}
      onTouchEnd={stage === STAGE.PACK ? onPackUp : onCarouselUp}
    >
      <button className="po-close" onClick={onClose}>✕</button>

      {/* ══ PACK / TEARING ══ */}
      {(stage === STAGE.PACK || stage === STAGE.TEARING) && (
        <div className="po-pack-stage">
          <div className="po-pack-label-top">{pack.name}</div>

          <div
            className={`po-pack-wrap ${stage === STAGE.TEARING ? 'is-tearing' : 'is-idle'}`}
            style={{ transform: `perspective(700px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)` }}
            onMouseDown={onPackDown}
            onTouchStart={onPackDown}
          >
            <div className="po-flap" style={{ '--c1': pack.color1, '--c2': pack.color2 }}>
              <div className="po-flap-stripe" />
            </div>
            <div
              className="po-tear-line"
              style={{
                opacity: 0.5 + progress * 0.5,
                boxShadow: `0 0 ${8 + progress * 24}px ${4 + progress * 12}px rgba(255,255,255,${0.3 + progress * 0.5})`,
              }}
            />
            <div className="po-body" style={{ '--c1': pack.color1, '--c2': pack.color2 }}>
              <div className="po-body-shine" />
              <div className="po-body-logo">T</div>
              <div className="po-body-name">{pack.name}</div>
              <div className="po-body-count">{pack.count} карточек</div>
            </div>
            <div className="po-edge" style={{ background: pack.color2 }} />

            {/* side glow hints */}
            <div className="po-side-hint po-side-left" style={{ opacity: Math.max(0, 1 - progress * 2) }} />
            <div className="po-side-hint po-side-right" style={{ opacity: Math.max(0, 1 - progress * 2) }} />
          </div>

          {stage === STAGE.PACK && (
            <div className="po-hint-wrap" style={{ opacity: Math.max(0, 1 - progress * 2.5) }}>
              <div className="po-swipe-arrows">
                <span className="po-arrow po-arrow-left">‹</span>
                <span className="po-hint-text">Потяни в сторону</span>
                <span className="po-arrow po-arrow-right">›</span>
              </div>
              <div className="po-hand-anim">👆</div>
            </div>
          )}
        </div>
      )}

      {/* ══ CARDS CAROUSEL ══ */}
      {stage === STAGE.CARDS && (
        <div className="po-cards-stage">
          <div className="po-status">
            {allRevealed
              ? '🎉 Все карточки открыты!'
              : `Нажми на карточку · ${revealed.length} / ${cards.length}`}
          </div>

          {/* Carousel */}
          <div
            className="po-carousel"
            onMouseDown={onCarouselDown}
            onTouchStart={onCarouselDown}
          >
            <div
              className="po-carousel-track"
              style={{ transform: `translateX(calc(-${currentIdx} * 100%))` }}
            >
              {cards.map((card, idx) => (
                <div className="po-carousel-slide" key={idx}>
                  {/* wrapper sized to the visual card dimensions so layout is correct */}
                  <div
                    className="po-card-box"
                    style={{ width: cardScale * 200, height: cardScale * 280 }}
                    onClick={() => handleCardTap(idx)}
                  >
                    <div style={{ transform: `scale(${cardScale})` }}>
                      <PlayerCard player={card} flipped={revealed.includes(idx)} />
                    </div>
                  </div>
                  {/* label sits in normal flow, below the card */}
                  {!revealed.includes(idx) ? (
                    <div className="po-tap-hint-label">Нажми чтобы открыть</div>
                  ) : (
                    <div className="po-opened-label">✓ Открыта</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="po-dots">
            {cards.map((_, idx) => (
              <button
                key={idx}
                className={`po-dot ${idx === currentIdx ? 'po-dot-active' : ''} ${revealed.includes(idx) ? 'po-dot-done' : ''}`}
                onClick={() => setCurrentIdx(idx)}
              />
            ))}
          </div>

          {/* Nav arrows */}
          <div className="po-nav-arrows">
            <button
              className="po-nav-btn"
              onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
              disabled={currentIdx === 0}
            >‹</button>
            <span className="po-nav-count">{currentIdx + 1} / {cards.length}</span>
            <button
              className="po-nav-btn"
              onClick={() => setCurrentIdx(i => Math.min(cards.length - 1, i + 1))}
              disabled={currentIdx === cards.length - 1}
            >›</button>
          </div>

          {allRevealed && (
            <button className="po-collect-btn" onClick={handleCollect}>
              В коллекцию →
            </button>
          )}
        </div>
      )}

      {/* ══ REVEAL MODAL ══ */}
      {modalIdx !== null && (
        <div className="po-modal-bg" onClick={handleModalOk}>
          <div className="po-modal" onClick={e => e.stopPropagation()}>
            {['epic', 'legend'].includes(cards[modalIdx]?.rarity) && (
              <div className="po-modal-glow" style={{ '--glow': RARITIES[cards[modalIdx].rarity].glow }} />
            )}
            <div className={`po-flip ${modalFlipped ? 'po-flip--done' : ''}`}>
              <div className="po-flip-inner">
                <div className="po-flip-front">
                  <PlayerCard player={cards[modalIdx]} flipped={false} />
                </div>
                <div className="po-flip-back">
                  <PlayerCard player={cards[modalIdx]} flipped={true} />
                </div>
              </div>
            </div>
            <div className="po-modal-rarity" style={{ color: RARITIES[cards[modalIdx].rarity].color }}>
              {RARITIES[cards[modalIdx].rarity].label}
            </div>
            <button className="po-modal-ok" onClick={handleModalOk}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
