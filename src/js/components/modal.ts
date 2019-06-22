/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/phonon-framework/phonon/blob/master/LICENSE.md)
 * --------------------------------------------------------------------------
 */
import Component from '../component';
import Util from '../util.js';

interface IModalButton {
  class: string;
  event: string;
  text: string;
  dismiss: boolean;
}

export interface IProps {
  element?: HTMLElement|string; // the element must exist
  title?: null|string;
  message?: null|string;
  cancelable?: boolean;
  type?: null|string;
  background?: null|string;
  cancelableKeyCodes?: number[];
  buttons?: IModalButton[];
  center?: boolean;
}

export default class Modal extends Component {

  public static attachDOM() {
    const className = 'modal';

    Util.Observer.subscribe({
      componentClass: className,
      onAdded(element, create) {
        create(new Modal({ element }));
      },
      onRemoved(element, remove) {
        remove('Modal', element);
      },
    });

    document.addEventListener(Util.Event.CLICK, (event: Event) => {
      const target: HTMLElement|null = event.target as HTMLElement;

      if (!target) {
        return;
      }

      const toggleEl = Util.Selector.closest(target, `[data-toggle="${className}"]`);

      if (toggleEl) {
        const selector: string|null = toggleEl.getAttribute('data-target');

        if (!selector) {
          return;
        }

        const modal: HTMLElement|null = document.querySelector(selector);

        if (!modal) {
          return;
        }

        const modalComponent = Util.Observer.getComponent(className, { element: modal });

        if (!modalComponent) {
          return;
        }

        // remove the focus state of the trigger
        target.blur();

        modalComponent.show();
      }
    });
  }

  private backdropSelector: string = 'modal-backdrop';
  private elementGenerated: boolean = false;

