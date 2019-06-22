/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/phonon-framework/phonon/blob/master/LICENSE.md)
 * --------------------------------------------------------------------------
 */
import Util from './util.js';

interface IEventElement {
  target: HTMLElement|HTMLDocument;
  event: string;
}

interface IMainProps {
  element?: HTMLElement|string|null;
}

export default class Component {
  private name: string;
  private template: string = '';
  private props: object;
  private defaultProps: object;
  private id: string|null = null;
  private eventHandlers: any[] = [];
  private registeredElements: any[] = [];
  private elementListener: EventListenerOrEventListenerObject;

  constructor(name: string, defaultProps: object, props: IMainProps) {
    this.name = name;

    const element = typeof props.element === 'string'
      ? document.querySelector(props.element) : props.element;
    let config: object = {};

    if (element) {
      const dataConfig = Util.Selector.attrConfig(element);
      if (dataConfig) {
        config = dataConfig;
      }
    }

    this.defaultProps = defaultProps;
    this.props = (Object as any).assign(defaultProps, config, props, { element });
    this.id = this.uid();

    this.elementListener = (event: Event) => this.onBeforeElementEvent(event);
    this.setEventsHandler();
  }

  public setTemplate(template: string) {
    this.template = template;
  }

  public getTemplate(): string {
    return this.template;
  }

  public getElement() {
    return this.getProp('element') || null;
  }

  public setElement(element: HTMLElement) {
    (this.props as IMainProps).element = element;
  }

  public getId() {
    return this.id;
  }

  public uid() {
    return Math.random().toString(36).substr(2, 10);
  }

  public getName() {
    return this.name;
  }

  public getProps() {
    return this.props;
  }

  public getProp(name: string) {
    const defaultValue = this.defaultProps[name];
    return typeof this.props[name] !== 'undefined' ? this.props[name] : defaultValue;
  }

  public setProps(props: object) {
    // element is read-only
    const componentProps = (Object as any).assign({}, props); // shallow copy
    this.props = Object.assign(this.props, componentProps);
  }

  public setProp(name: string, value: any) {
    if (typeof this.props[name] === 'undefined') {
      throw new Error('Cannot set an invalid prop');
    }

    this.props[name] = value;
  }

  public registerElements(elements: IEventElement[]) {
    elements.forEach(element => this.registerElement(element));
  }

  public registerElement(element: IEventElement) {
    element.target.addEventListener(element.event, this.elementListener);
    this.registeredElements.push(element);
  }

  public unregisterElements() {
    this.registeredElements.forEach((element) => {
      this.unregisterElement(element);
    });
  }

  public unregisterElement(element: IEventElement) {
    const registeredElementIndex = this.registeredElements
      .findIndex(el => el.target === element.target && el.event === element.event);

    if (registeredElementIndex > -1) {
      element.target.removeEventListener(element.event, this.elementListener);
      this.registeredElements.splice(registeredElementIndex, 1);
    } else {
      console.error('Warning! Could not remove element:'
        + ' ' + `${element.target} with event: ${element.event}.`);
    }
  }

  public triggerEvent(eventName: string, detail = {}, objectEventOnly = false) {
    /*
    if (this.addToStack) {
      if (eventName === Event.SHOW) {
        ComponentManager.add(this);
      } else if (eventName === Event.HIDE) {
        ComponentManager.remove(this);
      }
    }
    */

    // event names can be with dot notation like reconnecting.success
    const eventNameObject = eventName.split('.').reduce((acc, current, index) => {
      if (index === 0) {
        return current;
      }

      return acc + current.charAt(0).toUpperCase() + current.slice(1);
    });

    const eventNameAlias = `on${eventNameObject
      .charAt(0).toUpperCase()}${eventNameObject.slice(1)}`;

    // object event
    const props = this.getProps();

    this.eventHandlers.forEach((scope) => {
      if (typeof scope[eventNameObject] === 'function') {
        scope[eventNameObject].apply(this, [detail]);
      }

      if (typeof scope[eventNameAlias] === 'function') {
        props[eventNameAlias].apply(this, [detail]);
      }
    });

    if (objectEventOnly) {
      return;
    }

    // dom event
    const element = this.getElement();

    if (element) {
      Util.Dispatch.elementEvent(element, eventName, this.name, detail);
    } else {
      Util.Dispatch.winDocEvent(eventName, this.name, detail);
    }
  }

  /**
   * the preventClosable method manages concurrency between active components.
   * For example, if there is a shown off-canvas and modal, the last
   * shown component gains the processing priority
   */
  public preventClosable() {
    return false;
    // return this.addToStack && !ComponentManager.closable(this);
  }

  /**
   * Destroys the component if it has been removed from the DOM tree
   * This happens when removeChild() removed the markup
   */
  public destroy() {
    // the default behavior is to unregister events
    // each component is responsible to hide the component depending on its state
    this.unregisterElements();
  }

  /**
   * @emits {Event} emit events registered by the component
   * @param {Event} event
   */
  public onElementEvent(event: Event) {
    /* eslint: no-empty */
  }

  private setEventsHandler() {
    const props = this.getProps();
    const scope = Object.keys(props).reduce((cur, key) => {
      if (typeof props[key] === 'function') {
        cur[key] = props[key];
      }

      return cur;
    },                                      {});

    if (Object.keys(scope).length > 0) {
      this.eventHandlers.push(scope);
    }
  }

  private onBeforeElementEvent(event: Event) {
    if (this.preventClosable()) {
      return;
    }

    this.onElementEvent(event);
  }
}
