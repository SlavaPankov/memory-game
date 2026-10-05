import { CARDS } from './cards.js';

export const TOTAL_PAIRS = CARDS.length;

const MISMATCH_DELAY = 1000;

export const STATUS = {
  HIDDEN: 'hidden',
  OPEN: 'open',
  MATCHED: 'matched',
};

const shuffle = (items) => {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const createDeck = () => {
  const deck = CARDS.flatMap((card) => [
    { ...card, status: STATUS.HIDDEN },
    { ...card, status: STATUS.HIDDEN },
  ]);

  return shuffle(deck);
};

export const createGame = ({
  onReset,
  onCardsChange,
  onCountersChange,
  onWin,
}) => {
  const state = {
    cards: [],
    firstIndex: null,
    locked: false,
    timerId: null,
    moves: 0,
    pairs: 0,
    finished: false,
  };

  const setStatus = (indexes, status) => {
    indexes.forEach((index) => {
      state.cards[index].status = status;
    });
    onCardsChange(indexes, state.cards);
  };

  const start = () => {
    clearTimeout(state.timerId);

    Object.assign(state, {
      cards: createDeck(),
      firstIndex: null,
      locked: false,
      timerId: null,
      moves: 0,
      pairs: 0,
      finished: false,
    });

    onReset(state);
  };

  const pick = (index) => {
    const card = state.cards[index];

    if (!card || state.locked || state.finished) {
      return;
    }

    if (card.status !== STATUS.HIDDEN) {
      return;
    }

    if (state.firstIndex === null) {
      state.firstIndex = index;
      setStatus([index], STATUS.OPEN);

      return;
    }

    const firstIndex = state.firstIndex;
    state.firstIndex = null;
    state.moves += 1;

    if (state.cards[firstIndex].id === card.id) {
      state.pairs += 1;
      setStatus([firstIndex, index], STATUS.MATCHED);

      onCountersChange(state);

      if (state.pairs === TOTAL_PAIRS) {
        state.finished = true;

        onWin(state.moves);
      }

      return;
    }

    state.locked = true;
    setStatus([index], STATUS.OPEN);
    onCountersChange(state);

    state.timerId = setTimeout(() => {
      state.timerId = null;
      state.locked = false;

      setStatus([firstIndex, index], STATUS.HIDDEN);
    }, MISMATCH_DELAY);
  };

  return { start, pick };
};
