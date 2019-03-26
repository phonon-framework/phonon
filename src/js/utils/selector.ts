/*
 * Polyfill from https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
 *
 */
function closest(element: HTMLElement, selector: string) {
  // avoid undefined property for ms
  const matches = (Element as any).prototype.msMatchesSelector ||
                  Element.prototype.webkitMatchesSelector;

  let el: HTMLElement = element;

  do {

    if (el.matches(selector)) {
      return el;
    }
    el = (el.parentElement || el.parentNode) as HTMLElement;
  } while (el !== null && el.nodeType === 1);

  return null;
}

function attrConfig(element): null|object {
  if (!element) {
    return null;
  }

  const attr = element.getAttribute('data-config');

  if (!attr) {
    return null;
  }

  try {
    const config = JSON.parse(attr);
    return config;
  } catch (e) {
    // silent error
  }

  const keys = (attr.match(/(\w+)\s*:\s*(["'])?/igm) || [])
    .map(e => e.replace(/(\w+)\s*:\s*(["'])?/igm, '$1'));
  const values = attr.match(/[^:]+(?=,|$)/igm) || [];
  const json = {};

  keys.forEach((key, i) => {
    const value = values[i].replace(/ /g, '').replace(/\'|"/g, '');
    let convertedValue: any = '';

    if (value === 'true' || value === 'false') {
      convertedValue = value === 'true';
    } else if (!isNaN(value)) {
      convertedValue = parseFloat(value);
    } else {
      // fallback in string type
      convertedValue = value;
    }

    json[key] = convertedValue;
  });

  return json;
}

function removeClasses(element: HTMLElement, classList: string[], prefix: string|null = null) {
  classList.forEach((className) => {
    const cName = prefix ? `${prefix}-${className}` : className;

    if (element.classList.contains(cName)) {
      element.classList.remove(cName);
    }
  });
}

export function isElement(node: Node): boolean {
  return node.nodeType === 1 // element node like <p> or <div>
    // SVG type has object className (containing SVGAnimatedString)
    && typeof (node as HTMLElement).className === 'string';
}

export default {
  attrConfig,
  removeClasses,
  closest,
  isElement,
};
