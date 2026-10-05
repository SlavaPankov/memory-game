import { el } from './dom.js';
import { STATUS, TOTAL_PAIRS } from './game.js';

const getCardLabel = (index, card) => {
  const number = index + 1;

  if (card.status === STATUS.HIDDEN) {
    return `Карточка ${number}, закрыта`;
  }

  if (card.status === STATUS.MATCHED) {
    return `Карточка ${number}: ${card.label}, пара найдена`;
  }

  return `Карточка ${number}: ${card.label}`;
};

export const createBoard = ({ onPick }) => {
  let buttons = [];

  const element = el('div', {
    cls: 'board',
    on: {
      click(event) {
        const button = event.target.closest('.card');

        if (button) {
          onPick(Number(button.dataset.index));
        }
      },
    },
  });

  const updateCard = (index, card) => {
    const button = buttons[index];
    const isHidden = card.status === STATUS.HIDDEN;

    button.classList.toggle('card--open', card.status === STATUS.OPEN);
    button.classList.toggle('card--matched', card.status === STATUS.MATCHED);
    button.setAttribute('aria-label', getCardLabel(index, card));

    const face = isHidden
      ? []
      : [
          el('span', {
            cls: 'card__face',
            text: card.symbol,
            attrs: { 'aria-hidden': 'true' },
          }),
        ];

    button.replaceChildren(...face);
  };

  const render = (cards) => {
    buttons = cards.map((_, index) =>
      el('button', {
        cls: 'card',
        attrs: { type: 'button', 'data-index': index },
      }),
    );

    element.replaceChildren(...buttons);
    cards.forEach((card, index) => updateCard(index, card));
  };

  const update = (indexes, cards) => {
    indexes.forEach((index) => updateCard(index, cards[index]));
  };

  return { element, render, update };
};

export const createCounters = () => {
  const movesValue = el('span', { cls: 'counter__value' });
  const pairsValue = el('span', { cls: 'counter__value' });

  const element = el('div', { cls: 'counters' }, [
    el('p', { cls: 'counter' }, ['Ходы: ', movesValue]),
    el('p', { cls: 'counter' }, ['Пары: ', pairsValue]),
  ]);

  const update = ({ moves, pairs }) => {
    movesValue.textContent = String(moves);
    pairsValue.textContent = `${pairs} из ${TOTAL_PAIRS}`;
  };

  return { element, update };
};