  /**
   *
   * @param props
   */
  constructor(props: IProps, autoCreate: boolean = true) {
    super('modal', {
      title: null,
      message: null,
      cancelable: true,
      background: null,
      cancelableKeyCodes: [
        27, // Escape
        13, // Enter
      ],
      buttons: [
        { event: 'confirm', text: 'Ok', dismiss: true, class: 'btn btn-primary' },
      ],
      center: true,
    },    props);

    this.setTemplate(''
      + '<div class="modal" tabindex="-1" role="modal" data-no-boot>'
      + '<div class="modal-inner" role="document">'
        + '<div class="modal-content">'
          + '<div class="modal-header">'
            + '<h5 class="modal-title"></h5>'
            + '<button type="button" class="icon-close" data-dismiss="modal" aria-label="Close">'
              + '<span class="icon" aria-hidden="true"></span>'
            + '</button>'
          + '</div>'
          + '<div class="modal-body">'
            + '<p></p>'
          + '</div>'
          + '<div class="modal-footer">'
          + '</div>'
        + '</div>'
      + '</div>'
    + '</div>');

    if (autoCreate && this.getElement() === null) {
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
    const title = this.getProp('title');

    if (title !== null) {
      element.querySelector('.modal-title').innerHTML = title;
    }

    // message
    const message = this.getProp('message');

    if (message !== null) {
      element.querySelector('.modal-body').firstChild.innerHTML = message;
    } else {
      // remove paragraph node
      this.removeTextBody();
    }

    // cancelable
    const cancelable = this.getProp('cancelable');

    if (!cancelable) {
      element.querySelector('.close').style.display = 'none';
    }

    // buttons
    const buttons = this.getProp('buttons');

    if (Array.isArray(buttons) && buttons.length > 0) {
      buttons.forEach((button) => {
        element.querySelector('.modal-footer').appendChild(this.buildButton(button));
      });
    } else {
      this.removeFooter();
    }

    document.body.appendChild(element);
  }

  /**
   * Shows the modal
   * @returns {Boolean}
   */
  public show(): boolean {
    const element = this.getElement();

    if (element === null) {
      // build and insert a new DOM element
      this.build();
    }

    if (element.classList.contains('show')) {
      return false;
    }

    // update body overflow
    document.body.style.overflow = 'hidden';

    // add a timeout so that the CSS animation works
    (async () => {
      await Util.sleep(20);

      this.triggerEvent(Util.Event.SHOW);
      this.buildBackdrop();

      // attach event
      this.attachEvents();

      const onShown = () => {
        this.triggerEvent(Util.Event.SHOWN);
        element.removeEventListener(Util.Event.TRANSITION_END, onShown);
      };

      element.addEventListener(Util.Event.TRANSITION_END, onShown);

      if (this.getProp('center')) {
        this.center();
      }

      element.classList.add('show');
    })();

    return true;
  }

  /**
   * Hides the modal
   * @returns {Boolean}
   */
  public hide(): boolean {
    const element = this.getElement();

    if (!element.classList.contains('show')) {
      return false;
    }

    // reset body overflow
    document.body.style.overflow = 'visible';

    this.triggerEvent(Util.Event.HIDE);

    this.detachEvents();

    element.classList.add('hide');
    element.classList.remove('show');

    const backdrop = this.getBackdrop();

    const onHidden = () => {
      if (backdrop) {
        document.body.removeChild(backdrop);
        backdrop.removeEventListener(Util.Event.TRANSITION_END, onHidden);
      }

      element.classList.remove('hide');

      this.triggerEvent(Util.Event.HIDDEN);

      // remove generated modals from the DOM
      if (this.elementGenerated) {
        document.body.removeChild(element);
      }
    };

    if (backdrop) {
      backdrop.addEventListener(Util.Event.TRANSITION_END, onHidden);
      backdrop.classList.add('fadeout');
    }

    return true;
  }

  public onElementEvent(event: KeyboardEvent): void {
    // keyboard event (escape and enter)
    if (event.type === 'keyup') {
      const keycodes = this.getProp('cancelableKeyCodes');

      if (keycodes.find(k => k === event.keyCode)) {
        this.hide();
      }
      return;
    }

    // backdrop event
    if (event.type === Util.Event.START) {
      // hide the modal
      this.hide();
      return;
    }

    // button event
    if (event.type === Util.Event.CLICK) {
      const target = event.target as HTMLElement;
      const eventName = target.getAttribute('data-event');

      if (eventName) {
        this.triggerEvent(eventName);
      }

      const dismissButton = Util.Selector.closest(target, '[data-dismiss]');

      if (dismissButton && dismissButton.getAttribute('data-dismiss') === 'modal') {
        this.hide();
      }
    }
  }

  private setBackgroud(): void {
    const element = this.getElement();
    const background = this.getProp('background');

    if (!background) {
      return;
    }

    if (!element.classList.contains(`modal-${background}`)) {
      element.classList.add(`modal-${background}`);
    }

    if (!element.classList.contains('text-white')) {
      element.classList.add('text-white');
    }
  }

  private buildButton(buttonInfo: IModalButton): HTMLElement {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('class', buttonInfo.class || 'btn');
    button.setAttribute('data-event', buttonInfo.event);
    button.innerHTML = buttonInfo.text;

    if (buttonInfo.dismiss) {
      button.setAttribute('data-dismiss', 'modal');
    }

    return button;
  }

  private buildBackdrop(): void {
    const backdrop = document.createElement('div');
    backdrop.setAttribute('data-id', this.getId() as string);
    backdrop.classList.add(this.backdropSelector);

    document.body.appendChild(backdrop);
  }

  private getBackdrop(): HTMLElement|null {
    return document.querySelector(`.${this.backdropSelector}[data-id="${this.getId()}"]`);
  }

  private removeTextBody(): void {
    const element = this.getElement();
    element.querySelector('.modal-body')
      .removeChild(element.querySelector('.modal-body').firstChild);
  }

  private removeFooter(): void {
    const element = this.getElement();
    const footer = element.querySelector('.modal-footer');
    element.querySelector('.modal-content').removeChild(footer);
  }

  private center(): void {
    const element = this.getElement();
    const computedStyle = window.getComputedStyle(element);

    if (computedStyle && computedStyle.height) {
      // todo test
      const height: string = computedStyle.height.slice(0, computedStyle.height.length - 2);
      const top = (window.innerHeight / 2) - (parseFloat(height) / 2);
      element.style.top = `${top}px`;
    }
  }

  private attachEvents(): void {
    const element = this.getElement();
    const buttons = Array
      .from(element.querySelectorAll('[data-dismiss], .modal-footer button') || []);

    buttons.forEach(button => this.registerElement({
      target: button as HTMLElement,
      event: Util.Event.CLICK,
    }));

    // add events if the modal is cancelable
    // which means the user can hide the modal
    // by pressing the ESC key or click on the backdrop
    const cancelable = this.getProp('cancelable');
    const backdrop = this.getBackdrop();

    if (cancelable && backdrop) {
      this.registerElement({ target: backdrop as HTMLElement, event: Util.Event.START });
      this.registerElement({ target: document as HTMLDocument, event: 'keyup' });
    }
  }

  private detachEvents(): void {
    const element = this.getElement();
    const buttons = Array
      .from(element.querySelectorAll('[data-dismiss], .modal-footer button') || []);

    buttons.forEach(button => this.unregisterElement({
      target: button as HTMLElement,
      event: Util.Event.CLICK,
    }));

    const cancelable = this.getProp('cancelable');

    if (cancelable) {
      const backdrop = this.getBackdrop();
      this.unregisterElement({ target: backdrop as HTMLElement, event: Util.Event.START });
      this.unregisterElement({ target: document as HTMLDocument, event: 'keyup' });
    }
  }
}

// static boot
Modal.attachDOM();
