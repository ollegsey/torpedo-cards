import { useState, useEffect } from 'react';
import PacksScreen from './components/PacksScreen';
import CollectionScreen from './components/CollectionScreen';
import { players } from './data/players';
import './App.css';

const TABS = [
  { id: 'packs', label: 'Паки', icon: '🎴' },
  { id: 'collection', label: 'Коллекция', icon: '⭐' },
];

export default function App() {
  const [tab, setTab] = useState('packs');
  const [theme, setTheme] = useState(
    () => localStorage.getItem('torpedo_theme') || 'dark'
  );
  const [collection, setCollection] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('torpedo_collection') || '[]');
      const playerMap = new Map(players.map(p => [p.id, p]));
      // keep only current players, refresh their data (image/stats may have changed)
      const valid = stored.filter(c => playerMap.has(c.id)).map(c => playerMap.get(c.id));
      if (valid.length !== stored.length) {
        localStorage.setItem('torpedo_collection', JSON.stringify(valid));
      }
      return valid;
    } catch { return []; }
  });

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('torpedo_theme', next);
  }

  function addCards(cards) {
    setCollection(prev => {
      const updated = [...prev, ...cards];
      localStorage.setItem('torpedo_collection', JSON.stringify(updated));
      return updated;
    });
    setTab('collection');
  }

  return (
    <div className="app" data-theme={theme}>
      <div className="app-bg">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
      </div>

      <div className="app-header">
        <img src="/torpedo-logo.svg" className="header-logo-img" alt="Torpedo" />
        <div className="header-title">
          Torpedo <span className="header-title-accent">CARDS</span>
        </div>
        <button className="theme-toggle" onClick={toggleTheme} title="Сменить тему">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <main className="app-content">
        {tab === 'packs' && <PacksScreen onCardsAdded={addCards} />}
        {tab === 'collection' && <CollectionScreen collection={collection} />}
      </main>

      <nav className="bottom-nav">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`nav-btn ${tab === t.id ? 'nav-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span className="nav-icon">{t.icon}</span>
            <span className="nav-label">{t.label}</span>
            {tab === t.id && <div className="nav-indicator" />}
          </button>
        ))}
      </nav>
    </div>
  );
}
