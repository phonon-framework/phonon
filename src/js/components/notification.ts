/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/phonon-framework/phonon/blob/master/LICENSE.md)
 * --------------------------------------------------------------------------
 */
import Component from '../component';
import { Color, Direction } from '../mixins';
import Util from '../util.js';

interface IProps {
  element?: HTMLElement|null|string;
  title?: string;
  message?: string;
  button?: boolean;
  timeout?: null;
  background?: Color.primary;
  directionX?: 'right';
  directionY?: 'top';
  offsetX?: 0;
  offsetY?: 0;
  appendIn?: HTMLElement|string;
}

export default class Notification extends Component {

  public static attachDOM(): void {
    Util.Observer.subscribe({
      componentClass: 'notification',
      onAdded(element, create) {
        create(new Notification({ element }));
      },
      onRemoved(element, remove) {
        remove('Notification', element);
      },
    });
  }

  private timeoutCallback: any = null;
  private elementGenerated: boolean = false;

  /**
   *
   * @param props
   */
  constructor(props: IProps = { element: null, title: '', button: true }) {
    super('notification', {
      button: true,
      timeout: null,
      title: '',
      message: null,
      background: 'primary', // show primary by default
      appendIn: document.body,
      directionX: 'right',
      directionY: 'top',
      offsetX: 0,
      offsetY: 0,
    },    props);

    /* tslint:disable:max-line-length */
    this.setTemplate(''
    + '<div class="notification" data-no-boot>'
      + '<div class="notification-inner">'
        + '<div class="notification-header">'
          + '<h5 class="notification-title"></h5>'
          + '<button type="button" class="icon-close" data-dismiss="notification" aria-label="Close">'
            + '<span class="icon" aria-hidden="true"></span>'
          + '</button>'
        + '</div>'
        + '<div class="notification-body"></div>'
      + '</div>'
    + '</div>');

    if (this.getElement() === null) {
      this.build();
    }
  }

  public build(): void {
    this.elementGenerated = true;

    const builder = document.createElement('div');

    builder.innerHTML = this.getTemplate();

    this.setElement(builder.firstChild as HTMLElement);

    const element = this.getElement();

    // title
    element.querySelector('.notification-title').innerHTML = this.getProp('title');

    // text body
    if (this.getProp('message')) {
      element.querySelector('.notification-body').innerHTML = this.getProp('message');
    } else {
      element.querySelector('.notification-body').style.display = 'none';
    }

    if (!this.getProp('button')) {
      element.querySelector('button').style.display = 'none';
    }

    const container = this.getProp('appendIn');

    container.appendChild(element);
  }

  public setPosition(): void {
    const x = this.getProp('directionX');
    const y = this.getProp('directionY');
    const offsetX = this.getProp('offsetX');
    const offsetY = this.getProp('offsetY');

    const notification = this.getElement();
    const directions = ['top', 'right', 'bottom', 'left'];

    Util.Selector.removeClasses(notification, Object.values(Direction));

    notification.style.marginLeft = '0px';
    notification.style.marginRight = '0px';

    notification.classList.add(`notification-${x}`);
    notification.classList.add(`notification-${y}`);

    const activeNotifications: HTMLElement[] = Array
      .from(document.querySelectorAll('.notification.show') || []);
    let totalNotifY = 0;

    activeNotifications.forEach((n: HTMLElement) => {
      if (notification !== n) {
        const style: any = getComputedStyle(n);
        const top = parseInt(style.marginTop, 10);
        const bottom = parseInt(style.marginBottom, 10);
        totalNotifY += n.offsetHeight + top + bottom;
      }
    });

    notification.style.transform = `translateY(${y === 'top' ? '' : '-'}${totalNotifY}px)`;

    notification.style[`margin${x.replace(/^\w/, c => c.toUpperCase())}`] = `${offsetX}px`;
    notification.style[`margin${y.replace(/^\w/, c => c.toUpperCase())}`] = `${offsetY}px`;
  }

  /**
   * Shows the notification
   * @returns {Boolean}
   */
  public show(): boolean {
    if (this.getElement() === null) {
      // build and insert a new DOM element
      this.build();
    }

    const element = this.getElement();

    if (element.classList.contains('show')) {
      return false;
    }

    // reset color
    const background = this.getProp('background');

    if (background) {
      element.removeAttribute('class');
      element.setAttribute('class', 'notification');

      element.classList.add(`notification-${background}`);
      element.querySelector('button').classList.add(`btn-${background}`);
    }

    const buttonElement = element.querySelector('button[data-dismiss]');
    const button = this.getProp('button');

    if (button && buttonElement) {
      // attach the button handler
      this.registerElement({ target: buttonElement, event: Util.Event.CLICK });
    }

    const toggleButton = element.querySelector('button[data-dismiss]');

    this.registerElement({ target: buttonElement, event: Util.Event.CLICK });

    (async () => {
      await Util.sleep(20);

      // set position after sleep
      this.setPosition();

      const timeout = this.getProp('timeout');

      if (Number.isInteger(timeout) && timeout > 0) {
        // if there is a timeout, auto hide the notification
        this.timeoutCallback = setTimeout(() => {
          this.hide();
        },                                timeout + 1);
      }

      element.classList.add('show');

      this.triggerEvent(Util.Event.SHOW);

      const onShown = () => {
        this.triggerEvent(Util.Event.SHOWN);
        element.removeEventListener(Util.Event.TRANSITION_END, onShown);
      };

      element.addEventListener(Util.Event.TRANSITION_END, onShown);
    })();

    return true;
  }

  public hideBody(): void {
    const body = this.getElement().querySelector('.notification-body');
    if (body.classList.contains('show')) {
      body.classList.remove('show');
    }
  }

  /**
   * Hides the notification
   * @returns {Boolean}
   */
  public hide(): boolean {
    /*
    * prevent to close a notification with a timeout
    * if the user has already clicked on the button
    */
    if (this.timeoutCallback) {
      clearTimeout(this.timeoutCallback);
      this.timeoutCallback = null;
    }

    const element = this.getElement();

    if (!element.classList.contains('show')) {
      return false;
    }

    this.triggerEvent(Util.Event.HIDE);

    const button = this.getProp('button');
    const buttonElement = element.querySelector('button[data-dismiss]');

    if (button && buttonElement) {
      this.unregisterElement({ target: buttonElement, event: Util.Event.CLICK });
    }

    element.classList.remove('show');
    element.classList.add('hide');

    this.hideBody();

    const onHidden = () => {
      element.removeEventListener(Util.Event.TRANSITION_END, onHidden);
      element.classList.remove('hide');

      this.triggerEvent(Util.Event.HIDDEN);

      if (this.elementGenerated) {
        document.body.removeChild(element);
      }
    };

    element.addEventListener(Util.Event.TRANSITION_END, onHidden);

    return true;
  }

  public onElementEvent(): void {
    this.hide();
  }
}
