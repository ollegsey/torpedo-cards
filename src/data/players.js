export const RARITIES = {
  common:   { label: 'Обычная',     color: '#9ca3af', glow: '#6b7280', stars: 1 },
  uncommon: { label: 'Необычная',   color: '#34d399', glow: '#10b981', stars: 2 },
  rare:     { label: 'Редкая',      color: '#60a5fa', glow: '#3b82f6', stars: 3 },
  epic:     { label: 'Эпическая',   color: '#c084fc', glow: '#a855f7', stars: 4 },
  legend:   { label: 'Легендарная', color: '#fbbf24', glow: '#f59e0b', stars: 5 },
};

export const players = [
  {
    id: 1,
    name: 'Егор Соколов',
    number: 13,
    position: 'НАП',
    rarity: 'legend',
    image: '/players/sok.webp',
    stats: { goals: 15, assists: 25, pts: 40, games: 65 },
    color1: '#1a1200', color2: '#2a1f00', accent: '#fbbf24',
  },
  {
    id: 2,
    name: 'Василий Атанасов',
    number: 16,
    position: 'НАП',
    rarity: 'epic',
    image: '/players/atan.webp',
    stats: { goals: 21, assists: 15, pts: 36, games: 62 },
    color1: '#1e0a2e', color2: '#2d1b4e', accent: '#c084fc',
  },
  {
    id: 3,
    name: 'Сергей Гончарук',
    number: 27,
    position: 'НАП',
    rarity: 'rare',
    image: '/players/gonch.png',
    stats: { goals: 17, assists: 16, pts: 33, games: 66 },
    color1: '#0a1628', color2: '#0f2544', accent: '#60a5fa',
  },
  {
    id: 4,
    name: 'Богдан Конюшков',
    number: 6,
    position: 'ЗАЩ',
    rarity: 'rare',
    image: '/players/kon.png',
    stats: { goals: 7, assists: 31, pts: 38, games: 67 },
    color1: '#0a1628', color2: '#0f2544', accent: '#60a5fa',
  },
  {
    id: 5,
    name: 'Максим Летунов',
    number: 7,
    position: 'НАП',
    rarity: 'uncommon',
    image: '/players/let.webp',
    stats: { goals: 12, assists: 16, pts: 28, games: 60 },
    color1: '#0a1e14', color2: '#0f3322', accent: '#34d399',
  },
  {
    id: 6,
    name: 'Владислав Фирстов',
    number: 10,
    position: 'НАП',
    rarity: 'uncommon',
    image: '/players/fir.webp',
    stats: { goals: 13, assists: 13, pts: 26, games: 54 },
    color1: '#0a1e14', color2: '#0f3322', accent: '#34d399',
  },
  {
    id: 7,
    name: 'Антон Силаев',
    number: 61,
    position: 'ЗАЩ',
    rarity: 'common',
    image: '/players/sil.webp',
    stats: { goals: 1, assists: 2, pts: 3, games: 61 },
    color1: '#1a1a1a', color2: '#2a2a2a', accent: '#9ca3af',
  },
];

export const packs = [
  {
    id: 'starter',
    name: 'Стартовый набор',
    description: '5 карточек · Шанс редкой карты',
    cost: 'Бесплатно',
    count: 5,
    color1: '#1a1a2e',
    color2: '#e94560',
    available: true,
  },
  {
    id: 'premium',
    name: 'Премиум пак',
    description: '5 карточек · Гарантия эпической',
    cost: '150 монет',
    count: 5,
    color1: '#16213e',
    color2: '#c084fc',
    available: false,
  },
  {
    id: 'legend',
    name: 'Легендарный пак',
    description: '5 карточек · Шанс легендарной',
    cost: '300 монет',
    count: 5,
    color1: '#1a1200',
    color2: '#fbbf24',
    available: false,
  },
];

export function getPackCards(packId) {
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
}
