import './style.css';
import { createBoard, createCounters } from './scripts/board.js';
import { createGame } from './scripts/game.js';
import { el } from './scripts/dom.js';

const counters = createCounters();
const board = createBoard({ onPick: (index) => game.pick(index) });

const game = createGame({
  onReset(state) {
    board.render(state.cards);
    counters.update(state);
  },
  onCardsChange: board.update,
  onCountersChange: counters.update,
  onWin(moves) {
    // TODO: сохранить результат и открыть модальное окно победы.
    console.log(`Победа за ${moves} ходов`);
  },
});

const header = el('header', { cls: 'header' }, [
  el('h1', { cls: 'header__title', text: 'Найди пару' }),
  el('div', { cls: 'header__actions' }, [
    el('button', {
      cls: 'btn btn--primary',
      text: 'Новая игра',
      attrs: { type: 'button' },
      on: { click: () => game.start() },
    }),
    el('button', {
      cls: 'btn',
      text: 'Таблица лидеров',
      attrs: { type: 'button' },
      on: {
        click() {
          // TODO: открыть модальное окно таблицы лидеров.
        },
      },
    }),
  ]),
]);

const main = el('main', { cls: 'game' }, [counters.element, board.element]);

document.body.append(header, main);
game.start();
