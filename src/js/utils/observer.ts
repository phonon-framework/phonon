import Component from '../component';
import { isElement } from './selector';
import stack from './stack';

/*
 * Interface for components that have subscribed
 * to DOM changes (nodes added or removed)
 */
export interface IMutatorSubscriber {
  componentClass: string;
  onAdded?: (element: HTMLElement, create: (component: Component) => void) => void;
  /* tslint:disable:max-line-length */
  onRemoved?: (element: HTMLElement, remove: (className: string, element: HTMLElement) => void) => void;
}

/*
 * List of component subscribers
 * A component subscribes to relevant DOM changes (nodes added or removed)
 */
const mutatorSubscribers: IMutatorSubscriber[] = [];

/**
 * Observes for node mutations
 */
function subscribe(subscriber: IMutatorSubscriber) {
  mutatorSubscribers.push(subscriber);

  if (document.body) {
    Array.from(document.body.querySelectorAll(`.${subscriber.componentClass}`) || [])
      .filter(component => !component.getAttribute('data-no-boot'))
      .forEach((component) => {
        dispatchChangeEvent(subscriber, 'onAdded', component as HTMLElement, stack.addComponent);
      });
  }
}

/**
 * Dispatch DOM changes such as nodes added and removed
 * @param subscriber
 * @param eventName
 * @param args
 */
function dispatchChangeEvent(subscriber: IMutatorSubscriber, eventName: string, ...args: any[]) {
  const callback = subscriber[eventName];

  if (!callback) {
    return;
  }

  callback.apply(callback, args);
}

function nodeFn(element: HTMLElement, added = true) {
  const elementClasses = element.className.split(' ');
  const subscriber = mutatorSubscribers.find(l => elementClasses.indexOf(l.componentClass) > -1);

  if (!subscriber) {
    return;
  }

  const eventName = added ? 'onAdded' : 'onRemoved';
  const args = added ? [element, stack.addComponent] : [element, stack.removeComponent];

  dispatchChangeEvent(subscriber, eventName, ...args);
}

function apply(node, added = true) {
  nodeFn(node, added);

  let nextNode = node.firstElementChild;

  while (nextNode) {
    const next = nextNode.nextElementSibling;

    if (isElement(nextNode)) {
      apply(nextNode, added);
    }

    nextNode = next;
  }
}

function getElements(nodes: NodeList) {
  return Array
    .from(nodes)
    .filter((node: Node) => isElement(node) && !(node as HTMLElement).getAttribute('data-no-boot'));
}

function observe() {
  (new MutationObserver(mutations => mutations.forEach((mutation: MutationRecord) => {
    if (mutation.type === 'attributes') {
      // stop observing attrs
      return;
    }

    const { addedNodes, removedNodes } = mutation;

    // added nodes
    getElements(addedNodes).forEach(node => apply(node, true));

    // removed nodes
    getElements(removedNodes).forEach(node => apply(node, false));
  }))).observe(document, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
  });
}

function boot() {
  if (!('MutationObserver' in window)) {
    return;
  }

  // DOM
  if (document.body) {
    observe();
  } else {
    const obs = new MutationObserver(() => {
      if (document.body) {
        obs.disconnect();
        observe();
      }
    });

    // virtual DOM
    obs.observe(document, { childList: true, subtree: true });
  }
}

boot();

export default {
  subscribe,
  getComponent: stack.getComponent,
};
