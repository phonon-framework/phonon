export function dispatchWinDocEvent(eventName, moduleName, detail = {}) {
  const fullEventName = `${eventName}.ph.${moduleName}`
  window.dispatchEvent(new CustomEvent(fullEventName, { detail }))
  document.dispatchEvent(new CustomEvent(fullEventName, { detail }))
}

export function dispatchElementEvent(domElement, eventName, moduleName, detail = {}) {
  const fullEventName = `${eventName}.ph.${moduleName}`
  domElement.dispatchEvent(new CustomEvent(fullEventName, { detail }))
}

export function dispatchPageEvent(eventName, pageName, detail = {}) {
  const fullEventName = `${pageName}.${eventName}`
  window.dispatchEvent(new CustomEvent(fullEventName, { detail }))
  document.dispatchEvent(new CustomEvent(fullEventName, { detail }))
}
