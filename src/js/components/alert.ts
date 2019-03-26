/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Component from '../component';
import Util from '../util.js';

interface IProps {
  element?: HTMLElement|string; // the element must exist
  fade?: boolean;
}

export default class Alert extends Component {

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */
  public static attachDOM(): void {
    Util.Observer.subscribe({
      componentClass: 'alert',
      onAdded(element, create) {
        create(new Alert({ element }));
      },
      onRemoved(element, remove) {
        remove('Alert', element);
      },
    });
  }

  private onTransition: boolean = false;

  /**
   *
   * @param props
   */
  constructor(props: IProps = { fade: true }) {
    super('alert', { fade: true }, props);
    // no-template: alert is not a dynamic component

    if (this.getOpacity() !== 0) {
      const target = this.getElement().querySelector('[data-dismiss="alert"]');
      if (target) {
        this.registerElement({ target, event: Util.Event.CLICK });
      }
    }
  }

  /**
   * Shows the alert
   * @returns {Boolean}
   */
  public show(): boolean {
    if (this.onTransition) {
      return false;
    }

    const element = this.getElement();

    if (element.classList.contains('show') && this.getOpacity() !== 0) {
      return false;
    }

    this.onTransition = true;

    this.triggerEvent(Util.Event.SHOW);

    const onShow = () => {
      this.triggerEvent(Util.Event.SHOWN);

      if (element.classList.contains('fade')) {
        element.classList.remove('fade');
      }

      // button
      const target = Util.Selector.closest(this.getElement(), '[data-dismiss="alert"]');

      if (target) {
        this.registerElement({ target, event: Util.Event.CLICK });
      }

      element.removeEventListener(Util.Event.TRANSITION_END, onShow);
      this.onTransition = false;
    };

    const fade = this.getProp('fade');

    if (fade && !element.classList.contains('fade')) {
      element.classList.add('fade');
    }

    element.classList.add('show');

    element.addEventListener(Util.Event.TRANSITION_END, onShow);

    if (element.classList.contains('hide')) {
      element.classList.remove('hide');
    }

    if (!fade) {
      onShow();
    }

    return true;
  }

  /**
   * Hides the alert
   * @returns {Boolean}
   */
  public hide(el?: HTMLElement): boolean {
    if (this.onTransition || this.getOpacity() === 0) {
      return false;
    }

    this.onTransition = true;

    const element = el || this.getElement();

    this.triggerEvent(Util.Event.HIDE);

    const onHide = () => {
      this.triggerEvent(Util.Event.HIDDEN);
      element.removeEventListener(Util.Event.TRANSITION_END, onHide);
      this.onTransition = false;
    };

    const fade = this.getProp('fade');

    if (fade && !element.classList.contains('fade')) {
      element.classList.add('fade');
    }

    element.addEventListener(Util.Event.TRANSITION_END, onHide);

    if (!element.classList.contains('hide')) {
      element.classList.add('hide');
    }

    if (element.classList.contains('show')) {
      element.classList.remove('show');
    }

    if (!fade) {
      onHide();
    }

    return true;
  }

  public onElementEvent(event: Event): void {
    if (event.type !== Util.Event.CLICK) {
      return;
    }

    // dismiss
    this.hide();
  }

  public destroy() {
    this.unregisterElements();
    this.hide();
  }

  private getOpacity(): number {
    const element = this.getElement();
    const { opacity } = window.getComputedStyle(element);
    return parseFloat(opacity || '');
  }
}

// static boot
Alert.attachDOM();
