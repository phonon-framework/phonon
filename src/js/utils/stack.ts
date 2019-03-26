import Component from '../component';

/*
 * Component stack
 */
const components = {};

function getName(component: Component|string) {
  if (typeof component === 'string') {
    return component.toLowerCase();
  }

  return component.constructor.name.toLowerCase();
}

/**
 * Add a component in the stack
 */
function addComponent(component: Component) {
  const name = getName(component);

  if (!components[name]) {
    components[name] = [];
  }

  components[name].push(component);
}

/**
 * Remove a component in the stack
 */
function removeComponent(componentName: string, element: HTMLElement) {
  const name = getName(componentName);
  const index = (components[name] || []).findIndex(c => c.getElement() === element);

  if (index === -1) {
    return;
  }

  const component = components[name][index];
  component.destroy();

  components[name].splice(index, 1);
}

/**
 * Retrieves the component
 */
function getComponent(component: string|Component, options: any) {
  const className = getName(component);
  const { element } = options;

  if (!element) {
    return null;
  }

  const selector = typeof element === 'string' ? document.querySelector(element) : element;
  const existingComponent = (components[className] || [])
    .find((c: Component) => c.getElement() === selector);

  if (!existingComponent) {
    return null;
  }

  if (options) {
    existingComponent.updateProps(options);
  }

  return existingComponent;
}

export default {
  addComponent,
  getComponent,
  removeComponent,
};
