import { el } from './dom.js';

const SCROLL_LOCK_CLASS = 'modal-open';

export const createModal = () => {
  const title = el('h2', { cls: 'modal__title', attrs: { id: 'modal-title' } });
  const body = el('div', { cls: 'modal__body' });
  const actions = el('div', { cls: 'modal__actions' });
  const content = el('div', { cls: 'modal__content' }, [title, body, actions]);

  const dialog = el(
    'dialog',
    { cls: 'modal', attrs: { 'aria-labelledby': 'modal-title' } },
    [content],
  );

  const closeButton = el('button', {
    cls: 'btn',
    text: 'Закрыть',
    attrs: { type: 'button' },
    on: { click: () => close() },
  });

  let pressedOnBackdrop = false;

  dialog.addEventListener('pointerdown', (event) => {
    pressedOnBackdrop = event.target === dialog;
  });

  dialog.addEventListener('click', (event) => {
    if (pressedOnBackdrop && event.target === dialog) {
      close();
    }

    pressedOnBackdrop = false;
  });

  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
  });

  document.body.append(dialog);

  const open = ({
    title: titleText,
    body: bodyNodes = [],
    actions: actionNodes = [],
  }) => {
    title.textContent = titleText;
    body.replaceChildren(...bodyNodes);
    actions.replaceChildren(...actionNodes, closeButton);

    if (dialog.open) {
      return;
    }

    dialog.showModal();
    document.documentElement.classList.add(SCROLL_LOCK_CLASS);
  };

  const close = () => {
    if (dialog.open) {
      dialog.close();
    }
  };

  return { open, close };
};
