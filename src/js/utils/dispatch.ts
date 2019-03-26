function elementEvent(domElement, eventName, moduleName, detail = {}) {
  const fullEventName = `${eventName}.ph.${moduleName}`;
  domElement.dispatchEvent(new CustomEvent(fullEventName, { detail }));
}

function pageEvent(eventName, pageName, detail = {}) {
  const fullEventName = `${pageName}.${eventName}`;
  window.dispatchEvent(new CustomEvent(fullEventName, { detail }));
  document.dispatchEvent(new CustomEvent(fullEventName, { detail }));
}

function winDocEvent(eventName, moduleName, detail = {}) {
  const fullEventName = `${eventName}.ph.${moduleName}`;
  window.dispatchEvent(new CustomEvent(fullEventName, { detail }));
  document.dispatchEvent(new CustomEvent(fullEventName, { detail }));
}

export default {
  elementEvent,
  pageEvent,
  winDocEvent,
};
