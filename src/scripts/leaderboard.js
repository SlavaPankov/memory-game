import { el } from './dom.js';

const STORAGE_KEY = 'memory-game:results';
const MAX_RESULTS = 10;

const isValidResult = (result) => {
  return (
    typeof result === 'object' &&
    result !== null &&
    Number.isInteger(result.moves) &&
    result.moves > 0 &&
    Number.isFinite(result.timestamp)
  );
};

const sortResults = (results) => {
  return [...results].sort(
    (a, b) => a.moves - b.moves || a.timestamp - b.timestamp,
  );
};

export const loadResults = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!Array.isArray(parsed)) {
      return [];
    }

    return sortResults(parsed.filter(isValidResult)).slice(0, MAX_RESULTS);
  } catch {
    return [];
  }
};

export const saveResult = (moves) => {
  const results = sortResults([
    ...loadResults(),
    { moves, timestamp: Date.now() },
  ]).slice(0, MAX_RESULTS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch {}
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${day}.${month}.${date.getFullYear()}`;
};

export const createLeaderboardContent = (results) => {
  if (results.length === 0) {
    return [
      el('p', {
        text: 'Пока нет результатов. Найдите все пары, чтобы попасть в таблицу.',
      }),
    ];
  }

  const head = el('thead', {}, [
    el('tr', {}, [
      el('th', { text: 'Место', attrs: { scope: 'col' } }),
      el('th', { text: 'Ходы', attrs: { scope: 'col' } }),
      el('th', { text: 'Дата', attrs: { scope: 'col' } }),
    ]),
  ]);

  const rows = results.map((result, index) =>
    el('tr', {}, [
      el('td', { text: index + 1 }),
      el('td', { text: result.moves }),
      el('td', { text: formatDate(result.timestamp) }),
    ]),
  );

  return [el('table', { cls: 'leaderboard' }, [head, el('tbody', {}, rows)])];
};
