export const el = (tag, options = {}, children = []) => {
  const { cls, text, attrs = {}, on = {} } = options;
  const node = document.createElement(tag);

  if (cls) {
    node.className = cls;
  }

  if (text !== undefined && text !== null) {
    node.textContent = String(text);
  }

  Object.entries(attrs).forEach(([name, value]) => {
    node.setAttribute(name, value);
  });

  Object.entries(on).forEach(([event, handler]) => {
    node.addEventListener(event, handler);
  });

  node.append(...children);
  return node;
};

export const setChildren = (node, children = []) => {
  node.replaceChildren(...children);

  return node;
};
